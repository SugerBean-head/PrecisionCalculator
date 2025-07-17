/**
 * MathFix - JavaScript浮点数精度修复库 (ES Module)
 * 提供精确的数学运算，解决JavaScript浮点数计算精度问题
 */

// 导入核心函数
import {
  add, subtract, multiply, divide, round, format, getDecimalPlaces,
  power, sqrt, percentage, percentageChange, average, max, min, sum,
  abs, ceil, floor, compoundInterest, setConfig, getConfig, addThousandsSeparator,
  toChineseNumber, toChineseCapital, addUnitAndFormat
} from './mathfix-core.mjs';

/**
 * 链式调用类
 */
export class MathFixChain {
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

// 链式调用的便捷函数
export const chain = (value = 0) => new MathFixChain(value);

// 重新导出所有函数
export {
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
};

// 默认导出包含所有方法的对象
export default {
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
  chain
};