/**
 * MathFix - JavaScript浮点数精度修复库类型定义
 */

// 导入核心类型
export {
  MathFixConfig,
  FormatOptions,
  setConfig,
  getConfig,
  addThousandsSeparator
} from './mathfix-core';

/**
 * 格式化选项接口
 */
export interface FormatOptions {
  /** 小数位数 */
  precision?: number;
  /** 是否使用千分位分隔符 */
  thousandsSeparator?: boolean;
  /** 单位 */
  unit?: string;
  /** 单位位置 */
  unitPosition?: 'prefix' | 'suffix';
  /** 是否转换为大写 */
  uppercase?: boolean;
  /** 是否转换为中文数字 */
  chineseNumber?: boolean;
  /** 是否转换为人民币大写 */
  chineseCapital?: boolean;
}

/**
 * 全局配置接口
 */
export interface MathFixConfig {
  /** 默认精度 */
  defaultPrecision?: number;
  /** 是否启用千分位分隔符 */
  thousandsSeparator?: boolean;
  /** 千分位分隔符字符 */
  thousandsSeparatorChar?: string;
  /** 小数点分隔符 */
  decimalSeparator?: string;
  /** 单位 */
  unit?: string;
  /** 单位位置 */
  unitPosition?: 'prefix' | 'suffix';
  /** 是否转换为大写 */
  uppercase?: boolean;
  /** 是否转换为中文数字 */
  chineseNumber?: boolean;
  /** 是否转换为人民币大写 */
  chineseCapital?: boolean;
}

// 重新导出核心函数类型
export {
  getDecimalPlaces,
  add,
  subtract,
  multiply,
  divide,
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
} from './mathfix-core';

// 兼容性：重新声明主要函数类型
/**
 * 获取数字的小数位数
 * @param num 数字
 * @returns 小数位数
 */
export function getDecimalPlaces(num: number): number;

/**
 * 精确加法
 * @param a 加数
 * @param b 被加数
 * @returns 精确的和
 */
export function add(a: number, b: number): number;

/**
 * 精确减法
 * @param a 被减数
 * @param b 减数
 * @returns 精确的差
 */
export function subtract(a: number, b: number): number;

/**
 * 精确乘法
 * @param a 乘数
 * @param b 被乘数
 * @returns 精确的积
 */
export function multiply(a: number, b: number): number;

/**
 * 精确除法
 * @param a 被除数
 * @param b 除数
 * @returns 精确的商
 */
export function divide(a: number, b: number): number;

/**
 * 四舍五入到指定小数位数
 * @param num 数字
 * @param precision 保留的小数位数，如果未指定则使用全局配置
 * @returns 四舍五入后的数字
 */
export function round(num: number, precision?: number): number;

/**
 * 格式化数字，移除多余的小数位
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的数字或字符串
 */
export function format(num: number, options?: FormatOptions): string | number;

/**
 * 精确幂运算
 * @param base 底数
 * @param exponent 指数
 * @returns 精确的幂
 */
export function power(base: number, exponent: number): number;

/**
 * 精确开方
 * @param num 被开方数
 * @param root 开方次数，默认为2（平方根）
 * @returns 精确的根
 */
export function sqrt(num: number, root?: number): number;

/**
 * 百分比计算
 * @param value 数值
 * @param percentage 百分比
 * @returns 百分比对应的数值
 */
export function percentage(value: number, percentage: number): number;

/**
 * 计算百分比增长率
 * @param oldValue 原值
 * @param newValue 新值
 * @returns 增长率百分比
 */
export function percentageChange(oldValue: number, newValue: number): number;

/**
 * 计算平均值
 * @param numbers 数字数组
 * @returns 平均值
 */
export function average(numbers: number[]): number;

/**
 * 计算数组中的最大值
 * @param numbers 数字数组
 * @returns 最大值
 */
export function max(numbers: number[]): number;

/**
 * 计算数组中的最小值
 * @param numbers 数字数组
 * @returns 最小值
 */
export function min(numbers: number[]): number;

/**
 * 计算数组元素的和
 * @param numbers 数字数组
 * @returns 总和
 */
export function sum(numbers: number[]): number;

/**
 * 绝对值
 * @param num 数字
 * @returns 绝对值
 */
export function abs(num: number): number;

/**
 * 向上取整
 * @param num 数字
 * @returns 向上取整后的数字
 */
export function ceil(num: number): number;

/**
 * 向下取整
 * @param num 数字
 * @returns 向下取整后的数字
 */
export function floor(num: number): number;

/**
 * 计算复利
 * @param principal 本金
 * @param rate 利率（小数形式，如0.05表示5%）
 * @param time 时间（年）
 * @param compound 复利次数（每年），默认为1
 * @returns 复利后的金额
 */
export function compoundInterest(principal: number, rate: number, time: number, compound?: number): number;

/**
 * 为数字字符串添加千分位分隔符
 * @param numStr 数字字符串
 * @returns 添加千分位分隔符后的字符串
 */
export function addThousandsSeparator(numStr: string): string;

/**
 * 设置全局配置
 * @param newConfig 新的配置项
 */
export function setConfig(newConfig: Partial<MathFixConfig>): void;

/**
 * 获取当前全局配置
 * @returns 当前配置
 */
export function getConfig(): MathFixConfig;

/**
 * 将数字转换为中文大写数字
 * @param num 数字
 * @returns 中文大写数字字符串
 */
export function toChineseNumber(num: number): string;

/**
 * 将数字转换为人民币大写
 * @param num 数字
 * @returns 人民币大写字符串
 */
export function toChineseCapital(num: number): string;

/**
 * 根据配置添加单位和格式化
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的字符串
 */
export function addUnitAndFormat(num: number, options: Partial<MathFixConfig>): string;

/**
 * 链式调用类
 */
export class MathFixChain {
  value: number;
  
  constructor(value?: number);
  
  add(num: number): MathFixChain;
  subtract(num: number): MathFixChain;
  multiply(num: number): MathFixChain;
  divide(num: number): MathFixChain;
  power(exponent: number): MathFixChain;
  sqrt(root?: number): MathFixChain;
  abs(): MathFixChain;
  ceil(): MathFixChain;
  floor(): MathFixChain;
  round(precision?: number): MathFixChain;
  format(options?: FormatOptions): MathFixChain;
  
  valueOf(): number;
  toString(): string;
  
  static chain(value?: number): MathFixChain;
}

/**
 * 创建链式调用实例的便捷函数
 * @param value 初始值
 * @returns 链式调用实例
 */
export function chain(value?: number): MathFixChain;

/**
 * MathFix 工具对象（浏览器环境下的全局对象）
 */
declare global {
  interface Window {
    MathFix: {
      add: typeof add;
      subtract: typeof subtract;
      multiply: typeof multiply;
      divide: typeof divide;
      round: typeof round;
      format: typeof format;
      getDecimalPlaces: typeof getDecimalPlaces;
      power: typeof power;
      sqrt: typeof sqrt;
      percentage: typeof percentage;
      percentageChange: typeof percentageChange;
      average: typeof average;
      max: typeof max;
      min: typeof min;
      sum: typeof sum;
      abs: typeof abs;
      ceil: typeof ceil;
      floor: typeof floor;
      compoundInterest: typeof compoundInterest;
      // 配置功能
      setConfig: typeof setConfig;
      getConfig: typeof getConfig;
      addThousandsSeparator: typeof addThousandsSeparator;
      toChineseNumber: typeof toChineseNumber;
      toChineseCapital: typeof toChineseCapital;
      addUnitAndFormat: typeof addUnitAndFormat;
      
      // 链式调用
      MathFixChain: typeof MathFixChain;
      chain: typeof chain;
    };
  }
}