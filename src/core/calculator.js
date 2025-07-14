/**
 * 模块化精度计算器核心类
 * @author Precision Calculator Team
 * @version 1.1.0
 */

// 导入依赖模块
let ConfigManager, globalConfig;
let I18nManager, globalI18n, tError;
let PrecisionCalculatorError, DivisionByZeroError, InvalidInputError, NumberRangeError;
let Validator;
let LRUCache, Memoizer, FastAlgorithms, PerformanceMonitor;
let CalculatorLogger, globalLogger, logOperation;

// 尝试导入模块（支持可选依赖）
try {
  const configModule = require('./config.js');
  ConfigManager = configModule.ConfigManager;
  globalConfig = configModule.globalConfig;
} catch (error) {
  console.warn('配置模块未找到，使用默认配置');
}

try {
  const i18nModule = require('../i18n/index.js');
  I18nManager = i18nModule.I18nManager;
  globalI18n = i18nModule.globalI18n;
  tError = i18nModule.tError;
} catch (error) {
  console.warn('国际化模块未找到，使用默认错误消息');
  tError = (key, params) => `Error: ${key} ${params ? params.join(', ') : ''}`;
}

try {
  const errorsModule = require('../errors/calculator-errors.js');
  PrecisionCalculatorError = errorsModule.PrecisionCalculatorError;
  DivisionByZeroError = errorsModule.DivisionByZeroError;
  InvalidInputError = errorsModule.InvalidInputError;
  NumberRangeError = errorsModule.NumberRangeError;
} catch (error) {
  console.warn('错误模块未找到，使用默认错误类');
  PrecisionCalculatorError = Error;
  DivisionByZeroError = Error;
  InvalidInputError = Error;
  NumberRangeError = Error;
}

try {
  const validatorModule = require('../utils/validator.js');
  Validator = validatorModule.Validator;
} catch (error) {
  console.warn('验证模块未找到，使用简单验证');
  Validator = {
    validateNumber: (value) => {
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error('Invalid number');
      }
    },
    validatePrecision: (precision) => {
      if (!Number.isInteger(precision) || precision < 0) {
        throw new Error('Invalid precision');
      }
    }
  };
}

try {
  const performanceModule = require('../utils/performance.js');
  LRUCache = performanceModule.LRUCache;
  Memoizer = performanceModule.Memoizer;
  FastAlgorithms = performanceModule.FastAlgorithms;
  PerformanceMonitor = performanceModule.PerformanceMonitor;
} catch (error) {
  console.warn('性能模块未找到，使用默认实现');
  LRUCache = class { constructor() { this.cache = new Map(); } get(key) { return this.cache.get(key); } set(key, value) { this.cache.set(key, value); } };
  Memoizer = { memoize: (fn) => fn };
  FastAlgorithms = {};
  PerformanceMonitor = class { constructor() {} start() {} end() {} getMetrics() { return {}; } };
}

try {
  const loggerModule = require('../utils/logger.js');
  CalculatorLogger = loggerModule.CalculatorLogger;
  globalLogger = loggerModule.globalLogger;
  logOperation = loggerModule.logOperation;
} catch (error) {
  console.warn('日志模块未找到，使用控制台日志');
  globalLogger = { info: console.log, error: console.error, warn: console.warn };
  logOperation = (fn) => fn;
}

/**
 * 精度计算器核心类
 */
class PrecisionCalculator {
  constructor(options = {}) {
    // 初始化配置
    this.config = globalConfig || this.createDefaultConfig();
    if (options.config) {
      this.config.setConfig(options.config, true);
    }
    
    // 初始化国际化
    this.i18n = globalI18n || this.createDefaultI18n();
    if (options.locale) {
      this.i18n.setLocale(options.locale);
    }
    
    // 初始化缓存
    this.cache = new LRUCache(this.config.get('performance.cacheSize', 1000));
    
    // 初始化性能监控
    this.performanceMonitor = new PerformanceMonitor();
    
    // 初始化日志
    this.logger = globalLogger || console;
    
    // 绑定方法
    this.add = this.add.bind(this);
    this.subtract = this.subtract.bind(this);
    this.multiply = this.multiply.bind(this);
    this.divide = this.divide.bind(this);
    
    // 应用记忆化（如果启用）
    if (this.config.get('performance.memoizeFactorial', true)) {
      this.factorial = Memoizer.memoize(this.factorial.bind(this));
    }
    
    if (this.config.get('performance.memoizePower', true)) {
      this.power = Memoizer.memoize(this.power.bind(this));
    }
  }

  /**
   * 创建默认配置
   */
  createDefaultConfig() {
    return {
      get: (path, defaultValue) => {
        const configs = {
          'precision.default': 10,
          'performance.cacheSize': 1000,
          'performance.cacheEnabled': true,
          'performance.memoizeFactorial': true,
          'performance.memoizePower': true,
          'errorHandling.mode': 'throw',
          'logging.enabled': true
        };
        return configs[path] !== undefined ? configs[path] : defaultValue;
      },
      setConfig: () => {}
    };
  }

  /**
   * 创建默认国际化
   */
  createDefaultI18n() {
    return {
      setLocale: () => {},
      getErrorMessage: (type, params) => `Error: ${type} ${params ? params.join(', ') : ''}`
    };
  }

  /**
   * 获取缓存键
   * @param {string} operation - 操作名称
   * @param {Array} args - 参数数组
   * @returns {string} 缓存键
   */
  getCacheKey(operation, args) {
    return `${operation}:${args.map(arg => String(arg)).join(',')}`;
  }

  /**
   * 执行带缓存的操作
   * @param {string} operation - 操作名称
   * @param {Array} args - 参数数组
   * @param {Function} fn - 执行函数
   * @returns {*} 操作结果
   */
  executeWithCache(operation, args, fn) {
    if (!this.config.get('performance.cacheEnabled', true)) {
      return fn();
    }
    
    const cacheKey = this.getCacheKey(operation, args);
    const cached = this.cache.get(cacheKey);
    
    if (cached !== undefined) {
      this.logger.info && this.logger.info(`Cache hit: ${operation}`);
      return cached;
    }
    
    const result = fn();
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * 处理错误
   * @param {Error} error - 错误对象
   * @param {string} operation - 操作名称
   * @param {Array} args - 参数数组
   */
  handleError(error, operation, args) {
    const errorMode = this.config.get('errorHandling.mode', 'throw');
    
    // 记录错误日志
    if (this.config.get('logging.enabled', true)) {
      this.logger.error && this.logger.error(`Operation failed: ${operation}`, error);
    }
    
    switch (errorMode) {
      case 'throw':
        throw error;
      case 'null':
        return null;
      case 'nan':
        return NaN;
      case 'inf':
        return Infinity;
      case 'log_throw':
        this.logger.error && this.logger.error(`Error in ${operation}:`, error);
        throw error;
      case 'log_return':
        this.logger.error && this.logger.error(`Error in ${operation}:`, error);
        return null;
      default:
        throw error;
    }
  }

  /**
   * 精确加法
   * @param {number|string} a - 加数
   * @param {number|string} b - 被加数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  add(a, b, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      // 参数验证
      Validator.validateNumber(a);
      Validator.validateNumber(b);
      Validator.validatePrecision(actualPrecision);
      
      return this.executeWithCache('add', [a, b, actualPrecision], () => {
        const numA = Number(a);
        const numB = Number(b);
        
        // 检查数值范围
        if (!isFinite(numA) || !isFinite(numB)) {
          throw new NumberRangeError(this.i18n.getErrorMessage('numberRange', [a, b]));
        }
        
        // 使用字符串精确计算避免浮点误差
        const strA = String(numA);
        const strB = String(numB);
        
        const decimalA = strA.includes('.') ? strA.split('.')[1].length : 0;
        const decimalB = strB.includes('.') ? strB.split('.')[1].length : 0;
        const maxDecimal = Math.max(decimalA, decimalB);
        
        const multiplier = Math.pow(10, maxDecimal);
        const intA = Math.round(numA * multiplier);
        const intB = Math.round(numB * multiplier);
        
        const result = (intA + intB) / multiplier;
        
        return Number(result.toFixed(actualPrecision));
      });
    } catch (error) {
      return this.handleError(error, 'add', [a, b, precision]);
    }
  }

  /**
   * 精确减法
   * @param {number|string} a - 被减数
   * @param {number|string} b - 减数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  subtract(a, b, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(a);
      Validator.validateNumber(b);
      Validator.validatePrecision(actualPrecision);
      
      return this.executeWithCache('subtract', [a, b, actualPrecision], () => {
        const numA = Number(a);
        const numB = Number(b);
        
        if (!isFinite(numA) || !isFinite(numB)) {
          throw new NumberRangeError(this.i18n.getErrorMessage('numberRange', [a, b]));
        }
        
        const strA = String(numA);
        const strB = String(numB);
        
        const decimalA = strA.includes('.') ? strA.split('.')[1].length : 0;
        const decimalB = strB.includes('.') ? strB.split('.')[1].length : 0;
        const maxDecimal = Math.max(decimalA, decimalB);
        
        const multiplier = Math.pow(10, maxDecimal);
        const intA = Math.round(numA * multiplier);
        const intB = Math.round(numB * multiplier);
        
        const result = (intA - intB) / multiplier;
        
        return Number(result.toFixed(actualPrecision));
      });
    } catch (error) {
      return this.handleError(error, 'subtract', [a, b, precision]);
    }
  }

  /**
   * 精确乘法
   * @param {number|string} a - 乘数
   * @param {number|string} b - 被乘数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  multiply(a, b, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(a);
      Validator.validateNumber(b);
      Validator.validatePrecision(actualPrecision);
      
      return this.executeWithCache('multiply', [a, b, actualPrecision], () => {
        const numA = Number(a);
        const numB = Number(b);
        
        if (!isFinite(numA) || !isFinite(numB)) {
          throw new NumberRangeError(this.i18n.getErrorMessage('numberRange', [a, b]));
        }
        
        const strA = String(numA);
        const strB = String(numB);
        
        const decimalA = strA.includes('.') ? strA.split('.')[1].length : 0;
        const decimalB = strB.includes('.') ? strB.split('.')[1].length : 0;
        
        const multiplier = Math.pow(10, decimalA + decimalB);
        const intA = Math.round(numA * Math.pow(10, decimalA));
        const intB = Math.round(numB * Math.pow(10, decimalB));
        
        const result = (intA * intB) / multiplier;
        
        return Number(result.toFixed(actualPrecision));
      });
    } catch (error) {
      return this.handleError(error, 'multiply', [a, b, precision]);
    }
  }

  /**
   * 精确除法
   * @param {number|string} a - 被除数
   * @param {number|string} b - 除数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  divide(a, b, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(a);
      Validator.validateNumber(b);
      Validator.validatePrecision(actualPrecision);
      
      const numB = Number(b);
      if (numB === 0) {
        throw new DivisionByZeroError(this.i18n.getErrorMessage('divisionByZero'));
      }
      
      return this.executeWithCache('divide', [a, b, actualPrecision], () => {
        const numA = Number(a);
        
        if (!isFinite(numA) || !isFinite(numB)) {
          throw new NumberRangeError(this.i18n.getErrorMessage('numberRange', [a, b]));
        }
        
        const result = numA / numB;
        
        return Number(result.toFixed(actualPrecision));
      });
    } catch (error) {
      return this.handleError(error, 'divide', [a, b, precision]);
    }
  }

  /**
   * 幂运算
   * @param {number|string} base - 底数
   * @param {number|string} exponent - 指数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  power(base, exponent, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(base);
      Validator.validateNumber(exponent);
      Validator.validatePrecision(actualPrecision);
      
      return this.executeWithCache('power', [base, exponent, actualPrecision], () => {
        const numBase = Number(base);
        const numExponent = Number(exponent);
        
        // 使用快速幂算法（如果可用）
        if (FastAlgorithms.fastPower && Number.isInteger(numExponent) && numExponent >= 0) {
          const result = FastAlgorithms.fastPower(numBase, numExponent);
          return Number(result.toFixed(actualPrecision));
        }
        
        const result = Math.pow(numBase, numExponent);
        
        if (!isFinite(result)) {
          throw new NumberRangeError(this.i18n.getErrorMessage('overflow', [result]));
        }
        
        return Number(result.toFixed(actualPrecision));
      });
    } catch (error) {
      return this.handleError(error, 'power', [base, exponent, precision]);
    }
  }

  /**
   * 平方根
   * @param {number|string} n - 被开方数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  sqrt(n, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(n);
      Validator.validatePrecision(actualPrecision);
      
      const numN = Number(n);
      if (numN < 0) {
        throw new InvalidInputError(this.i18n.getErrorMessage('invalidInput', [n]));
      }
      
      return this.executeWithCache('sqrt', [n, actualPrecision], () => {
        const result = Math.sqrt(numN);
        return Number(result.toFixed(actualPrecision));
      });
    } catch (error) {
      return this.handleError(error, 'sqrt', [n, precision]);
    }
  }

  /**
   * 阶乘
   * @param {number|string} n - 输入数
   * @returns {number} 计算结果
   */
  @logOperation
  factorial(n) {
    try {
      Validator.validateNumber(n);
      
      const numN = Number(n);
      if (numN < 0 || !Number.isInteger(numN)) {
        throw new InvalidInputError(this.i18n.getErrorMessage('invalidInput', [n]));
      }
      
      return this.executeWithCache('factorial', [n], () => {
        // 使用记忆化阶乘（如果可用）
        if (FastAlgorithms.memoizedFactorial) {
          return FastAlgorithms.memoizedFactorial(numN);
        }
        
        let result = 1;
        for (let i = 2; i <= numN; i++) {
          result *= i;
        }
        return result;
      });
    } catch (error) {
      return this.handleError(error, 'factorial', [n]);
    }
  }

  /**
   * 平方
   * @param {number|string} n - 输入数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  square(n, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(n);
      Validator.validatePrecision(actualPrecision);
      
      return this.executeWithCache('square', [n, actualPrecision], () => {
        const numN = Number(n);
        
        if (!isFinite(numN)) {
          throw new NumberRangeError(this.i18n.getErrorMessage('numberRange', [n]));
        }
        
        // 使用multiply方法确保精度
        return this.multiply(numN, numN, actualPrecision);
      });
    } catch (error) {
      return this.handleError(error, 'square', [n, precision]);
    }
  }

  /**
   * 绝对值
   * @param {number|string} n - 输入数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  abs(n, precision = null) {
    try {
      const actualPrecision = precision !== null ? precision : this.config.get('precision.default', 10);
      
      Validator.validateNumber(n);
      Validator.validatePrecision(actualPrecision);
      
      const numN = Number(n);
      const result = Math.abs(numN);
      
      return Number(result.toFixed(actualPrecision));
    } catch (error) {
      return this.handleError(error, 'abs', [n, precision]);
    }
  }

  /**
   * 四舍五入
   * @param {number|string} n - 输入数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  round(n, precision = 0) {
    try {
      Validator.validateNumber(n);
      Validator.validatePrecision(precision);
      
      const numN = Number(n);
      const multiplier = Math.pow(10, precision);
      const result = Math.round(numN * multiplier) / multiplier;
      
      return Number(result.toFixed(precision));
    } catch (error) {
      return this.handleError(error, 'round', [n, precision]);
    }
  }

  /**
   * 向上取整
   * @param {number|string} n - 输入数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  ceil(n, precision = 0) {
    try {
      Validator.validateNumber(n);
      Validator.validatePrecision(precision);
      
      const numN = Number(n);
      const multiplier = Math.pow(10, precision);
      const result = Math.ceil(numN * multiplier) / multiplier;
      
      return Number(result.toFixed(precision));
    } catch (error) {
      return this.handleError(error, 'ceil', [n, precision]);
    }
  }

  /**
   * 向下取整
   * @param {number|string} n - 输入数
   * @param {number} precision - 精度
   * @returns {number} 计算结果
   */
  @logOperation
  floor(n, precision = 0) {
    try {
      Validator.validateNumber(n);
      Validator.validatePrecision(precision);
      
      const numN = Number(n);
      const multiplier = Math.pow(10, precision);
      const result = Math.floor(numN * multiplier) / multiplier;
      
      return Number(result.toFixed(precision));
    } catch (error) {
      return this.handleError(error, 'floor', [n, precision]);
    }
  }

  /**
   * 格式化为货币
   * @param {number|string} value - 数值
   * @param {string} symbol - 货币符号
   * @param {number} precision - 精度
   * @returns {string} 格式化结果
   */
  formatCurrency(value, symbol = null, precision = null) {
    try {
      Validator.validateNumber(value);
      
      const actualSymbol = symbol || this.config.get('formatting.currency.symbol', '$');
      const actualPrecision = precision !== null ? precision : this.config.get('formatting.currency.precision', 2);
      
      if (this.i18n.formatCurrency) {
        return this.i18n.formatCurrency(value, { symbol: actualSymbol, precision: actualPrecision });
      }
      
      const numValue = Number(value);
      return `${actualSymbol}${numValue.toFixed(actualPrecision)}`;
    } catch (error) {
      return this.handleError(error, 'formatCurrency', [value, symbol, precision]);
    }
  }

  /**
   * 格式化为百分比
   * @param {number|string} value - 数值（0-1之间）
   * @param {number} precision - 精度
   * @returns {string} 格式化结果
   */
  formatPercentage(value, precision = null) {
    try {
      Validator.validateNumber(value);
      
      const actualPrecision = precision !== null ? precision : this.config.get('formatting.percentage.precision', 2);
      
      if (this.i18n.formatPercentage) {
        return this.i18n.formatPercentage(value, { precision: actualPrecision });
      }
      
      const numValue = Number(value);
      return `${(numValue * 100).toFixed(actualPrecision)}%`;
    } catch (error) {
      return this.handleError(error, 'formatPercentage', [value, precision]);
    }
  }

  /**
   * 链式调用支持
   * @param {number|string} initialValue - 初始值
   * @returns {ChainCalculator} 链式计算器实例
   */
  chain(initialValue) {
    return new ChainCalculator(this, initialValue);
  }

  /**
   * 批量计算
   * @param {Array} numbers - 数字数组
   * @param {string} operation - 操作类型
   * @param {number} precision - 精度
   * @returns {Array} 计算结果数组
   */
  batch(numbers, operation, precision = null) {
    try {
      Validator.validateArray(numbers);
      
      const results = [];
      
      for (let i = 0; i < numbers.length; i++) {
        try {
          let result;
          switch (operation) {
            case 'sqrt':
              result = this.sqrt(numbers[i], precision);
              break;
            case 'square':
              result = this.square(numbers[i], precision);
              break;
            case 'abs':
              result = this.abs(numbers[i], precision);
              break;
            case 'round':
              result = this.round(numbers[i], precision || 0);
              break;
            case 'factorial':
              result = this.factorial(numbers[i]);
              break;
            case 'ceil':
              result = this.ceil(numbers[i], precision || 0);
              break;
            case 'floor':
              result = this.floor(numbers[i], precision || 0);
              break;
            default:
              throw new InvalidInputError(`不支持的批量操作: ${operation}`);
          }
          results.push(result);
        } catch (error) {
          results.push(null); // 或者根据错误处理模式决定
        }
      }
      
      return results;
    } catch (error) {
      return this.handleError(error, 'batch', [numbers, operation, precision]);
    }
  }

  /**
   * 获取性能指标
   * @returns {Object} 性能指标
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * 清空缓存
   */
  clearCache() {
    if (this.cache && this.cache.clear) {
      this.cache.clear();
    }
  }

  /**
   * 获取缓存统计
   * @returns {Object} 缓存统计信息
   */
  getCacheStats() {
    if (this.cache && this.cache.getStats) {
      return this.cache.getStats();
    }
    return { size: 0, hits: 0, misses: 0 };
  }
}

/**
 * 链式计算器类
 */
class ChainCalculator {
  constructor(calculator, initialValue) {
    this.calculator = calculator;
    this.value = Number(initialValue);
    this.precision = calculator.config.get('precision.default', 10);
  }

  /**
   * 设置精度
   * @param {number} precision - 精度
   * @returns {ChainCalculator} 链式计算器实例
   */
  setPrecision(precision) {
    this.precision = precision;
    return this;
  }

  /**
   * 加法
   * @param {number|string} value - 加数
   * @returns {ChainCalculator} 链式计算器实例
   */
  add(value) {
    this.value = this.calculator.add(this.value, value, this.precision);
    return this;
  }

  /**
   * 减法
   * @param {number|string} value - 减数
   * @returns {ChainCalculator} 链式计算器实例
   */
  subtract(value) {
    this.value = this.calculator.subtract(this.value, value, this.precision);
    return this;
  }

  /**
   * 乘法
   * @param {number|string} value - 乘数
   * @returns {ChainCalculator} 链式计算器实例
   */
  multiply(value) {
    this.value = this.calculator.multiply(this.value, value, this.precision);
    return this;
  }

  /**
   * 除法
   * @param {number|string} value - 除数
   * @returns {ChainCalculator} 链式计算器实例
   */
  divide(value) {
    this.value = this.calculator.divide(this.value, value, this.precision);
    return this;
  }

  /**
   * 幂运算
   * @param {number|string} exponent - 指数
   * @returns {ChainCalculator} 链式计算器实例
   */
  power(exponent) {
    this.value = this.calculator.power(this.value, exponent, this.precision);
    return this;
  }

  /**
   * 平方根
   * @returns {ChainCalculator} 链式计算器实例
   */
  sqrt() {
    this.value = this.calculator.sqrt(this.value, this.precision);
    return this;
  }

  /**
   * 平方
   * @returns {ChainCalculator} 链式计算器实例
   */
  square() {
    this.value = this.calculator.square(this.value, this.precision);
    return this;
  }

  /**
   * 绝对值
   * @returns {ChainCalculator} 链式计算器实例
   */
  abs() {
    this.value = this.calculator.abs(this.value, this.precision);
    return this;
  }

  /**
   * 四舍五入
   * @param {number} precision - 精度
   * @returns {ChainCalculator} 链式计算器实例
   */
  round(precision = 0) {
    this.value = this.calculator.round(this.value, precision);
    return this;
  }

  /**
   * 获取结果
   * @returns {number} 计算结果
   */
  result() {
    return this.value;
  }

  /**
   * 格式化为货币
   * @param {string} symbol - 货币符号
   * @param {number} precision - 精度
   * @returns {string} 格式化结果
   */
  toCurrency(symbol, precision) {
    return this.calculator.formatCurrency(this.value, symbol, precision);
  }

  /**
   * 格式化为百分比
   * @param {number} precision - 精度
   * @returns {string} 格式化结果
   */
  toPercentage(precision) {
    return this.calculator.formatPercentage(this.value, precision);
  }
}

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PrecisionCalculator,
    ChainCalculator
  };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculator = PrecisionCalculator;
  window.ChainCalculator = ChainCalculator;
}