/**
 * MathFix 核心函数库 (ES Module)
 * 包含所有数学计算精度修复的核心实现
 * 解决JavaScript浮点数计算精度问题，如 0.1 + 0.2 = 0.30000000000000004
 */

/**
 * 全局配置对象
 */
const config = {
  // 默认小数位数
  defaultPrecision: 2,
  // 是否启用千分位分隔符
  thousandsSeparator: false,
  // 千分位分隔符字符
  thousandsSeparatorChar: ',',
  // 小数点字符
  decimalSeparator: '.'
};

/**
 * 设置全局配置
 * @param {Object} options 配置选项
 * @param {number} options.defaultPrecision 默认小数位数
 * @param {boolean} options.thousandsSeparator 是否启用千分位分隔符
 * @param {string} options.thousandsSeparatorChar 千分位分隔符字符
 * @param {string} options.decimalSeparator 小数点字符
 */
export function setConfig(options) {
  if (typeof options !== 'object' || options === null) {
    throw new Error('配置选项必须是一个对象');
  }
  
  if (typeof options.defaultPrecision === 'number' && options.defaultPrecision >= 0) {
    config.defaultPrecision = Math.floor(options.defaultPrecision);
  }
  
  if (typeof options.thousandsSeparator === 'boolean') {
    config.thousandsSeparator = options.thousandsSeparator;
  }
  
  if (typeof options.thousandsSeparatorChar === 'string') {
    config.thousandsSeparatorChar = options.thousandsSeparatorChar;
  }
  
  if (typeof options.decimalSeparator === 'string') {
    config.decimalSeparator = options.decimalSeparator;
  }
}

/**
 * 获取当前全局配置
 * @returns {Object} 当前配置对象的副本
 */
export function getConfig() {
  return { ...config };
}

/**
 * 获取数字的小数位数
 * @param {number} num 数字
 * @returns {number} 小数位数
 */
export function getDecimalPlaces(num) {
  const str = num.toString();
  if (str.indexOf('.') !== -1) {
    return str.split('.')[1].length;
  }
  return 0;
}

/**
 * 将小数转换为整数进行计算
 * @param {number} num 数字
 * @param {number} precision 精度（小数位数）
 * @returns {number} 转换后的整数
 */
function toInteger(num, precision) {
  return Math.round(num * Math.pow(10, precision));
}

/**
 * 精确加法
 * @param {number} a 加数
 * @param {number} b 被加数
 * @returns {number} 精确的和
 */
export function add(a, b) {
  const precision = Math.max(getDecimalPlaces(a), getDecimalPlaces(b));
  const multiplier = Math.pow(10, precision);
  return (toInteger(a, precision) + toInteger(b, precision)) / multiplier;
}

/**
 * 精确减法
 * @param {number} a 被减数
 * @param {number} b 减数
 * @returns {number} 精确的差
 */
export function subtract(a, b) {
  const precision = Math.max(getDecimalPlaces(a), getDecimalPlaces(b));
  const multiplier = Math.pow(10, precision);
  return (toInteger(a, precision) - toInteger(b, precision)) / multiplier;
}

/**
 * 精确乘法
 * @param {number} a 乘数
 * @param {number} b 被乘数
 * @returns {number} 精确的积
 */
export function multiply(a, b) {
  const precisionA = getDecimalPlaces(a);
  const precisionB = getDecimalPlaces(b);
  const multiplier = Math.pow(10, precisionA + precisionB);
  return (toInteger(a, precisionA) * toInteger(b, precisionB)) / multiplier;
}

/**
 * 精确除法
 * @param {number} a 被除数
 * @param {number} b 除数
 * @returns {number} 精确的商
 */
export function divide(a, b) {
  if (b === 0) {
    throw new Error('除数不能为0');
  }
  const precisionA = getDecimalPlaces(a);
  const precisionB = getDecimalPlaces(b);
  const precision = Math.max(precisionA, precisionB);
  const multiplier = Math.pow(10, precision);
  return (toInteger(a, precision) / toInteger(b, precision));
}

/**
 * 四舍五入到指定小数位数
 * @param {number} num 数字
 * @param {number} precision 保留的小数位数，如果未指定则使用全局配置
 * @returns {number} 四舍五入后的数字
 */
export function round(num, precision) {
  const actualPrecision = precision !== undefined ? precision : config.defaultPrecision;
  const multiplier = Math.pow(10, actualPrecision);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * 格式化数字，移除多余的小数位
 * @param {number} num 数字
 * @param {Object} options 格式化选项
 * @param {number} options.precision 小数位数，如果未指定则使用全局配置
 * @param {boolean} options.thousandsSeparator 是否使用千分位分隔符，如果未指定则使用全局配置
 * @returns {string|number} 格式化后的数字或字符串
 */
export function format(num, options = {}) {
  // 如果没有传入选项，返回精度修复后的数字
  if (Object.keys(options).length === 0 && !config.thousandsSeparator) {
    return parseFloat(num.toPrecision(12));
  }
  
  const precision = options.precision !== undefined ? options.precision : config.defaultPrecision;
  const useThousandsSeparator = options.thousandsSeparator !== undefined ? 
    options.thousandsSeparator : config.thousandsSeparator;
  
  // 先进行精度处理
  let result = parseFloat(num.toPrecision(12));
  
  // 如果指定了精度，进行四舍五入
  if (precision !== undefined) {
    result = round(result, precision);
  }
  
  // 如果不需要千分位分隔符，直接返回数字
  if (!useThousandsSeparator) {
    return result;
  }
  
  // 转换为字符串并添加千分位分隔符
  return addThousandsSeparator(result.toString());
}

/**
 * 为数字字符串添加千分位分隔符
 * @param {string} numStr 数字字符串
 * @returns {string} 添加千分位分隔符后的字符串
 */
export function addThousandsSeparator(numStr) {
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // 为整数部分添加千分位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparatorChar);
  
  // 组合整数和小数部分
  if (decimalPart) {
    return formattedInteger + config.decimalSeparator + decimalPart;
  } else {
    return formattedInteger;
  }
}

/**
 * 精确幂运算
 * @param {number} base 底数
 * @param {number} exponent 指数
 * @returns {number} 精确的幂
 */
export function power(base, exponent) {
  if (exponent === 0) return 1;
  if (exponent === 1) return base;
  
  // 对于所有情况使用Math.pow并格式化结果
  const result = Math.pow(base, exponent);
  return format(result);
}

/**
 * 精确开方
 * @param {number} num 被开方数
 * @param {number} root 开方次数，默认为2（平方根）
 * @returns {number} 精确的根
 */
export function sqrt(num, root = 2) {
  if (num < 0 && root % 2 === 0) {
    throw new Error('偶数次根不能计算负数');
  }
  if (root === 0) {
    throw new Error('根次数不能为0');
  }
  
  return format(Math.pow(num, 1 / root));
}

/**
 * 百分比计算
 * @param {number} value 数值
 * @param {number} percentage 百分比
 * @returns {number} 百分比对应的数值
 */
export function percentage(value, percentage) {
  return multiply(value, divide(percentage, 100));
}

/**
 * 计算百分比增长率
 * @param {number} oldValue 原值
 * @param {number} newValue 新值
 * @returns {number} 增长率百分比
 */
export function percentageChange(oldValue, newValue) {
  if (oldValue === 0) {
    throw new Error('原值不能为0');
  }
  const change = subtract(newValue, oldValue);
  return multiply(divide(change, oldValue), 100);
}

/**
 * 计算平均值
 * @param {number[]} numbers 数字数组
 * @returns {number} 平均值
 */
export function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('输入必须是非空数组');
  }
  
  const totalSum = sum(numbers);
  return divide(totalSum, numbers.length);
}

/**
 * 计算数组中的最大值
 * @param {number[]} numbers 数字数组
 * @returns {number} 最大值
 */
export function max(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('输入必须是非空数组');
  }
  return Math.max(...numbers);
}

/**
 * 计算数组中的最小值
 * @param {number[]} numbers 数字数组
 * @returns {number} 最小值
 */
export function min(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('输入必须是非空数组');
  }
  return Math.min(...numbers);
}

/**
 * 计算数组元素的和
 * @param {number[]} numbers 数字数组
 * @returns {number} 总和
 */
export function sum(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('输入必须是非空数组');
  }
  
  let result = 0;
  for (const num of numbers) {
    result = add(result, num);
  }
  return result;
}

/**
 * 绝对值
 * @param {number} num 数字
 * @returns {number} 绝对值
 */
export function abs(num) {
  return num < 0 ? multiply(num, -1) : num;
}

/**
 * 向上取整
 * @param {number} num 数字
 * @returns {number} 向上取整后的数字
 */
export function ceil(num) {
  return Math.ceil(num);
}

/**
 * 向下取整
 * @param {number} num 数字
 * @returns {number} 向下取整后的数字
 */
export function floor(num) {
  return Math.floor(num);
}

/**
 * 计算复利
 * @param {number} principal 本金
 * @param {number} rate 利率（小数形式，如0.05表示5%）
 * @param {number} time 时间（年）
 * @param {number} compound 复利次数（每年），默认为1
 * @returns {number} 复利后的金额
 */
export function compoundInterest(principal, rate, time, compound = 1) {
  // A = P(1 + r/n)^(nt)
  // P = 本金, r = 年利率, n = 每年复利次数, t = 时间（年）
  const ratePerPeriod = divide(rate, compound);
  const onePlusRate = add(1, ratePerPeriod);
  const totalPeriods = multiply(compound, time);
  const compoundFactor = power(onePlusRate, totalPeriods);
  return multiply(principal, compoundFactor);
}