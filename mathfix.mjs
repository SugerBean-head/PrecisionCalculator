/**
 * ES Module version of Precision Calculator
 * 精度计算工具类 - ES模块版本
 * 支持 import { PrecisionCalculator, calc } from "mathfix" 语法
 * 兼容浏览器和Vue3前端项目
 */

/**
 * 精度计算工具类
 * 解决JavaScript浮点数计算精度问题
 */
class PrecisionCalculator {
  constructor() {
    this.precision = 10;
  }

  setPrecision(precision) {
    this.precision = precision;
    return this;
  }

  getDecimalPlaces(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) return 0;
    return str.split('.')[1].length;
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
      throw new Error('除数不能为零');
    }
    
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    return (aInt.value / bInt.value) * (bInt.factor / aInt.factor);
  }

  format(num, precision = this.precision) {
    return parseFloat(num.toFixed(precision));
  }

  round(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  ceil(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.ceil(num * factor) / factor;
  }

  floor(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.floor(num * factor) / factor;
  }

  toPercent(num, precision = 2, withSymbol = true) {
    const result = this.round(num * 100, precision);
    return withSymbol ? result + '%' : result;
  }

  toCurrency(num, symbol = '¥', precision = 2, withComma = true) {
    const rounded = this.round(num, precision);
    let result = rounded.toFixed(precision);
    
    if (withComma) {
      result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    return symbol + result;
  }

  calculate(expression) {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      return this.format(result);
    } catch (error) {
      throw new Error('无效的表达式: ' + expression);
    }
  }

  calculateBatch(expressions) {
    return expressions.map(expr => {
      try {
        return this.calculate(expr);
      } catch (error) {
        return null;
      }
    });
  }
}

/**
 * 链式调用计算器
 */
class ChainableCalculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.calculator = new PrecisionCalculator();
  }

  add(num) {
    this.value = this.calculator.add(this.value, num);
    return this;
  }

  subtract(num) {
    this.value = this.calculator.subtract(this.value, num);
    return this;
  }

  multiply(num) {
    this.value = this.calculator.multiply(this.value, num);
    return this;
  }

  divide(num) {
    this.value = this.calculator.divide(this.value, num);
    return this;
  }

  round(precision = 0) {
    this.value = this.calculator.round(this.value, precision);
    return this;
  }

  ceil(precision = 0) {
    this.value = this.calculator.ceil(this.value, precision);
    return this;
  }

  floor(precision = 0) {
    this.value = this.calculator.floor(this.value, precision);
    return this;
  }

  toPercent(precision = 2, withSymbol = true) {
    return this.calculator.toPercent(this.value, precision, withSymbol);
  }

  toCurrency(symbol = '¥', precision = 2, withComma = true) {
    return this.calculator.toCurrency(this.value, symbol, precision, withComma);
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value.toString();
  }

  reset(value = 0) {
    this.value = value;
    return this;
  }
}

// 创建全局计算器实例
const calculator = new PrecisionCalculator();

// 静态方法对象
const calc = {
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

// 兼容性函数
const EnhancedCalculator = PrecisionCalculator;
const ChainCalculator = ChainableCalculator;
const batch = calc.batch;
const getPerformanceMetrics = () => ({ message: '性能监控功能需要增强模块支持' });
const clearCache = () => false;
const getCacheStats = () => ({ message: '缓存统计功能需要增强模块支持' });
const setConfig = () => false;
const getConfig = (path, defaultValue) => defaultValue;
const setLocale = () => false;
const getInstance = () => null;
const version = '1.1.0';
const features = {
  enhanced: false,
  config: false,
  i18n: false,
  performance: false,
  logging: false
};

// ES模块命名导出
export {
  PrecisionCalculator,
  ChainableCalculator,
  calc,
  EnhancedCalculator,
  ChainCalculator,
  batch,
  getPerformanceMetrics,
  clearCache,
  getCacheStats,
  setConfig,
  getConfig,
  setLocale,
  getInstance,
  version,
  features
};

// 默认导出
export default {
  PrecisionCalculator,
  ChainableCalculator,
  calc,
  EnhancedCalculator,
  ChainCalculator,
  batch,
  getPerformanceMetrics,
  clearCache,
  getCacheStats,
  setConfig,
  getConfig,
  setLocale,
  getInstance,
  version,
  features
};

/**
 * 使用示例:
 * 
 * // 命名导入
 * import { PrecisionCalculator, calc } from "mathfix";
 * const calculator = new PrecisionCalculator();
 * console.log(calc.add(0.1, 0.2)); // 0.3
 * 
 * // 默认导入
 * import precisionCalc from "mathfix";
 * const calculator = new precisionCalc.PrecisionCalculator();
 * 
 * // 混合导入
 * import precisionCalc, { calc, batch } from "mathfix";
 * 
 * // 全部导入
 * import * as PC from "mathfix";
 * const calculator = new PC.PrecisionCalculator();
 */