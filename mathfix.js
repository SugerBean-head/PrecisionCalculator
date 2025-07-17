/**
 * 数学计算精度修复工具 (CommonJS)
 * 解决JavaScript浮点数计算精度问题，如 0.1 + 0.2 = 0.30000000000000004
 */

// 引入核心函数库
const {
  add,
  subtract,
  multiply,
  divide,
  round,
  format,
  getDecimalPlaces,
  power,
  sqrt,
  percentage,
  percentageChange,
  average,
  max,
  min,
  sum,
  abs,
  ceil,
  floor,
  compoundInterest,
  setConfig,
  getConfig,
  addThousandsSeparator,
  toChineseNumber,
  toChineseCapital,
  addUnitAndFormat
} = require('./mathfix-core.js');

/**
 * 链式调用类
 */
class MathFixChain {
  constructor(value = 0) {
    this.value = value;
  }

  // 基础运算方法（支持链式调用）
  add(num) {
    this.value = add(this.value, num);
    return this;
  }

  subtract(num) {
    this.value = subtract(this.value, num);
    return this;
  }

  multiply(num) {
    this.value = multiply(this.value, num);
    return this;
  }

  divide(num) {
    this.value = divide(this.value, num);
    return this;
  }

  power(exponent) {
    this.value = power(this.value, exponent);
    return this;
  }

  sqrt(root = 2) {
    this.value = sqrt(this.value, root);
    return this;
  }

  abs() {
    this.value = abs(this.value);
    return this;
  }

  ceil() {
    this.value = ceil(this.value);
    return this;
  }

  floor() {
    this.value = floor(this.value);
    return this;
  }

  round(precision = 2) {
    this.value = round(this.value, precision);
    return this;
  }

  format(options) {
    const result = format(this.value, options);
    // 如果format返回字符串，保持为字符串；如果返回数字，保持为数字
    this.value = result;
    return this;
  }

  // 获取最终结果
  valueOf() {
    return this.value;
  }

  toString() {
    return String(this.value);
  }

  // 静态方法：创建新的链式调用实例
  static chain(value = 0) {
    return new MathFixChain(value);
  }
}

// 导出所有方法和链式调用类
module.exports = {
  // 静态方法
  add,
  subtract,
  multiply,
  divide,
  round,
  format,
  getDecimalPlaces,
  power,
  sqrt,
  percentage,
  percentageChange,
  average,
  max,
  min,
  sum,
  abs,
  ceil,
  floor,
  compoundInterest,
  setConfig,
  getConfig,
  addThousandsSeparator,
  toChineseNumber,
  toChineseCapital,
  addUnitAndFormat,
  
  // 链式调用
  MathFixChain,
  chain: MathFixChain.chain
};

// 如果在浏览器环境中，也支持全局访问
if (typeof window !== 'undefined') {
  window.MathFix = {
    add,
    subtract,
    multiply,
    divide,
    round,
    format,
    getDecimalPlaces,
    power,
    sqrt,
    percentage,
    percentageChange,
    average,
    max,
    min,
    sum,
    abs,
    ceil,
    floor,
    compoundInterest,
    setConfig,
    getConfig,
    addThousandsSeparator,
    toChineseNumber,
    toChineseCapital,
    addUnitAndFormat,
    MathFixChain,
    chain: MathFixChain.chain
  };
}