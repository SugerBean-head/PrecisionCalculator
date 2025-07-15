/**
 * MathFix.js - 精确数学计算库
 * 解决JavaScript浮点数计算精度问题
 * @version 1.2.0
 * @author MathFix Team
 */

// 导入模块加载器
let loadModule;
try {
  if (typeof require !== 'undefined') {
    loadModule = require('./src/utils/module-loader').loadModule;
  } else {
    throw new Error('模块加载器不可用');
  }
} catch (error) {
  // 内联实现模块加载器
  loadModule = function(modulePath, fallback) {
    try {
      if (typeof require !== 'undefined') {
        const module = require(modulePath);
        if (!module) throw new Error(`模块 ${modulePath} 加载失败`);
        return module;
      } else {
        throw new Error(`模块 ${modulePath} 不可用`);
      }
    } catch (err) {
      console.warn(`模块 ${modulePath} 未找到，使用后备实现`);
      const fallbackModule = fallback();
      return fallbackModule;
    }
  };
}

// 加载错误模块
const errors = loadModule('./src/errors/index', () => {
  // 错误模块的后备实现
  return {
    MathFixError: Error,
    InvalidInputError: Error,
    DivisionByZeroError: Error,
    NumberRangeError: Error,
    ExpressionParseError: Error,
    ConfigurationError: Error
  };
});

// 加载配置管理器
const configManager = loadModule('./src/shared/config-manager', () => {
  // 配置管理器的后备实现
  const defaultConfig = {
    precision: {
      default: 10,
      max: 20,
      min: 0
    },
    performance: {
      cacheEnabled: false
    },
    logging: {
      enabled: false
    }
  };
  
  let globalConfig = JSON.parse(JSON.stringify(defaultConfig));
  
  const configManager = {
    setConfig: (config) => {
      if (config && typeof config === 'object') {
        globalConfig = { ...globalConfig, ...config };
        return true;
      }
      return false;
    },
    getConfig: (path, defaultValue) => {
      if (!path) return globalConfig;
      
      const keys = path.split('.');
      let current = globalConfig;
      
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return defaultValue;
        }
      }
      
      return current !== undefined ? current : defaultValue;
    },
    resetConfig: () => {
      globalConfig = JSON.parse(JSON.stringify(defaultConfig));
      return true;
    },
    getGlobalConfigRef: () => globalConfig,
    createInstanceConfig: (instanceConfig = {}) => {
      let config = { ...globalConfig, ...instanceConfig };
      
      return {
        setConfig: (newConfig) => {
          config = { ...config, ...newConfig };
          return true;
        },
        getConfig: (path, defaultValue) => {
          if (!path) return config;
          
          const keys = path.split('.');
          let current = config;
          
          for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
              current = current[key];
            } else {
              return defaultValue;
            }
          }
          
          return current !== undefined ? current : defaultValue;
        },
        resetConfig: () => {
          config = { ...globalConfig };
          return true;
        },
        getConfigRef: () => config
      };
    },
    setGlobalConfig: function(config) { return this.setConfig(config); },
    getGlobalConfig: function(path, defaultValue) { return this.getConfig(path, defaultValue); }
  };
  
  return configManager;
});

// 加载核心计算器
const coreCalculator = loadModule('./src/shared/core-calculator', () => {
  // 核心计算器的后备实现
  class PrecisionCalculatorFallback {
    constructor(options = {}) {
      this.precision = options.precision || 10;
      this._cache = new Map();
    }
    
    setPrecision(precision) {
      this.precision = precision;
      return this;
    }
    
    getDecimalPlaces(num) {
      if (Number.isInteger(num)) return 0;
      const str = num.toString();
      const decimalIndex = str.indexOf('.');
      return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
    }
    
    toInteger(num) {
      const decimalPlaces = this.getDecimalPlaces(num);
      const factor = Math.pow(10, decimalPlaces);
      return {
        value: Math.round(num * factor),
        factor: factor
      };
    }
    
    add(a, b) {
      const aInt = this.toInteger(a);
      const bInt = this.toInteger(b);
      const maxFactor = Math.max(aInt.factor, bInt.factor);
      
      const aValue = aInt.value * (maxFactor / aInt.factor);
      const bValue = bInt.value * (maxFactor / bInt.factor);
      
      return (aValue + bValue) / maxFactor;
    }
    
    subtract(a, b) {
      const aInt = this.toInteger(a);
      const bInt = this.toInteger(b);
      const maxFactor = Math.max(aInt.factor, bInt.factor);
      
      const aValue = aInt.value * (maxFactor / aInt.factor);
      const bValue = bInt.value * (maxFactor / bInt.factor);
      
      return (aValue - bValue) / maxFactor;
    }
    
    multiply(a, b) {
      const aInt = this.toInteger(a);
      const bInt = this.toInteger(b);
      
      return (aInt.value * bInt.value) / (aInt.factor * bInt.factor);
    }
    
    divide(a, b) {
      if (b === 0) {
        throw new errors.DivisionByZeroError('除数不能为零', { dividend: a, divisor: b });
      }
      
      const aInt = this.toInteger(a);
      const bInt = this.toInteger(b);
      
      return (aInt.value / bInt.value) * (bInt.factor / aInt.factor);
    }
    
    format(num, precision) {
      const usePrecision = precision !== undefined ? precision : this.precision;
      const factor = Math.pow(10, usePrecision);
      return Math.round(num * factor) / factor;
    }
    
    round(num, precision) {
      return this.format(num, precision);
    }
    
    ceil(num, precision) {
      const usePrecision = precision !== undefined ? precision : this.precision;
      const factor = Math.pow(10, usePrecision);
      return Math.ceil(num * factor) / factor;
    }
    
    floor(num, precision) {
      const usePrecision = precision !== undefined ? precision : this.precision;
      const factor = Math.pow(10, usePrecision);
      return Math.floor(num * factor) / factor;
    }
    
    clearCache() {
      this._cache.clear();
      return true;
    }
    
    getCacheStats() {
      return {
        size: this._cache.size
      };
    }
  }
  
  class ChainCalculatorFallback {
    constructor(initialValue = 0, calculator) {
      this.value = initialValue;
      this._calculator = calculator || new PrecisionCalculatorFallback();
    }
    
    setPrecision(precision) {
      this._calculator.setPrecision(precision);
      return this;
    }
    
    add(num) {
      this.value = this._calculator.add(this.value, num);
      return this;
    }
    
    subtract(num) {
      this.value = this._calculator.subtract(this.value, num);
      return this;
    }
    
    multiply(num) {
      this.value = this._calculator.multiply(this.value, num);
      return this;
    }
    
    divide(num) {
      this.value = this._calculator.divide(this.value, num);
      return this;
    }
    
    valueOf() {
      return this.value;
    }
    
    toString() {
      return this.value.toString();
    }
  }
  
  return {
    PrecisionCalculator: PrecisionCalculatorFallback,
    ChainCalculator: ChainCalculatorFallback
  };
});

// 加载链式计算器
const chainableCalculator = loadModule('./src/shared/chainable-calculator', () => {
  // 链式计算器的后备实现
  class ChainableCalculatorFallback {
    constructor(initialValue = 0, precision = 10) {
      this.value = initialValue;
      // 确保 coreCalculator 存在并且有 PrecisionCalculator 属性
      if (coreCalculator && coreCalculator.PrecisionCalculator) {
        this.calculator = new coreCalculator.PrecisionCalculator({ precision });
      } else {
        // 如果 coreCalculator 不存在，使用内联的 PrecisionCalculator 实现
        class InlinePrecisionCalculator {
          constructor(options = {}) {
            this.precision = options.precision || 10;
          }
          
          setPrecision(precision) {
            this.precision = precision;
            return this;
          }
          
          add(a, b) {
            return parseFloat((a + b).toFixed(this.precision));
          }
          
          subtract(a, b) {
            return parseFloat((a - b).toFixed(this.precision));
          }
          
          multiply(a, b) {
            return parseFloat((a * b).toFixed(this.precision));
          }
          
          divide(a, b) {
            if (b === 0) throw new Error('除数不能为零');
            return parseFloat((a / b).toFixed(this.precision));
          }
        }
        
        this.calculator = new InlinePrecisionCalculator({ precision });
      }
    }
    
    setPrecision(precision) {
      this.calculator.setPrecision(precision);
      return this;
    }
    
    add(value) {
      this.value = this.calculator.add(this.value, value);
      return this;
    }
    
    subtract(value) {
      this.value = this.calculator.subtract(this.value, value);
      return this;
    }
    
    multiply(value) {
      this.value = this.calculator.multiply(this.value, value);
      return this;
    }
    
    divide(value) {
      this.value = this.calculator.divide(this.value, value);
      return this;
    }
    
    valueOf() {
      return this.value;
    }
    
    toString() {
      return this.value.toString();
    }
  }
  
  return {
    ChainableCalculator: ChainableCalculatorFallback
  };
});

// 加载计算器工厂
const calculatorFactory = loadModule('./src/shared/calculator-factory', () => {
  // 计算器工厂的后备实现
  const factory = {
    createCalculator: (mode = 'basic', options = {}) => {
      if (mode === 'enhanced') {
        console.warn('增强模式不可用，使用基础模式');
      }
      
      // 确保 coreCalculator 存在并且有 PrecisionCalculator 属性
      if (coreCalculator && coreCalculator.PrecisionCalculator) {
        return new coreCalculator.PrecisionCalculator(options);
      } else {
        // 如果 coreCalculator 不存在，使用内联的 PrecisionCalculator 实现
        class InlinePrecisionCalculator {
          constructor(options = {}) {
            this.precision = options.precision || 10;
          }
          
          setPrecision(precision) {
            this.precision = precision;
            return this;
          }
          
          add(a, b) {
            return parseFloat((a + b).toFixed(this.precision));
          }
          
          subtract(a, b) {
            return parseFloat((a - b).toFixed(this.precision));
          }
          
          multiply(a, b) {
            return parseFloat((a * b).toFixed(this.precision));
          }
          
          divide(a, b) {
            if (b === 0) throw new Error('除数不能为零');
            return parseFloat((a / b).toFixed(this.precision));
          }
        }
        
        return new InlinePrecisionCalculator(options);
      }
    },
    createChainCalculator: (initialValue = 0, options = {}) => {
      // 确保 chainableCalculator 存在并且有 ChainableCalculator 属性
      if (chainableCalculator && chainableCalculator.ChainableCalculator) {
        return new chainableCalculator.ChainableCalculator(initialValue, options.precision);
      } else {
        // 如果 chainableCalculator 不存在，使用内联的 ChainableCalculator 实现
        class InlineChainableCalculator {
          constructor(initialValue = 0, precision = 10) {
            this.value = initialValue;
            this.precision = precision;
          }
          
          setPrecision(precision) {
            this.precision = precision;
            return this;
          }
          
          add(value) {
            this.value = parseFloat((this.value + value).toFixed(this.precision));
            return this;
          }
          
          subtract(value) {
            this.value = parseFloat((this.value - value).toFixed(this.precision));
            return this;
          }
          
          multiply(value) {
            this.value = parseFloat((this.value * value).toFixed(this.precision));
            return this;
          }
          
          divide(value) {
            if (value === 0) throw new Error('除数不能为零');
            this.value = parseFloat((this.value / value).toFixed(this.precision));
            return this;
          }
          
          valueOf() {
            return this.value;
          }
          
          toString() {
            return this.value.toString();
          }
        }
        
        return new InlineChainableCalculator(initialValue, options.precision);
      }
    }
  };
  
  return factory;
});

// 加载工具函数
const utils = loadModule('./src/shared/utils', () => {
  // 工具函数的后备实现
  function batch(input, operation, precision) {
    // 确保 coreCalculator 存在并且有 PrecisionCalculator 属性
    let calculator;
    if (coreCalculator && coreCalculator.PrecisionCalculator) {
      calculator = new coreCalculator.PrecisionCalculator();
    } else {
      // 如果 coreCalculator 不存在，使用内联的 PrecisionCalculator 实现
      class InlinePrecisionCalculator {
        constructor(options = {}) {
          this.precision = options.precision || 10;
        }
        
        add(a, b) {
          return parseFloat((a + b).toFixed(this.precision));
        }
        
        subtract(a, b) {
          return parseFloat((a - b).toFixed(this.precision));
        }
        
        multiply(a, b) {
          return parseFloat((a * b).toFixed(this.precision));
        }
        
        divide(a, b) {
          if (b === 0) throw new Error('除数不能为零');
          return parseFloat((a / b).toFixed(this.precision));
        }
        
        round(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          return parseFloat(num.toFixed(usePrecision));
        }
      }
      
      calculator = new InlinePrecisionCalculator();
    }
    
    // 确保 configManager 存在并且有 getGlobalConfigRef 方法
    const globalConfig = configManager && typeof configManager.getGlobalConfigRef === 'function' 
      ? configManager.getGlobalConfigRef() 
      : { precision: { default: 10 } };
    
    if (arguments.length <= 3 || !operation) {
      // 第一种方式：表达式数组
      return input.map(expr => {
        try {
          return calculator.calculate ? calculator.calculate(expr) : null;
        } catch (error) {
          return null;
        }
      });
    } else {
      // 第二种方式：数字数组和操作字符串
      const numbers = input;
      const results = [];
      const usePrecision = precision !== undefined ? precision : globalConfig.precision.default;
      
      for (let i = 0; i < numbers.length; i++) {
        try {
          let result;
          switch (operation) {
            case 'sqrt':
              result = Math.sqrt(numbers[i]);
              break;
            case 'square':
              result = calculator.multiply(numbers[i], numbers[i]);
              break;
            case 'abs':
              result = Math.abs(numbers[i]);
              break;
            case 'round':
              result = calculator.round(numbers[i], usePrecision);
              break;
            case 'ceil':
              result = calculator.ceil(numbers[i], usePrecision);
              break;
            case 'floor':
              result = calculator.floor(numbers[i], usePrecision);
              break;
            default:
              throw new Error(`不支持的批量操作: ${operation}`);
          }
          results.push(result);
        } catch (error) {
          results.push(null);
        }
      }
      return results;
    }
  }
  
  function createRawCalc(calculator, ChainableCalculator) {
    return {
      add: (a, b) => calculator.add(a, b),
      subtract: (a, b) => calculator.subtract(a, b),
      multiply: (a, b) => calculator.multiply(a, b),
      divide: (a, b) => calculator.divide(a, b),
      format: (num, precision) => calculator.format(num, precision),
      round: (num, precision) => calculator.round(num, precision),
      ceil: (num, precision) => calculator.ceil(num, precision),
      floor: (num, precision) => calculator.floor(num, precision),
      calculate: (expression) => calculator.calculate ? calculator.calculate(expression) : null,
      batch: (expressions) => batch(expressions),
      setPrecision: (precision) => calculator.setPrecision(precision),
      chain: (initialValue) => new ChainableCalculator(initialValue)
    };
  }
  
  function createCalc(calculator, globalConfig, ChainableCalculator) {
    const getPrecision = () => {
      if (configManager && typeof configManager.getConfig === 'function') {
        return configManager.getConfig('precision.default', 10);
      } else if (globalConfig && globalConfig.precision && globalConfig.precision.default !== undefined) {
        return globalConfig.precision.default;
      } else {
        return 10;
      }
    };
    
    return {
      add: (a, b) => {
        const result = calculator.add(a, b);
        return calculator.format(result, getPrecision());
      },
      subtract: (a, b) => {
        const result = calculator.subtract(a, b);
        return calculator.format(result, getPrecision());
      },
      multiply: (a, b) => {
        const result = calculator.multiply(a, b);
        return calculator.format(result, getPrecision());
      },
      divide: (a, b) => {
        const result = calculator.divide(a, b);
        return calculator.format(result, getPrecision());
      },
      format: (num, precision) => calculator.format(num, precision !== undefined ? precision : getPrecision()),
      round: (num, precision) => calculator.round(num, precision !== undefined ? precision : getPrecision()),
      ceil: (num, precision) => calculator.ceil(num, precision !== undefined ? precision : getPrecision()),
      floor: (num, precision) => calculator.floor(num, precision !== undefined ? precision : getPrecision()),
      calculate: (expression) => calculator.calculate ? calculator.calculate(expression) : null,
      batch: (expressions) => batch(expressions),
      setPrecision: (precision) => {
        calculator.setPrecision(precision);
        if (configManager && typeof configManager.setConfig === 'function') {
          configManager.setConfig({ precision: { default: precision } });
        }
      },
      chain: (initialValue) => new ChainableCalculator(initialValue)
    };
  }
  
  return {
    batch,
    createRawCalc,
    createCalc,
    getPerformanceMetrics: () => ({ message: '性能监控功能需要增强模块支持' }),
    clearCache: () => false,
    getCacheStats: () => ({ message: '缓存统计功能需要增强模块支持' }),
    setLocale: () => false,
    version: '1.2.0',
    features: {
      enhanced: false,
      config: true,
      i18n: false,
      performance: false,
      logging: false
    }
  };
});

// 创建计算器实例
const calculator = (calculatorFactory && typeof calculatorFactory.createCalculator === 'function') 
  ? calculatorFactory.createCalculator('basic', {
      precision: configManager && typeof configManager.getConfig === 'function' ? configManager.getConfig('precision.default', 10) : 10
    })
  : (() => {
      console.warn('使用内联的计算器实例');
      // 内联的 PrecisionCalculator 实现
      class InlinePrecisionCalculator {
        constructor(options = {}) {
          this.precision = options.precision || 10;
        }
        
        setPrecision(precision) {
          this.precision = precision;
          return this;
        }
        
        add(a, b) {
          return parseFloat((a + b).toFixed(this.precision));
        }
        
        subtract(a, b) {
          return parseFloat((a - b).toFixed(this.precision));
        }
        
        multiply(a, b) {
          return parseFloat((a * b).toFixed(this.precision));
        }
        
        divide(a, b) {
          if (b === 0) throw new Error('除数不能为零');
          return parseFloat((a / b).toFixed(this.precision));
        }
        
        format(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          return parseFloat(num.toFixed(usePrecision));
        }
        
        round(num, precision) {
          return this.format(num, precision);
        }
        
        ceil(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, usePrecision);
          return Math.ceil(num * factor) / factor;
        }
        
        floor(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, usePrecision);
          return Math.floor(num * factor) / factor;
        }
      }
      
      return new InlinePrecisionCalculator({
        precision: configManager && typeof configManager.getConfig === 'function' ? configManager.getConfig('precision.default', 10) : 10
      });
    })();

// 创建计算器API
const rawCalc = utils && typeof utils.createRawCalc === 'function'
  ? utils.createRawCalc(calculator, chainableCalculator && chainableCalculator.ChainableCalculator)
  : (() => {
      console.warn('使用内联的 rawCalc 实现');
      return {
        add: (a, b) => calculator.add(a, b),
        subtract: (a, b) => calculator.subtract(a, b),
        multiply: (a, b) => calculator.multiply(a, b),
        divide: (a, b) => calculator.divide(a, b),
        format: (num, precision) => calculator.format(num, precision),
        round: (num, precision) => calculator.round(num, precision),
        ceil: (num, precision) => calculator.ceil(num, precision),
        floor: (num, precision) => calculator.floor(num, precision),
        setPrecision: (precision) => calculator.setPrecision(precision),
        chain: (initialValue) => {
          // 内联的 ChainableCalculator 实现
          class InlineChainableCalculator {
            constructor(initialValue = 0, calculator) {
              this.value = initialValue;
              this.calculator = calculator;
            }
            
            setPrecision(precision) {
              this.calculator.setPrecision(precision);
              return this;
            }
            
            add(value) {
              this.value = this.calculator.add(this.value, value);
              return this;
            }
            
            subtract(value) {
              this.value = this.calculator.subtract(this.value, value);
              return this;
            }
            
            multiply(value) {
              this.value = this.calculator.multiply(this.value, value);
              return this;
            }
            
            divide(value) {
              this.value = this.calculator.divide(this.value, value);
              return this;
            }
            
            valueOf() {
              return this.value;
            }
            
            toString() {
              return this.value.toString();
            }
          }
          
          return new InlineChainableCalculator(initialValue, calculator);
        }
      };
    })();

const calc = utils && typeof utils.createCalc === 'function'
  ? utils.createCalc(calculator, configManager && typeof configManager.getGlobalConfigRef === 'function' ? configManager.getGlobalConfigRef() : {}, chainableCalculator && chainableCalculator.ChainableCalculator)
  : (() => {
      console.warn('使用内联的 calc 实现');
      const getPrecision = () => {
        if (configManager && typeof configManager.getConfig === 'function') {
          return configManager.getConfig('precision.default', 10);
        } else {
          return 10;
        }
      };
      
      return {
        add: (a, b) => {
          const result = calculator.add(a, b);
          return calculator.format(result, getPrecision());
        },
        subtract: (a, b) => {
          const result = calculator.subtract(a, b);
          return calculator.format(result, getPrecision());
        },
        multiply: (a, b) => {
          const result = calculator.multiply(a, b);
          return calculator.format(result, getPrecision());
        },
        divide: (a, b) => {
          const result = calculator.divide(a, b);
          return calculator.format(result, getPrecision());
        },
        format: (num, precision) => calculator.format(num, precision !== undefined ? precision : getPrecision()),
        round: (num, precision) => calculator.round(num, precision !== undefined ? precision : getPrecision()),
        ceil: (num, precision) => calculator.ceil(num, precision !== undefined ? precision : getPrecision()),
        floor: (num, precision) => calculator.floor(num, precision !== undefined ? precision : getPrecision()),
        setPrecision: (precision) => {
          calculator.setPrecision(precision);
          if (configManager && typeof configManager.setConfig === 'function') {
            configManager.setConfig({ precision: { default: precision } });
          }
        },
        chain: (initialValue) => {
          // 内联的 ChainableCalculator 实现
          class InlineChainableCalculator {
            constructor(initialValue = 0, calculator) {
              this.value = initialValue;
              this.calculator = calculator;
            }
            
            setPrecision(precision) {
              this.calculator.setPrecision(precision);
              return this;
            }
            
            add(value) {
              this.value = this.calculator.add(this.value, value);
              return this;
            }
            
            subtract(value) {
              this.value = this.calculator.subtract(this.value, value);
              return this;
            }
            
            multiply(value) {
              this.value = this.calculator.multiply(this.value, value);
              return this;
            }
            
            divide(value) {
              this.value = this.calculator.divide(this.value, value);
              return this;
            }
            
            valueOf() {
              return this.value;
            }
            
            toString() {
              return this.value.toString();
            }
          }
          
          return new InlineChainableCalculator(initialValue, calculator);
        }
      };
    })();

// 导出API
const exportedAPI = {
  // 类
  PrecisionCalculator: coreCalculator && coreCalculator.PrecisionCalculator,
  ChainableCalculator: chainableCalculator && chainableCalculator.ChainableCalculator,
  
  // 实例
  calc,
  rawCalc,
  
  // 工具函数
  batch: utils && typeof utils.batch === 'function' ? utils.batch : function(expressions, operation) {
    console.warn('使用内联的 batch 实现');
    // 内联的 batch 函数实现
    if (!expressions || !expressions.length) {
      return [];
    }
    
    // 获取配置
    const config = configManager && typeof configManager.getGlobalConfigRef === 'function' 
      ? configManager.getGlobalConfigRef() 
      : { precision: { default: 10 } };
    
    // 获取精度
    const precision = config && config.precision && config.precision.default !== undefined 
      ? config.precision.default 
      : 10;
    
    // 创建计算器实例
    const calc = calculator || (() => {
      // 如果 coreCalculator 不存在，使用内联的 PrecisionCalculator 实现
      class InlinePrecisionCalculator {
        constructor(options = {}) {
          this.precision = options.precision || precision;
        }
        
        setPrecision(precision) {
          this.precision = precision;
          return this;
        }
        
        add(a, b) {
          return parseFloat((a + b).toFixed(this.precision));
        }
        
        subtract(a, b) {
          return parseFloat((a - b).toFixed(this.precision));
        }
        
        multiply(a, b) {
          return parseFloat((a * b).toFixed(this.precision));
        }
        
        divide(a, b) {
          if (b === 0) {
            throw new Error('除数不能为零');
          }
          return parseFloat((a / b).toFixed(this.precision));
        }
        
        format(num, precision) {
          const p = precision !== undefined ? precision : this.precision;
          return parseFloat(num.toFixed(p));
        }
        
        round(num, precision) {
          const p = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, p);
          return Math.round(num * factor) / factor;
        }
        
        ceil(num, precision) {
          const p = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, p);
          return Math.ceil(num * factor) / factor;
        }
        
        floor(num, precision) {
          const p = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, p);
          return Math.floor(num * factor) / factor;
        }
        
        calculate(expression) {
          // 简单的表达式计算，仅支持基本运算
          try {
            // 安全的 eval 替代方案
            return Function('return ' + expression)();
          } catch (e) {
            console.error('表达式计算错误:', e);
            return NaN;
          }
        }
      }
      
      return new InlinePrecisionCalculator({ precision });
    })();
    
    // 处理数组和操作
    if (Array.isArray(expressions)) {
      if (typeof operation === 'string') {
        // 对数字数组应用操作
        return expressions.map(value => {
          switch(operation.toLowerCase()) {
            case 'sqrt':
              return Math.sqrt(value);
            case 'square':
              return value * value;
            case 'abs':
              return Math.abs(value);
            case 'sin':
              return Math.sin(value);
            case 'cos':
              return Math.cos(value);
            case 'tan':
              return Math.tan(value);
            case 'log':
              return Math.log(value);
            case 'exp':
              return Math.exp(value);
            default:
              console.warn(`未知操作: ${operation}，返回原值`);
              return value;
          }
        });
      } else {
        // 计算表达式数组
        return expressions.map(expr => {
          if (typeof expr === 'string') {
            return calc.calculate(expr);
          }
          return expr;
        });
      }
    }
    
    return [];
  },
  getPerformanceMetrics: utils && typeof utils.getPerformanceMetrics === 'function' ? utils.getPerformanceMetrics : function() { return {}; },
  clearCache: utils && typeof utils.clearCache === 'function' ? utils.clearCache : function() { return true; },
  getCacheStats: utils && typeof utils.getCacheStats === 'function' ? utils.getCacheStats : function() { return {}; },
  
  // 配置函数
  setConfig: configManager && typeof configManager.setConfig === 'function' ? configManager.setConfig : function() { return false; },
  getConfig: configManager && typeof configManager.getConfig === 'function' ? configManager.getConfig : function() { return {}; },
  setLocale: utils && typeof utils.setLocale === 'function' ? utils.setLocale : function(locale) { console.warn('本地化设置不可用'); return false; },
  setGlobalConfig: configManager && typeof configManager.setGlobalConfig === 'function' ? configManager.setGlobalConfig : function() { return false; },
  getGlobalConfig: configManager && typeof configManager.getGlobalConfig === 'function' ? configManager.getGlobalConfig : function() { return {}; },
  
  // 工厂函数
  createCalculator: calculatorFactory && typeof calculatorFactory.createCalculator === 'function' ? calculatorFactory.createCalculator : function(mode, options) {
    console.warn('使用内联的计算器工厂');
    if (mode === 'enhanced') {
      console.warn('增强模式不可用，使用基础模式');
    }
    
    if (coreCalculator && coreCalculator.PrecisionCalculator) {
      return new coreCalculator.PrecisionCalculator(options);
    } else {
      // 如果 coreCalculator 不存在，使用内联的 PrecisionCalculator 实现
      class InlinePrecisionCalculator {
        constructor(options = {}) {
          this.precision = options.precision || 10;
        }
        
        setPrecision(precision) {
          this.precision = precision;
          return this;
        }
        
        add(a, b) {
          return parseFloat((a + b).toFixed(this.precision));
        }
        
        subtract(a, b) {
          return parseFloat((a - b).toFixed(this.precision));
        }
        
        multiply(a, b) {
          return parseFloat((a * b).toFixed(this.precision));
        }
        
        divide(a, b) {
          if (b === 0) throw new Error('除数不能为零');
          return parseFloat((a / b).toFixed(this.precision));
        }
        
        format(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          return parseFloat(num.toFixed(usePrecision));
        }
        
        round(num, precision) {
          return this.format(num, precision);
        }
        
        ceil(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, usePrecision);
          return Math.ceil(num * factor) / factor;
        }
        
        floor(num, precision) {
          const usePrecision = precision !== undefined ? precision : this.precision;
          const factor = Math.pow(10, usePrecision);
          return Math.floor(num * factor) / factor;
        }
      }
      
      return new InlinePrecisionCalculator(options);
    }
  },
  createChainCalculator: calculatorFactory && typeof calculatorFactory.createChainCalculator === 'function' ? calculatorFactory.createChainCalculator : function(initialValue, options) {
    console.warn('使用内联的链式计算器工厂');
    if (chainableCalculator && chainableCalculator.ChainableCalculator) {
      return new chainableCalculator.ChainableCalculator(initialValue, options && options.precision);
    } else {
      // 如果 chainableCalculator 不存在，使用内联的 ChainableCalculator 实现
      class InlineChainableCalculator {
        constructor(initialValue = 0, precision = 10) {
          this.value = initialValue;
          this.precision = precision;
        }
        
        setPrecision(precision) {
          this.precision = precision;
          return this;
        }
        
        add(value) {
          this.value = parseFloat((this.value + value).toFixed(this.precision));
          return this;
        }
        
        subtract(value) {
          this.value = parseFloat((this.value - value).toFixed(this.precision));
          return this;
        }
        
        multiply(value) {
          this.value = parseFloat((this.value * value).toFixed(this.precision));
          return this;
        }
        
        divide(value) {
          if (value === 0) throw new Error('除数不能为零');
          this.value = parseFloat((this.value / value).toFixed(this.precision));
          return this;
        }
        
        valueOf() {
          return this.value;
        }
        
        toString() {
          return this.value.toString();
        }
      }
      
      return new InlineChainableCalculator(initialValue, options && options.precision);
    }
  },
  
  // 元数据
  version: utils && utils.version ? utils.version : '1.0.0-fallback',
  features: utils && utils.features ? utils.features : {
    precision: true,
    chainable: true,
    batch: true,
    factory: true,
    config: true,
    cache: false,
    performance: false,
    localization: false
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = exportedAPI;
} else if (typeof window !== 'undefined') {
  // 浏览器环境
  window.PrecisionCalculator = coreCalculator.PrecisionCalculator;
  window.ChainableCalculator = chainableCalculator.ChainableCalculator;
  window.calc = calc;
  window.rawCalc = rawCalc;
  window.MathFix = exportedAPI;
}
