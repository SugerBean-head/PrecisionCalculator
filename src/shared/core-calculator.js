/**
 * 共享的核心计算器类
 * 包含PrecisionCalculator和ChainableCalculator的基础实现
 * 供mathfix.js和mathfix.mjs共同使用
 */

/**
 * 精度计算工具类
 * 解决JavaScript浮点数计算精度问题
 */
class PrecisionCalculator {
  /**
   * 创建精度计算器实例
   * @constructor
   */
  constructor() {
    /**
     * 默认精度位数
     * @type {number}
     * @default 10
     */
    this.precision = 10;
  }

  /**
   * 设置全局计算精度
   * @param {number} precision - 精度位数（小数位数）
   * @returns {PrecisionCalculator} 返回自身以支持链式调用
   */
  setPrecision(precision) {
    this.precision = precision;
    return this;
  }

  /**
   * 获取数字的小数位数
   * @param {number} num - 要检查的数字
   * @returns {number} 小数位数
   */
  getDecimalPlaces(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) return 0;
    return str.split('.')[1].length;
  }

  /**
   * 将数字转换为整数进行精确计算
   * 通过放大倍数将小数转换为整数，避免浮点数精度问题
   * @param {number} num - 要转换的数字
   * @returns {object} 包含整数值和放大倍数的对象
   */
  toInteger(num) {
    const decimalPlaces = this.getDecimalPlaces(num);
    const factor = Math.pow(10, decimalPlaces);
    return {
      value: Math.round(num * factor),
      factor: factor
    };
  }

  /**
   * 精确加法运算
   * @param {number} a - 被加数
   * @param {number} b - 加数
   * @returns {number} 精确的加法结果
   */
  add(a, b) {
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    const maxFactor = Math.max(aInt.factor, bInt.factor);
    
    const aValue = aInt.value * (maxFactor / aInt.factor);
    const bValue = bInt.value * (maxFactor / bInt.factor);
    
    return (aValue + bValue) / maxFactor;
  }

  /**
   * 精确减法运算
   * @param {number} a - 被减数
   * @param {number} b - 减数
   * @returns {number} 精确的减法结果
   */
  subtract(a, b) {
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    const maxFactor = Math.max(aInt.factor, bInt.factor);
    
    const aValue = aInt.value * (maxFactor / aInt.factor);
    const bValue = bInt.value * (maxFactor / bInt.factor);
    
    return (aValue - bValue) / maxFactor;
  }

  /**
   * 精确乘法运算
   * @param {number} a - 被乘数
   * @param {number} b - 乘数
   * @returns {number} 精确的乘法结果
   */
  multiply(a, b) {
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    return (aInt.value * bInt.value) / (aInt.factor * bInt.factor);
  }

  /**
   * 精确除法运算
   * @param {number} a - 被除数
   * @param {number} b - 除数
   * @returns {number} 精确的除法结果
   * @throws {Error} 当除数为0时抛出错误
   */
  divide(a, b) {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    return (aInt.value / bInt.value) * (bInt.factor / aInt.factor);
  }

  /**
   * 格式化结果，保留指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数
   * @returns {number} 格式化后的数字
   */
  format(num, precision = this.precision) {
    return parseFloat(num.toFixed(precision));
  }

  /**
   * 四舍五入到指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为0（取整）
   * @returns {number} 四舍五入后的数字
   */
  round(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  /**
   * 向上取整到指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为0（取整）
   * @returns {number} 向上取整后的数字
   */
  ceil(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.ceil(num * factor) / factor;
  }

  /**
   * 向下取整到指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为0（取整）
   * @returns {number} 向下取整后的数字
   */
  floor(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.floor(num * factor) / factor;
  }

  /**
   * 转换为百分比格式
   * @param {number} num - 要转换的数字（小数形式）
   * @param {number} [precision=2] - 小数位数，默认为2
   * @param {boolean} [withSymbol=true] - 是否包含%符号，默认为true
   * @returns {string} 百分比字符串
   */
  toPercent(num, precision = 2, withSymbol = true) {
    const result = this.round(num * 100, precision);
    return withSymbol ? result + '%' : result;
  }

  /**
   * 转换为货币格式
   * @param {number} num - 要转换的数字
   * @param {string} [symbol='¥'] - 货币符号，默认为'¥'
   * @param {number} [precision=2] - 小数位数，默认为2
   * @param {boolean} [withComma=true] - 是否使用千分位分隔符，默认为true
   * @returns {string} 货币格式字符串
   */
  toCurrency(num, symbol = '¥', precision = 2, withComma = true) {
    const rounded = this.round(num, precision);
    let result = rounded.toFixed(precision);
    
    if (withComma) {
      result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    return symbol + result;
  }

  /**
   * 解析并计算数学表达式
   * @param {string} expression - 数学表达式字符串
   * @returns {number} 计算结果
   */
  calculate(expression) {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      return this.format(result);
    } catch (error) {
      throw new Error('无效的表达式: ' + expression);
    }
  }

  /**
   * 批量计算多个数学表达式
   * @param {string[]} expressions - 数学表达式数组
   * @returns {number[]} 计算结果数组
   */
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
  /**
   * 创建链式计算器实例
   * @param {number} [initialValue=0] - 初始值
   */
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.calculator = new PrecisionCalculator();
  }

  /**
   * 加法运算
   * @param {number} num - 加数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  add(num) {
    this.value = this.calculator.add(this.value, num);
    return this;
  }

  /**
   * 减法运算
   * @param {number} num - 减数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  subtract(num) {
    this.value = this.calculator.subtract(this.value, num);
    return this;
  }

  /**
   * 乘法运算
   * @param {number} num - 乘数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  multiply(num) {
    this.value = this.calculator.multiply(this.value, num);
    return this;
  }

  /**
   * 除法运算
   * @param {number} num - 除数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  divide(num) {
    this.value = this.calculator.divide(this.value, num);
    return this;
  }

  /**
   * 四舍五入
   * @param {number} [precision=0] - 精度
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  round(precision = 0) {
    this.value = this.calculator.round(this.value, precision);
    return this;
  }

  /**
   * 向上取整
   * @param {number} [precision=0] - 精度
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  ceil(precision = 0) {
    this.value = this.calculator.ceil(this.value, precision);
    return this;
  }

  /**
   * 向下取整
   * @param {number} [precision=0] - 精度
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  floor(precision = 0) {
    this.value = this.calculator.floor(this.value, precision);
    return this;
  }

  /**
   * 格式化
   * @param {number} precision - 精度
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  format(precision) {
    this.value = this.calculator.format(this.value, precision);
    return this;
  }

  /**
   * 转换为百分比格式
   * @param {number} [precision=2] - 精度
   * @param {boolean} [withSymbol=true] - 是否包含符号
   * @returns {string} 百分比字符串
   */
  toPercent(precision = 2, withSymbol = true) {
    return this.calculator.toPercent(this.value, precision, withSymbol);
  }

  /**
   * 转换为货币格式
   * @param {string} [symbol='¥'] - 货币符号
   * @param {number} [precision=2] - 精度
   * @param {boolean} [withComma=true] - 是否使用千分位分隔符
   * @returns {string} 货币格式字符串
   */
  toCurrency(symbol = '¥', precision = 2, withComma = true) {
    return this.calculator.toCurrency(this.value, symbol, precision, withComma);
  }

  /**
   * 获取数值（valueOf 方法）
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

  /**
   * 重置值
   * @param {number} [value=0] - 新值
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   */
  reset(value = 0) {
    this.value = value;
    return this;
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS 环境
  module.exports = {
    PrecisionCalculator,
    ChainableCalculator
  };
} else {
  // ES Module 环境或浏览器环境
  if (typeof window !== 'undefined') {
    window.PrecisionCalculator = PrecisionCalculator;
    window.ChainableCalculator = ChainableCalculator;
  }
}

// ES Module 导出（如果支持）
if (typeof exports !== 'undefined') {
  exports.PrecisionCalculator = PrecisionCalculator;
  exports.ChainableCalculator = ChainableCalculator;
}