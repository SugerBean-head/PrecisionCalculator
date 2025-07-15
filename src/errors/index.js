/**
 * 统一错误处理模块
 * 提供标准化的错误类层次结构
 */

/**
 * MathFix基础错误类
 * 所有其他错误类的父类
 */
class MathFixError extends Error {
  /**
   * 创建MathFix错误实例
   * @param {string} code - 错误代码
   * @param {string} message - 错误消息
   * @param {object} [context={}] - 错误上下文
   */
  constructor(code, message, context = {}) {
    super(message);
    this.code = code;
    this.context = context;
    this.name = this.constructor.name;
    
    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 获取格式化的错误信息
   * @returns {string} 格式化的错误信息
   */
  getFormattedMessage() {
    return `[${this.code}] ${this.message}`;
  }

  /**
   * 获取错误详情
   * @returns {object} 错误详情
   */
  getDetails() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      stack: this.stack
    };
  }
}

/**
 * 无效输入错误
 */
class InvalidInputError extends MathFixError {
  /**
   * 创建无效输入错误实例
   * @param {string} message - 错误消息
   * @param {object} [context] - 错误上下文
   */
  constructor(message, context) {
    super('INVALID_INPUT', message, context);
  }
}

/**
 * 除零错误
 */
class DivisionByZeroError extends MathFixError {
  /**
   * 创建除零错误实例
   * @param {string} message - 错误消息
   * @param {object} [context] - 错误上下文
   */
  constructor(message, context) {
    super('DIVISION_BY_ZERO', message, context);
  }
}

/**
 * 数值范围错误
 */
class NumberRangeError extends MathFixError {
  /**
   * 创建数值范围错误实例
   * @param {string} message - 错误消息
   * @param {object} [context] - 错误上下文
   */
  constructor(message, context) {
    super('NUMBER_RANGE', message, context);
  }
}

/**
 * 精度错误
 */
class PrecisionError extends MathFixError {
  /**
   * 创建精度错误实例
   * @param {string} message - 错误消息
   * @param {object} [context] - 错误上下文
   */
  constructor(message, context) {
    super('PRECISION', message, context);
  }
}

/**
 * 表达式解析错误
 */
class ExpressionParseError extends MathFixError {
  /**
   * 创建表达式解析错误实例
   * @param {string} message - 错误消息
   * @param {object} [context] - 错误上下文
   */
  constructor(message, context) {
    super('EXPRESSION_PARSE', message, context);
  }
}

/**
 * 配置错误
 */
class ConfigurationError extends MathFixError {
  /**
   * 创建配置错误实例
   * @param {string} message - 错误消息
   * @param {object} [context] - 错误上下文
   */
  constructor(message, context) {
    super('CONFIGURATION', message, context);
  }
}

// 导出错误类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MathFixError,
    InvalidInputError,
    DivisionByZeroError,
    NumberRangeError,
    PrecisionError,
    ExpressionParseError,
    ConfigurationError
  };
} else if (typeof window !== 'undefined') {
  window.MathFixErrors = {
    MathFixError,
    InvalidInputError,
    DivisionByZeroError,
    NumberRangeError,
    PrecisionError,
    ExpressionParseError,
    ConfigurationError
  };
}

// ES Module 导出
if (typeof exports !== 'undefined') {
  exports.MathFixError = MathFixError;
  exports.InvalidInputError = InvalidInputError;
  exports.DivisionByZeroError = DivisionByZeroError;
  exports.NumberRangeError = NumberRangeError;
  exports.PrecisionError = PrecisionError;
  exports.ExpressionParseError = ExpressionParseError;
  exports.ConfigurationError = ConfigurationError;
}