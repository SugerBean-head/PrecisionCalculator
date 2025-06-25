/**
 * 精度计算器输入验证器
 * @author Precision Calculator Team
 * @version 1.1.0
 */

const {
  InvalidInputError,
  NumberRangeError,
  PrecisionError,
  ExpressionParseError
} = require('../errors/calculator-errors');

/**
 * 输入验证器类
 */
class Validator {
  /**
   * 验证数字输入
   * @param {*} value - 要验证的值
   * @param {string} paramName - 参数名称
   * @param {Object} options - 验证选项
   * @param {number} options.min - 最小值
   * @param {number} options.max - 最大值
   * @param {boolean} options.allowInfinite - 是否允许无穷大
   * @param {boolean} options.allowNaN - 是否允许NaN
   * @param {boolean} options.allowNegative - 是否允许负数
   * @returns {number} 验证后的数字
   * @throws {InvalidInputError|NumberRangeError}
   */
  static validateNumber(value, paramName = 'value', options = {}) {
    const {
      min = null,
      max = null,
      allowInfinite = false,
      allowNaN = false,
      allowNegative = true
    } = options;

    // 类型检查
    if (typeof value !== 'number') {
      throw new InvalidInputError(paramName, value, 'number');
    }

    // NaN 检查
    if (Number.isNaN(value) && !allowNaN) {
      throw new InvalidInputError(paramName, value, 'finite number (not NaN)');
    }

    // 无穷大检查
    if (!Number.isFinite(value) && !allowInfinite) {
      throw new InvalidInputError(paramName, value, 'finite number');
    }

    // 负数检查
    if (value < 0 && !allowNegative) {
      throw new NumberRangeError(paramName, value, 0, null);
    }

    // 范围检查
    if (min !== null && value < min) {
      throw new NumberRangeError(paramName, value, min, max);
    }
    if (max !== null && value > max) {
      throw new NumberRangeError(paramName, value, min, max);
    }

    return value;
  }

  /**
   * 验证整数输入
   * @param {*} value - 要验证的值
   * @param {string} paramName - 参数名称
   * @param {Object} options - 验证选项
   * @returns {number} 验证后的整数
   * @throws {InvalidInputError|NumberRangeError}
   */
  static validateInteger(value, paramName = 'value', options = {}) {
    const validatedNumber = this.validateNumber(value, paramName, options);
    
    if (!Number.isInteger(validatedNumber)) {
      throw new InvalidInputError(paramName, value, 'integer');
    }

    return validatedNumber;
  }

  /**
   * 验证精度参数
   * @param {*} precision - 精度值
   * @param {number} maxPrecision - 最大精度
   * @returns {number} 验证后的精度
   * @throws {InvalidInputError|PrecisionError}
   */
  static validatePrecision(precision, maxPrecision = 100) {
    if (precision === undefined || precision === null) {
      return 10; // 默认精度
    }

    const validatedPrecision = this.validateInteger(precision, 'precision', {
      min: 0,
      max: maxPrecision,
      allowNegative: false
    });

    if (validatedPrecision > maxPrecision) {
      throw new PrecisionError(validatedPrecision, maxPrecision);
    }

    return validatedPrecision;
  }

  /**
   * 验证字符串输入
   * @param {*} value - 要验证的值
   * @param {string} paramName - 参数名称
   * @param {Object} options - 验证选项
   * @param {number} options.minLength - 最小长度
   * @param {number} options.maxLength - 最大长度
   * @param {RegExp} options.pattern - 正则表达式模式
   * @returns {string} 验证后的字符串
   * @throws {InvalidInputError}
   */
  static validateString(value, paramName = 'value', options = {}) {
    const { minLength = 0, maxLength = Infinity, pattern = null } = options;

    if (typeof value !== 'string') {
      throw new InvalidInputError(paramName, value, 'string');
    }

    if (value.length < minLength) {
      throw new InvalidInputError(
        paramName,
        value,
        `string with minimum length ${minLength}`
      );
    }

    if (value.length > maxLength) {
      throw new InvalidInputError(
        paramName,
        value,
        `string with maximum length ${maxLength}`
      );
    }

    if (pattern && !pattern.test(value)) {
      throw new InvalidInputError(
        paramName,
        value,
        `string matching pattern ${pattern}`
      );
    }

    return value;
  }

  /**
   * 验证数学表达式
   * @param {string} expression - 数学表达式
   * @returns {string} 验证后的表达式
   * @throws {ExpressionParseError}
   */
  static validateExpression(expression) {
    const validatedExpr = this.validateString(expression, 'expression', {
      minLength: 1,
      maxLength: 1000
    });

    // 检查允许的字符
    const allowedChars = /^[0-9+\-*/().\s\^%!√πe]+$/;
    if (!allowedChars.test(validatedExpr)) {
      const invalidChar = validatedExpr.match(/[^0-9+\-*/().\s\^%!√πe]/);
      throw new ExpressionParseError(
        validatedExpr,
        invalidChar ? validatedExpr.indexOf(invalidChar[0]) : null,
        '包含不允许的字符'
      );
    }

    // 检查括号匹配
    let parenthesesCount = 0;
    for (let i = 0; i < validatedExpr.length; i++) {
      if (validatedExpr[i] === '(') {
        parenthesesCount++;
      } else if (validatedExpr[i] === ')') {
        parenthesesCount--;
        if (parenthesesCount < 0) {
          throw new ExpressionParseError(
            validatedExpr,
            i,
            '括号不匹配'
          );
        }
      }
    }

    if (parenthesesCount !== 0) {
      throw new ExpressionParseError(
        validatedExpr,
        null,
        '括号不匹配'
      );
    }

    // 检查连续运算符
    const consecutiveOperators = /[+\-*/]{2,}/;
    if (consecutiveOperators.test(validatedExpr)) {
      const match = validatedExpr.match(consecutiveOperators);
      throw new ExpressionParseError(
        validatedExpr,
        validatedExpr.indexOf(match[0]),
        '连续的运算符'
      );
    }

    return validatedExpr;
  }

  /**
   * 验证数组输入
   * @param {*} value - 要验证的值
   * @param {string} paramName - 参数名称
   * @param {Object} options - 验证选项
   * @param {number} options.minLength - 最小长度
   * @param {number} options.maxLength - 最大长度
   * @param {Function} options.itemValidator - 元素验证器
   * @returns {Array} 验证后的数组
   * @throws {InvalidInputError}
   */
  static validateArray(value, paramName = 'value', options = {}) {
    const { minLength = 0, maxLength = Infinity, itemValidator = null } = options;

    if (!Array.isArray(value)) {
      throw new InvalidInputError(paramName, value, 'array');
    }

    if (value.length < minLength) {
      throw new InvalidInputError(
        paramName,
        value,
        `array with minimum length ${minLength}`
      );
    }

    if (value.length > maxLength) {
      throw new InvalidInputError(
        paramName,
        value,
        `array with maximum length ${maxLength}`
      );
    }

    // 验证数组元素
    if (itemValidator) {
      value.forEach((item, index) => {
        try {
          itemValidator(item, `${paramName}[${index}]`);
        } catch (error) {
          throw new InvalidInputError(
            `${paramName}[${index}]`,
            item,
            'valid item'
          );
        }
      });
    }

    return value;
  }

  /**
   * 验证货币符号
   * @param {*} symbol - 货币符号
   * @returns {string} 验证后的货币符号
   * @throws {InvalidInputError}
   */
  static validateCurrencySymbol(symbol) {
    if (symbol === undefined || symbol === null) {
      return '¥'; // 默认货币符号
    }

    return this.validateString(symbol, 'currencySymbol', {
      minLength: 1,
      maxLength: 10
    });
  }

  /**
   * 验证单位字符串
   * @param {*} unit - 单位字符串
   * @returns {string} 验证后的单位
   * @throws {InvalidInputError}
   */
  static validateUnit(unit) {
    if (unit === undefined || unit === null) {
      return ''; // 默认无单位
    }

    return this.validateString(unit, 'unit', {
      minLength: 0,
      maxLength: 20
    });
  }

  /**
   * 批量验证参数
   * @param {Object} params - 参数对象
   * @param {Object} rules - 验证规则
   * @returns {Object} 验证后的参数
   * @throws {InvalidInputError}
   */
  static validateParams(params, rules) {
    const validatedParams = {};

    for (const [key, rule] of Object.entries(rules)) {
      const value = params[key];
      
      if (rule.required && (value === undefined || value === null)) {
        throw new InvalidInputError(key, value, 'required parameter');
      }

      if (value !== undefined && value !== null) {
        try {
          validatedParams[key] = rule.validator(value, key, rule.options || {});
        } catch (error) {
          // 重新抛出错误，保持原始错误信息
          throw error;
        }
      } else if (rule.default !== undefined) {
        validatedParams[key] = rule.default;
      }
    }

    return validatedParams;
  }
}

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Validator };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculatorValidator = { Validator };
}