/**
 * MathFix 核心函数库
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
  decimalSeparator: '.',
  // 单位（如：元、$、%等）
  unit: '',
  // 单位位置：'prefix'（前缀）或 'suffix'（后缀）
  unitPosition: 'suffix',
  // 是否转换为大写（主要用于中文数字）
  uppercase: false,
  // 是否转换为中文数字
  chineseNumber: false
};

// 中文数字转换
function toChineseNumber(num) {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
  
  if (num === 0) return '零';
  
  const numStr = Math.abs(num).toString();
  const isNegative = num < 0;
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  let result = '';
  
  // 处理整数部分
  if (integerPart && integerPart !== '0') {
    const len = integerPart.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(integerPart[i]);
      const unitIndex = len - i - 1;
      
      if (digit !== 0) {
        result += digits[digit];
        if (unitIndex > 0) {
          result += units[unitIndex];
        }
      } else if (result && i < len - 1 && parseInt(integerPart[i + 1]) !== 0) {
        result += '零';
      }
    }
  } else {
    result = '零';
  }
  
  // 处理小数部分
  if (decimalPart) {
    result += '点';
    for (let i = 0; i < decimalPart.length; i++) {
      result += digits[parseInt(decimalPart[i])];
    }
  }
  
  return isNegative ? '负' + result : result;
}

// 人民币大写转换函数
function toChineseCapital(num) {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟'];
  const bigUnits = ['', '万', '亿', '兆'];
  
  if (num === 0) return '零元整';
  if (num < 0) return '负' + toChineseCapital(-num);
  
  // 处理超出范围的数字
  if (num >= 1000000000000) {
    throw new Error('数字过大，超出转换范围');
  }
  
  // 分离整数和小数部分
  const parts = num.toString().split('.');
  const integerPart = parseInt(parts[0]);
  const decimalPart = parts[1] || '';
  
  let result = '';
  
  // 处理整数部分
  if (integerPart === 0) {
    result = '零';
  } else {
    result = convertIntegerPart(integerPart, digits, units, bigUnits);
  }
  
  result += '元';
  
  // 处理小数部分（角分）
  if (decimalPart.length > 0) {
    const jiao = decimalPart.length >= 1 ? parseInt(decimalPart[0]) : 0;
    const fen = decimalPart.length >= 2 ? parseInt(decimalPart[1]) : 0;
    
    if (jiao === 0 && fen === 0) {
      result += '整';
    } else {
      if (jiao > 0) {
        result += digits[jiao] + '角';
      } else if (fen > 0) {
        result += '零';
      }
      
      if (fen > 0) {
        result += digits[fen] + '分';
      }
    }
  } else {
    result += '整';
  }
  
  return result;
}

// 辅助函数：转换整数部分
function convertIntegerPart(num, digits, units, bigUnits) {
  if (num === 0) return '';
  
  let result = '';
  let unitIndex = 0;
  
  while (num > 0) {
    const section = num % 10000;
    if (section > 0) {
      let sectionStr = convertSection(section, digits, units);
      if (unitIndex > 0) {
        sectionStr += bigUnits[unitIndex];
      }
      result = sectionStr + result;
    } else if (result && unitIndex > 0) {
      // 处理中间的零
      if (num > 0) {
        result = '零' + result;
      }
    }
    
    num = Math.floor(num / 10000);
    unitIndex++;
  }
  
  return result;
}

// 辅助函数：转换四位数段
function convertSection(num, digits, units) {
  let result = '';
  let needZero = false;
  
  for (let i = 3; i >= 0; i--) {
    const digit = Math.floor(num / Math.pow(10, i)) % 10;
    
    if (digit > 0) {
      if (needZero) {
        result += '零';
        needZero = false;
      }
      result += digits[digit];
      if (i > 0) {
        result += units[i];
      }
    } else if (result) {
      needZero = true;
    }
  }
  
  return result;
}

// 添加单位和格式化处理
function addUnitAndFormat(value, options = {}) {
  const opts = { ...config, ...options };
  let result = value.toString();
  
  // 转换为中文数字
  if (opts.chineseNumber) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    result = toChineseNumber(numValue);
  }
  
  // 转换为大写（主要用于中文）
  if (opts.uppercase && !opts.chineseNumber) {
    result = result.toUpperCase();
  }
  
  // 添加单位
  if (opts.unit) {
    if (opts.unitPosition === 'prefix') {
      result = opts.unit + result;
    } else {
      result = result + opts.unit;
    }
  }
  
  return result;
}

/**
 * 设置全局配置
 * @param {Object} options 配置选项
 * @param {number} options.defaultPrecision 默认小数位数
 * @param {boolean} options.thousandsSeparator 是否启用千分位分隔符
 * @param {string} options.thousandsSeparatorChar 千分位分隔符字符
 * @param {string} options.decimalSeparator 小数点字符
 */
function setConfig(options) {
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
function getConfig() {
  return { ...config };
}

/**
 * 获取数字的小数位数
 * @param {number} num 数字
 * @returns {number} 小数位数
 */
function getDecimalPlaces(num) {
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
function add(a, b) {
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
function subtract(a, b) {
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
function multiply(a, b) {
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
function divide(a, b) {
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
function round(num, precision) {
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
 * @param {string} options.unit 单位，如果未指定则使用全局配置
 * @param {string} options.unitPosition 单位位置，如果未指定则使用全局配置
 * @param {boolean} options.uppercase 是否转换为大写，如果未指定则使用全局配置
 * @param {boolean} options.chineseNumber 是否转换为中文数字，如果未指定则使用全局配置
 * @param {boolean} options.chineseCapital 是否转换为人民币大写，如果未指定则使用全局配置
 * @returns {string|number} 格式化后的数字或字符串
 */
function format(num, options = {}) {
  // 合并全局配置和传入的选项
  const opts = { ...config, ...options };
  
  // 如果没有任何格式化选项，返回精度修复后的数字
  if (Object.keys(options).length === 0 && 
      !opts.thousandsSeparator && 
      !opts.unit && 
      !opts.uppercase && 
      !opts.chineseNumber &&
      !opts.chineseCapital) {
    return parseFloat(num.toPrecision(12));
  }
  
  // 先进行精度处理
  let result = parseFloat(num.toPrecision(12));
  
  // 如果指定了精度，进行四舍五入
  if (opts.precision !== undefined) {
    result = round(result, opts.precision);
  }
  
  // 如果需要转换为人民币大写
  if (opts.chineseCapital) {
    return toChineseCapital(result);
  }
  
  // 如果需要转换为中文数字
  if (opts.chineseNumber) {
    return addUnitAndFormat(result, opts);
  }
  
  // 转换为字符串
  let resultStr = result.toString();
  
  // 添加千分位分隔符
  if (opts.thousandsSeparator) {
    resultStr = addThousandsSeparator(resultStr);
  }
  
  // 转换为大写
  if (opts.uppercase) {
    resultStr = resultStr.toUpperCase();
  }
  
  // 添加单位
  if (opts.unit) {
    if (opts.unitPosition === 'prefix') {
      resultStr = opts.unit + resultStr;
    } else {
      resultStr = resultStr + opts.unit;
    }
  }
  
  // 如果没有进行任何字符串格式化，返回数字
  if (!opts.thousandsSeparator && !opts.unit && !opts.uppercase) {
    return result;
  }
  
  return resultStr;
}

/**
 * 为数字字符串添加千分位分隔符
 * @param {string} numStr 数字字符串
 * @returns {string} 添加千分位分隔符后的字符串
 */
function addThousandsSeparator(numStr) {
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
function power(base, exponent) {
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
function sqrt(num, root = 2) {
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
function percentage(value, percentage) {
  return multiply(value, divide(percentage, 100));
}

/**
 * 计算百分比增长率
 * @param {number} oldValue 原值
 * @param {number} newValue 新值
 * @returns {number} 增长率百分比
 */
function percentageChange(oldValue, newValue) {
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
function average(numbers) {
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
function max(numbers) {
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
function min(numbers) {
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
function sum(numbers) {
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
function abs(num) {
  return num < 0 ? multiply(num, -1) : num;
}

/**
 * 向上取整
 * @param {number} num 数字
 * @returns {number} 向上取整后的数字
 */
function ceil(num) {
  return Math.ceil(num);
}

/**
 * 向下取整
 * @param {number} num 数字
 * @returns {number} 向下取整后的数字
 */
function floor(num) {
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
function compoundInterest(principal, rate, time, compound = 1) {
  // A = P(1 + r/n)^(nt)
  // P = 本金, r = 年利率, n = 每年复利次数, t = 时间（年）
  const ratePerPeriod = divide(rate, compound);
  const onePlusRate = add(1, ratePerPeriod);
  const totalPeriods = multiply(compound, time);
  const compoundFactor = power(onePlusRate, totalPeriods);
  return multiply(principal, compoundFactor);
}

// 导出所有核心函数
module.exports = {
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