/**
 * 精度计算器自定义错误类型
 * @author Precision Calculator Team
 * @version 1.1.0
 */

/**
 * 精度计算器基础错误类
 */
class PrecisionCalculatorError extends Error {
  /**
   * @param {string} message - 错误消息
   * @param {string} code - 错误代码
   * @param {*} details - 错误详情
   */
  constructor(message, code, details = null) {
    super(message);
    this.name = 'PrecisionCalculatorError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // 确保错误堆栈正确显示
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PrecisionCalculatorError);
    }
  }

  /**
   * 转换为JSON格式
   * @returns {Object} JSON表示
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * 除零错误
 */
class DivisionByZeroError extends PrecisionCalculatorError {
  constructor(dividend = null) {
    super(
      '除数不能为零',
      'DIVISION_BY_ZERO',
      { dividend }
    );
    this.name = 'DivisionByZeroError';
  }
}

/**
 * 无效输入错误
 */
class InvalidInputError extends PrecisionCalculatorError {
  constructor(paramName, value, expectedType = 'number') {
    super(
      `参数 ${paramName} 必须是 ${expectedType} 类型，但收到了 ${typeof value}`,
      'INVALID_INPUT',
      { paramName, value, expectedType, actualType: typeof value }
    );
    this.name = 'InvalidInputError';
  }
}

/**
 * 数值范围错误
 */
class NumberRangeError extends PrecisionCalculatorError {
  constructor(paramName, value, min = null, max = null) {
    let message = `参数 ${paramName} 的值 ${value} 超出有效范围`;
    if (min !== null && max !== null) {
      message += ` [${min}, ${max}]`;
    } else if (min !== null) {
      message += ` (最小值: ${min})`;
    } else if (max !== null) {
      message += ` (最大值: ${max})`;
    }
    
    super(
      message,
      'NUMBER_RANGE_ERROR',
      { paramName, value, min, max }
    );
    this.name = 'NumberRangeError';
  }
}

/**
 * 精度错误
 */
class PrecisionError extends PrecisionCalculatorError {
  constructor(requestedPrecision, maxPrecision = 100) {
    super(
      `请求的精度 ${requestedPrecision} 超出最大支持精度 ${maxPrecision}`,
      'PRECISION_ERROR',
      { requestedPrecision, maxPrecision }
    );
    this.name = 'PrecisionError';
  }
}

/**
 * 表达式解析错误
 */
class ExpressionParseError extends PrecisionCalculatorError {
  constructor(expression, position = null, reason = null) {
    let message = `无法解析表达式: ${expression}`;
    if (position !== null) {
      message += ` (位置: ${position})`;
    }
    if (reason) {
      message += ` - ${reason}`;
    }
    
    super(
      message,
      'EXPRESSION_PARSE_ERROR',
      { expression, position, reason }
    );
    this.name = 'ExpressionParseError';
  }
}

/**
 * 数学运算错误
 */
class MathOperationError extends PrecisionCalculatorError {
  constructor(operation, operands, reason = null) {
    let message = `数学运算 ${operation} 失败`;
    if (reason) {
      message += `: ${reason}`;
    }
    
    super(
      message,
      'MATH_OPERATION_ERROR',
      { operation, operands, reason }
    );
    this.name = 'MathOperationError';
  }
}

/**
 * 溢出错误
 */
class OverflowError extends PrecisionCalculatorError {
  constructor(operation, result) {
    super(
      `运算 ${operation} 导致数值溢出: ${result}`,
      'OVERFLOW_ERROR',
      { operation, result }
    );
    this.name = 'OverflowError';
  }
}

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PrecisionCalculatorError,
    DivisionByZeroError,
    InvalidInputError,
    NumberRangeError,
    PrecisionError,
    ExpressionParseError,
    MathOperationError,
    OverflowError
  };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculatorErrors = {
    PrecisionCalculatorError,
    DivisionByZeroError,
    InvalidInputError,
    NumberRangeError,
    PrecisionError,
    ExpressionParseError,
    MathOperationError,
    OverflowError
  };
}