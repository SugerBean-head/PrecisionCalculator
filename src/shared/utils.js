/**
 * 共享的工具函数模块
 * 包含batch函数和其他通用功能
 * 供mathfix.js和mathfix.mjs共同使用
 */

/**
 * 增强的batch函数，支持两种调用方式
 * @param {Array} input - 输入数组（表达式数组或数字数组）
 * @param {string} [operation] - 操作类型（当input为数字数组时使用）
 * @param {number} [precision] - 精度（可选）
 * @param {object} calculator - 计算器实例
 * @param {object} globalConfig - 全局配置对象
 * @returns {Array} 计算结果数组
 */
function batch(input, operation, precision, calculator, globalConfig) {
  if (arguments.length <= 3 || !operation) {
    // 第一种方式：表达式数组
    const expressions = input;
    return calculator.calculateBatch(expressions);
  } else {
    // 第二种方式：数字数组和操作字符串
    const numbers = input;
    const results = [];
    // 如果未指定精度，使用全局配置的默认精度
    const usePrecision = precision !== undefined ? precision : globalConfig.precision.default;
    
    for (let i = 0; i < numbers.length; i++) {
      try {
        let result;
        switch (operation) {
          case 'sqrt':
            result = Math.sqrt(numbers[i]);
            result = calculator.format(result, usePrecision);
            break;
          case 'square':
            result = calculator.multiply(numbers[i], numbers[i]);
            result = calculator.format(result, usePrecision);
            break;
          case 'abs':
            result = Math.abs(numbers[i]);
            result = calculator.format(result, usePrecision);
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

/**
 * 创建原始计算器对象（不应用全局配置）
 * @param {object} calculator - 计算器实例
 * @param {function} ChainableCalculator - 链式计算器类
 * @returns {object} 原始计算器对象
 */
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
    toPercent: (num, precision, withSymbol) => calculator.toPercent(num, precision, withSymbol),
    toCurrency: (num, symbol, precision, withComma) => calculator.toCurrency(num, symbol, precision, withComma),
    calculate: (expression) => calculator.calculate(expression),
    batch: (expressions) => calculator.calculateBatch(expressions),
    setPrecision: (precision) => calculator.setPrecision(precision),
    chain: (initialValue) => new ChainableCalculator(initialValue)
  };
}

/**
 * 创建应用全局配置的计算器对象
 * @param {object} calculator - 计算器实例
 * @param {object} globalConfig - 全局配置对象
 * @param {function} ChainableCalculator - 链式计算器类
 * @returns {object} 应用全局配置的计算器对象
 */
function createCalc(calculator, globalConfig, ChainableCalculator, getGlobalConfig) {
  const getPrecision = () => getGlobalConfig ? getGlobalConfig('precision.default', 10) : globalConfig.precision.default;
  
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
    toPercent: (num, precision, withSymbol) => calculator.toPercent(num, precision, withSymbol),
    toCurrency: (num, symbol, precision, withComma) => calculator.toCurrency(num, symbol, precision, withComma),
    calculate: (expression) => calculator.calculate(expression),
    batch: (expressions) => calculator.calculateBatch(expressions),
    setPrecision: (precision) => {
      calculator.setPrecision(precision);
      if (getGlobalConfig) {
        // 如果有getGlobalConfig函数，说明有配置管理器，应该通过它来设置
        // 这里需要setGlobalConfig函数，但我们没有传入，所以保持原有行为
        globalConfig.precision.default = precision;
      } else {
        globalConfig.precision.default = precision;
      }
    },
    chain: (initialValue) => new ChainableCalculator(initialValue)
  };
}

/**
 * 模拟性能监控功能
 * @returns {object} 性能指标
 */
function getPerformanceMetrics() {
  return { message: '性能监控功能需要增强模块支持' };
}

/**
 * 模拟缓存清理功能
 * @returns {boolean} 清理结果
 */
function clearCache() {
  return false;
}

/**
 * 模拟缓存统计功能
 * @returns {object} 缓存统计
 */
function getCacheStats() {
  return { message: '缓存统计功能需要增强模块支持' };
}

/**
 * 模拟国际化设置功能
 * @returns {boolean} 设置结果
 */
function setLocale() {
  return false;
}

// getInstance函数已移除，不再需要

/**
 * 版本信息
 */
const version = '1.1.0';

/**
 * 功能特性
 */
const features = {
  enhanced: false,
  config: true,
  i18n: false,
  performance: false,
  logging: false
};

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS 环境
  module.exports = {
    batch,
    createRawCalc,
    createCalc,
    getPerformanceMetrics,
    clearCache,
    getCacheStats,
    setLocale,
    version,
    features
  };
} else {
  // ES Module 环境或浏览器环境
  if (typeof window !== 'undefined') {
    window.CalculatorUtils = {
      batch,
      createRawCalc,
      createCalc,
      getPerformanceMetrics,
      clearCache,
      getCacheStats,
      setLocale,
      version,
      features
    };
  }
}

// ES Module 导出（如果支持）
if (typeof exports !== 'undefined') {
  exports.batch = batch;
  exports.createRawCalc = createRawCalc;
  exports.createCalc = createCalc;
  exports.getPerformanceMetrics = getPerformanceMetrics;
  exports.clearCache = clearCache;
  exports.getCacheStats = getCacheStats;
  exports.setLocale = setLocale;
  exports.version = version;
  exports.features = features;
}