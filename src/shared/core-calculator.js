/**
 * 共享的核心计算器类
 * 包含PrecisionCalculator和ChainCalculator的基础实现
 * 供mathfix.js和mathfix.mjs共同使用
 */

// 尝试导入错误模块
let MathFixError, InvalidInputError, DivisionByZeroError, NumberRangeError;
try {
  const errors = require('../errors/index');
  MathFixError = errors.MathFixError;
  InvalidInputError = errors.InvalidInputError;
  DivisionByZeroError = errors.DivisionByZeroError;
  NumberRangeError = errors.NumberRangeError;
} catch (error) {
  // 如果错误模块不可用，使用基础Error类
  MathFixError = Error;
  InvalidInputError = Error;
  DivisionByZeroError = Error;
  NumberRangeError = Error;
}

/**
 * 精度计算工具类
 * 解决JavaScript浮点数计算精度问题
 */
class PrecisionCalculator {
  /**
   * 创建精度计算器实例
   * @param {object} [options={}] - 配置选项
   * @param {number} [options.precision=10] - 默认精度
   */
  constructor(options = {}) {
    /**
     * 默认精度位数
     * @type {number}
     * @default 10
     */
    this.precision = options.precision || 10;
    
    /**
     * 计算缓存
     * @type {Map}
     * @private
     */
    this._cache = new Map();
  }

  /**
   * 设置全局计算精度
   * @param {number} precision - 精度位数（小数位数）
   * @returns {PrecisionCalculator} 返回自身以支持链式调用
   */
  setPrecision(precision) {
    if (typeof precision !== 'number' || precision < 0 || !Number.isInteger(precision)) {
      throw new InvalidInputError('精度必须是非负整数', { precision });
    }
    this.precision = precision;
    return this;
  }

  /**
   * 获取数字的小数位数
   * @param {number} num - 要检查的数字
   * @returns {number} 小数位数
   */
  getDecimalPlaces(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new InvalidInputError('输入必须是有效数字', { input: num });
    }
    
    const str = num.toString();
    if (str.indexOf('.') === -1) return 0;
    return str.split('.')[1].length;
  }

  /**
   * 将数字转换为整数进行精确计算
   * 通过放大倍数将小数转换为整数，避免浮点数精度问题
   * @param {number} num - 要转换的数字
   * @returns {object} 包含整数值和放大倍数的对象
   * @private
   */
  toInteger(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new InvalidInputError('输入必须是有效数字', { input: num });
    }
    
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
    // 参数验证
    if (typeof a !== 'number' || isNaN(a)) {
      throw new InvalidInputError('第一个参数必须是有效数字', { input: a });
    }
    if (typeof b !== 'number' || isNaN(b)) {
      throw new InvalidInputError('第二个参数必须是有效数字', { input: b });
    }
    
    // 检查缓存
    const cacheKey = `add_${a}_${b}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }
    
    // 执行计算
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    const maxFactor = Math.max(aInt.factor, bInt.factor);
    
    const aValue = aInt.value * (maxFactor / aInt.factor);
    const bValue = bInt.value * (maxFactor / bInt.factor);
    
    const result = (aValue + bValue) / maxFactor;
    
    // 缓存结果
    this._cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * 精确减法运算
   * @param {number} a - 被减数
   * @param {number} b - 减数
   * @returns {number} 精确的减法结果
   */
  subtract(a, b) {
    // 参数验证
    if (typeof a !== 'number' || isNaN(a)) {
      throw new InvalidInputError('第一个参数必须是有效数字', { input: a });
    }
    if (typeof b !== 'number' || isNaN(b)) {
      throw new InvalidInputError('第二个参数必须是有效数字', { input: b });
    }
    
    // 检查缓存
    const cacheKey = `subtract_${a}_${b}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }
    
    // 执行计算
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    const maxFactor = Math.max(aInt.factor, bInt.factor);
    
    const aValue = aInt.value * (maxFactor / aInt.factor);
    const bValue = bInt.value * (maxFactor / bInt.factor);
    
    const result = (aValue - bValue) / maxFactor;
    
    // 缓存结果
    this._cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * 精确乘法运算
   * @param {number} a - 被乘数
   * @param {number} b - 乘数
   * @returns {number} 精确的乘法结果
   */
  multiply(a, b) {
    // 参数验证
    if (typeof a !== 'number' || isNaN(a)) {
      throw new InvalidInputError('第一个参数必须是有效数字', { input: a });
    }
    if (typeof b !== 'number' || isNaN(b)) {
      throw new InvalidInputError('第二个参数必须是有效数字', { input: b });
    }
    
    // 检查缓存
    const cacheKey = `multiply_${a}_${b}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }
    
    // 执行计算
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    const result = (aInt.value * bInt.value) / (aInt.factor * bInt.factor);
    
    // 缓存结果
    this._cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * 精确除法运算
   * @param {number} a - 被除数
   * @param {number} b - 除数
   * @returns {number} 精确的除法结果
   */
  divide(a, b) {
    // 参数验证
    if (typeof a !== 'number' || isNaN(a)) {
      throw new InvalidInputError('第一个参数必须是有效数字', { input: a });
    }
    if (typeof b !== 'number' || isNaN(b)) {
      throw new InvalidInputError('第二个参数必须是有效数字', { input: b });
    }
    
    // 检查除数是否为零
    if (b === 0) {
      throw new DivisionByZeroError('除数不能为零', { dividend: a, divisor: b });
    }
    
    // 检查缓存
    const cacheKey = `divide_${a}_${b}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }
    
    // 执行计算
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    const result = (aInt.value / bInt.value) * (bInt.factor / aInt.factor);
    
    // 缓存结果
    this._cache.set(cacheKey, result);
    
    return result;
  }

  /**
   * 格式化数字到指定精度
   * @param {number} num - 要格式化的数字
   * @param {number} [precision] - 精度位数，默认使用实例精度
   * @returns {number} 格式化后的数字
   */
  format(num, precision) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new InvalidInputError('输入必须是有效数字', { input: num });
    }
    
    const usePrecision = precision !== undefined ? precision : this.precision;
    
    if (typeof usePrecision !== 'number' || usePrecision < 0 || !Number.isInteger(usePrecision)) {
      throw new InvalidInputError('精度必须是非负整数', { precision: usePrecision });
    }
    
    const factor = Math.pow(10, usePrecision);
    return Math.round(num * factor) / factor;
  }

  /**
   * 四舍五入到指定精度
   * @param {number} num - 要舍入的数字
   * @param {number} [precision] - 精度位数，默认使用实例精度
   * @returns {number} 舍入后的数字
   */
  round(num, precision) {
    return this.format(num, precision);
  }

  /**
   * 向上取整到指定精度
   * @param {number} num - 要取整的数字
   * @param {number} [precision] - 精度位数，默认使用实例精度
   * @returns {number} 取整后的数字
   */
  ceil(num, precision) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new InvalidInputError('输入必须是有效数字', { input: num });
    }
    
    const usePrecision = precision !== undefined ? precision : this.precision;
    
    if (typeof usePrecision !== 'number' || usePrecision < 0 || !Number.isInteger(usePrecision)) {
      throw new InvalidInputError('精度必须是非负整数', { precision: usePrecision });
    }
    
    const factor = Math.pow(10, usePrecision);
    return Math.ceil(num * factor) / factor;
  }

  /**
   * 向下取整到指定精度
   * @param {number} num - 要取整的数字
   * @param {number} [precision] - 精度位数，默认使用实例精度
   * @returns {number} 取整后的数字
   */
  floor(num, precision) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new InvalidInputError('输入必须是有效数字', { input: num });
    }
    
    const usePrecision = precision !== undefined ? precision : this.precision;
    
    if (typeof usePrecision !== 'number' || usePrecision < 0 || !Number.isInteger(usePrecision)) {
      throw new InvalidInputError('精度必须是非负整数', { precision: usePrecision });
    }
    
    const factor = Math.pow(10, usePrecision);
    return Math.floor(num * factor) / factor;
  }

  /**
   * 清除计算缓存
   * @returns {boolean} 是否成功清除缓存
   */
  clearCache() {
    this._cache.clear();
    return true;
  }

  /**
   * 获取缓存统计信息
   * @returns {object} 缓存统计信息
   */
  getCacheStats() {
    return {
      size: this._cache.size
    };
  }
}

/**
 * 链式计算器类
 * 支持链式调用计算方法
 */
class ChainCalculator {
  /**
   * 创建链式计算器实例
   * @param {number} [initialValue=0] - 初始值
   * @param {PrecisionCalculator} [calculator] - 计算器实例，如果未提供则创建新实例
   */
  constructor(initialValue = 0, calculator) {
    /**
     * 当前值
     * @type {number}
     */
    this.value = initialValue;
    
    /**
     * 计算器实例
     * @type {PrecisionCalculator}
     * @private
     */
    this._calculator = calculator || new PrecisionCalculator();
  }

  /**
   * 设置精度
   * @param {number} precision - 精度位数
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  setPrecision(precision) {
    this._calculator.setPrecision(precision);
    return this;
  }

  /**
   * 链式加法
   * @param {number} num - 加数
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  add(num) {
    this.value = this._calculator.add(this.value, num);
    return this;
  }

  /**
   * 链式减法
   * @param {number} num - 减数
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  subtract(num) {
    this.value = this._calculator.subtract(this.value, num);
    return this;
  }

  /**
   * 链式乘法
   * @param {number} num - 乘数
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  multiply(num) {
    this.value = this._calculator.multiply(this.value, num);
    return this;
  }

  /**
   * 链式除法
   * @param {number} num - 除数
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  divide(num) {
    this.value = this._calculator.divide(this.value, num);
    return this;
  }

  /**
   * 链式平方
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  square() {
    this.value = this._calculator.multiply(this.value, this.value);
    return this;
  }

  /**
   * 链式立方
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  cube() {
    const squared = this._calculator.multiply(this.value, this.value);
    this.value = this._calculator.multiply(squared, this.value);
    return this;
  }

  /**
   * 链式平方根
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  sqrt() {
    if (this.value < 0) {
      throw new NumberRangeError('不能对负数进行平方根运算', { value: this.value });
    }
    this.value = Math.sqrt(this.value);
    return this;
  }

  /**
   * 链式立方根
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  cbrt() {
    this.value = Math.cbrt(this.value);
    return this;
  }

  /**
   * 链式绝对值
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  abs() {
    this.value = Math.abs(this.value);
    return this;
  }

  /**
   * 链式四舍五入
   * @param {number} [precision] - 精度位数，默认使用计算器精度
   * @returns {ChainCalculator} 返回自身以支持链式调用
   */
  round(precision) {
    this.value = this._calculator.round(this.value, precision);
    return this;
  }

  /**
   * 获取当前值
   * @param {number} [precision] - 格式化精度，默认使用计算器精度
   * @returns {number} 当前值
   */
  valueOf(precision) {
    return precision !== undefined ? 
      this._calculator.format(this.value, precision) : 
      this.value;
  }

  /**
   * 转换为字符串
   * @returns {string} 字符串表示
   */
  toString() {
    return this.value.toString();
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PrecisionCalculator,
    ChainCalculator
  };
} else if (typeof window !== 'undefined') {
  window.PrecisionCalculator = PrecisionCalculator;
  window.ChainCalculator = ChainCalculator;
}

// ES Module 导出
if (typeof exports !== 'undefined') {
  exports.PrecisionCalculator = PrecisionCalculator;
  exports.ChainCalculator = ChainCalculator;
}