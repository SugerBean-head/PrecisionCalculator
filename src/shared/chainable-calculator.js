/**
 * 链式计算器模块
 * 提供链式调用的计算器功能
 */

// 尝试导入核心计算器
let PrecisionCalculator;
try {
  const coreCalculator = require('./core-calculator');
  PrecisionCalculator = coreCalculator.PrecisionCalculator;
} catch (error) {
  // 如果核心计算器不可用，使用内联实现
  console.warn('无法导入核心计算器，使用内联实现');
  
  // 内联的PrecisionCalculator实现
  PrecisionCalculator = class PrecisionCalculatorFallback {
    constructor(precision = 10) {
      this.precision = precision;
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
    
    add(a, b) {
      return a + b;
    }
    
    subtract(a, b) {
      return a - b;
    }
    
    multiply(a, b) {
      return a * b;
    }
    
    divide(a, b) {
      if (b === 0) throw new Error('除数不能为零');
      return a / b;
    }
  };
}

/**
 * 链式计算器类
 * 允许通过链式调用进行连续计算
 */
class ChainableCalculator {
  /**
   * 创建链式计算器实例
   * @param {number} initialValue - 初始值
   * @param {number} [precision=10] - 精度
   */
  constructor(initialValue = 0, precision = 10) {
    this.value = initialValue;
    this.calculator = new PrecisionCalculator(precision);
  }
  
  /**
   * 设置精度
   * @param {number} precision - 精度
   * @returns {ChainableCalculator} 链式计算器实例
   */
  setPrecision(precision) {
    this.calculator.setPrecision(precision);
    return this;
  }
  
  /**
   * 加法
   * @param {number} value - 要加的值
   * @returns {ChainableCalculator} 链式计算器实例
   */
  add(value) {
    this.value = this.calculator.add(this.value, value);
    return this;
  }
  
  /**
   * 减法
   * @param {number} value - 要减的值
   * @returns {ChainableCalculator} 链式计算器实例
   */
  subtract(value) {
    this.value = this.calculator.subtract(this.value, value);
    return this;
  }
  
  /**
   * 乘法
   * @param {number} value - 要乘的值
   * @returns {ChainableCalculator} 链式计算器实例
   */
  multiply(value) {
    this.value = this.calculator.multiply(this.value, value);
    return this;
  }
  
  /**
   * 除法
   * @param {number} value - 要除的值
   * @returns {ChainableCalculator} 链式计算器实例
   */
  divide(value) {
    this.value = this.calculator.divide(this.value, value);
    return this;
  }
  
  /**
   * 平方
   * @returns {ChainableCalculator} 链式计算器实例
   */
  square() {
    this.value = this.calculator.multiply(this.value, this.value);
    return this;
  }
  
  /**
   * 立方
   * @returns {ChainableCalculator} 链式计算器实例
   */
  cube() {
    this.value = this.calculator.multiply(
      this.calculator.multiply(this.value, this.value),
      this.value
    );
    return this;
  }
  
  /**
   * 平方根
   * @returns {ChainableCalculator} 链式计算器实例
   */
  sqrt() {
    if (this.value < 0) {
      throw new Error('不能对负数进行平方根运算');
    }
    this.value = Math.sqrt(this.value);
    return this;
  }
  
  /**
   * 立方根
   * @returns {ChainableCalculator} 链式计算器实例
   */
  cbrt() {
    this.value = Math.cbrt(this.value);
    return this;
  }
  
  /**
   * 绝对值
   * @returns {ChainableCalculator} 链式计算器实例
   */
  abs() {
    this.value = Math.abs(this.value);
    return this;
  }
  
  /**
   * 幂运算
   * @param {number} exponent - 指数
   * @returns {ChainableCalculator} 链式计算器实例
   */
  pow(exponent) {
    this.value = Math.pow(this.value, exponent);
    return this;
  }
  
  /**
   * 对数运算
   * @param {number} [base=Math.E] - 底数，默认为自然对数
   * @returns {ChainableCalculator} 链式计算器实例
   */
  log(base = Math.E) {
    if (this.value <= 0) {
      throw new Error('对数运算的参数必须为正数');
    }
    if (base === Math.E) {
      this.value = Math.log(this.value);
    } else if (base === 10) {
      this.value = Math.log10(this.value);
    } else if (base === 2) {
      this.value = Math.log2(this.value);
    } else {
      this.value = Math.log(this.value) / Math.log(base);
    }
    return this;
  }
  
  /**
   * 四舍五入
   * @param {number} [precision] - 精度，默认为当前精度
   * @returns {ChainableCalculator} 链式计算器实例
   */
  round(precision) {
    const factor = Math.pow(10, precision || this.calculator.precision);
    this.value = Math.round(this.value * factor) / factor;
    return this;
  }
  
  /**
   * 向上取整
   * @param {number} [precision] - 精度，默认为当前精度
   * @returns {ChainableCalculator} 链式计算器实例
   */
  ceil(precision) {
    const factor = Math.pow(10, precision || this.calculator.precision);
    this.value = Math.ceil(this.value * factor) / factor;
    return this;
  }
  
  /**
   * 向下取整
   * @param {number} [precision] - 精度，默认为当前精度
   * @returns {ChainableCalculator} 链式计算器实例
   */
  floor(precision) {
    const factor = Math.pow(10, precision || this.calculator.precision);
    this.value = Math.floor(this.value * factor) / factor;
    return this;
  }
  
  /**
   * 转换为百分比
   * @param {number} [precision] - 精度，默认为当前精度
   * @returns {string} 百分比字符串
   */
  toPercent(precision) {
    const factor = Math.pow(10, precision || this.calculator.precision);
    const percentage = Math.round(this.value * 100 * factor) / factor;
    return `${percentage}%`;
  }
  
  /**
   * 转换为货币
   * @param {string} [currency='CNY'] - 货币代码
   * @param {string} [locale='zh-CN'] - 区域设置
   * @returns {string} 货币字符串
   */
  toCurrency(currency = 'CNY', locale = 'zh-CN') {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(this.value);
    } catch (error) {
      // 如果Intl不可用，使用简单格式
      const symbols = {
        CNY: '¥',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
      };
      const symbol = symbols[currency] || currency;
      return `${symbol}${this.value.toFixed(2)}`;
    }
  }
  
  /**
   * 获取当前值
   * @returns {number} 当前值
   */
  valueOf() {
    return this.value;
  }
  
  /**
   * 转换为字符串
   * @returns {string} 字符串表示
   */
  toString() {
    return this.value.toString();
  }
}

// 导出函数和类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ChainableCalculator
  };
} else if (typeof window !== 'undefined') {
  window.ChainableCalculator = ChainableCalculator;
}

// ES Module 导出
if (typeof exports !== 'undefined') {
  exports.ChainableCalculator = ChainableCalculator;
}