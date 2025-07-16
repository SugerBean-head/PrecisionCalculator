/**
 * 数学计算精度修复工具 (ES Module)
 * 解决JavaScript浮点数计算精度问题，如 0.1 + 0.2 = 0.30000000000000004
 */

// 引入核心函数库
import {
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
  compoundInterest
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

  format() {
    this.value = format(this.value);
    return this;
  }

  // 获取最终结果
  valueOf() {
    return this.value;
  }

  toString() {
    return this.value.toString();
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
  compoundInterest
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
  MathFixChain,
  chain
};