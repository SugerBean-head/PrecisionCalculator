/**
 * 精度计算工具类
 * 解决JavaScript浮点数计算精度问题，支持公式计算和负号处理
 * 提供精确的四则运算、数值格式化、取整舍入等功能
 * @class PrecisionCalculator
 * @author Precision Calculator Team
 * @version 1.1.0
 * 
 * 新增功能:
 * - 模块化架构
 * - 配置管理
 * - 国际化支持
 * - 增强错误处理
 * - 性能优化
 * - 日志记录
 * - 链式调用
 * - 批量计算
 * @example
 * const calc = new PrecisionCalculator();
 * calc.add(0.1, 0.2); // 0.3 (而不是 0.30000000000000004)
 * calc.calculate('0.1 + 0.2 * 3'); // 0.7
 */
class PrecisionCalculator {
  /**
   * 创建精度计算器实例
   * @constructor
   * @example
   * const calculator = new PrecisionCalculator();
   * calculator.setPrecision(4); // 设置精度为4位小数
   */
  constructor() {
    /**
     * 默认精度位数
     * @type {number}
     * @default 10
     */
    this.precision = 10;
  }

  /**
   * 设置全局计算精度
   * @param {number} precision - 精度位数（小数位数）
   * @returns {PrecisionCalculator} 返回自身以支持链式调用
   * @example
   * calculator.setPrecision(4); // 设置精度为4位小数
   * calculator.setPrecision(2).add(1.234567, 2.345678); // 使用2位精度计算
   */
  setPrecision(precision) {
    this.precision = precision;
    return this;
  }

  /**
   * 获取数字的小数位数
   * @param {number} num - 要检查的数字
   * @returns {number} 小数位数
   * @example
   * calculator.getDecimalPlaces(3.14159); // 5
   * calculator.getDecimalPlaces(10); // 0
   * calculator.getDecimalPlaces(0.1); // 1
   */
  getDecimalPlaces(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) return 0;
    return str.split('.')[1].length;
  }

  /**
   * 将数字转换为整数进行精确计算
   * 通过放大倍数将小数转换为整数，避免浮点数精度问题
   * @param {number} num - 要转换的数字
   * @returns {object} 包含整数值和放大倍数的对象
   * @returns {number} returns.value - 转换后的整数值
   * @returns {number} returns.factor - 放大倍数
   * @example
   * calculator.toInteger(0.123); // {value: 123, factor: 1000}
   * calculator.toInteger(45.67); // {value: 4567, factor: 100}
   */
  toInteger(num) {
    const decimalPlaces = this.getDecimalPlaces(num);
    const factor = Math.pow(10, decimalPlaces);
    return {
      value: Math.round(num * factor),
      factor: factor
    };
  }

  /**
   * 精确加法运算
   * 解决JavaScript浮点数加法精度问题
   * @param {number} a - 被加数
   * @param {number} b - 加数
   * @returns {number} 精确的加法结果
   * @example
   * calculator.add(0.1, 0.2); // 0.3 (而不是 0.30000000000000004)
   * calculator.add(1.1, 2.2); // 3.3 (而不是 3.3000000000000003)
   */
  add(a, b) {
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    const maxFactor = Math.max(aInt.factor, bInt.factor);
    
    const aValue = aInt.value * (maxFactor / aInt.factor);
    const bValue = bInt.value * (maxFactor / bInt.factor);
    
    return (aValue + bValue) / maxFactor;
  }

  /**
   * 精确减法运算
   * 解决JavaScript浮点数减法精度问题
   * @param {number} a - 被减数
   * @param {number} b - 减数
   * @returns {number} 精确的减法结果
   * @example
   * calculator.subtract(0.3, 0.1); // 0.2 (而不是 0.19999999999999998)
   * calculator.subtract(1.0, 0.9); // 0.1 (而不是 0.09999999999999998)
   */
  subtract(a, b) {
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    const maxFactor = Math.max(aInt.factor, bInt.factor);
    
    const aValue = aInt.value * (maxFactor / aInt.factor);
    const bValue = bInt.value * (maxFactor / bInt.factor);
    
    return (aValue - bValue) / maxFactor;
  }

  /**
   * 精确乘法运算
   * 解决JavaScript浮点数乘法精度问题
   * @param {number} a - 被乘数
   * @param {number} b - 乘数
   * @returns {number} 精确的乘法结果
   * @example
   * calculator.multiply(0.2, 0.2); // 0.04 (而不是 0.04000000000000001)
   * calculator.multiply(0.1, 3); // 0.3 (而不是 0.30000000000000004)
   */
  multiply(a, b) {
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    return (aInt.value * bInt.value) / (aInt.factor * bInt.factor);
  }

  /**
   * 精确除法运算
   * 解决JavaScript浮点数除法精度问题
   * @param {number} a - 被除数
   * @param {number} b - 除数
   * @returns {number} 精确的除法结果
   * @throws {Error} 当除数为0时抛出错误
   * @example
   * calculator.divide(0.3, 0.1); // 3 (而不是 2.9999999999999996)
   * calculator.divide(1, 3); // 0.3333333333333333
   */
  divide(a, b) {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    
    const aInt = this.toInteger(a);
    const bInt = this.toInteger(b);
    
    return (aInt.value / bInt.value) * (bInt.factor / aInt.factor);
  }

  /**
   * 格式化结果，保留指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数
   * @returns {number} 格式化后的数字
   */
  format(num, precision = this.precision) {
    return parseFloat(num.toFixed(precision));
  }

  /**
   * 四舍五入到指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为0（取整）
   * @returns {number} 四舍五入后的数字
   */
  round(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  /**
   * 向上取整到指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为0（取整）
   * @returns {number} 向上取整后的数字
   */
  ceil(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.ceil(num * factor) / factor;
  }

  /**
   * 向下取整到指定小数位数
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为0（取整）
   * @returns {number} 向下取整后的数字
   */
  floor(num, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.floor(num * factor) / factor;
  }

  /**
   * 格式化为百分比
   * @param {number} num 数字（小数形式，如0.25表示25%）
   * @param {number} precision 小数位数，默认为2
   * @param {boolean} withSymbol 是否包含%符号，默认为true
   * @returns {string|number} 百分比格式的字符串或数字
   */
  toPercent(num, precision = 2, withSymbol = true) {
    const percentValue = this.multiply(num, 100);
    const rounded = this.round(percentValue, precision);
    return withSymbol ? `${rounded}%` : rounded;
  }

  /**
   * 格式化为货币格式
   * @param {number} num 数字
   * @param {string} currency 货币符号，默认为'¥'
   * @param {number} precision 小数位数，默认为2
   * @param {boolean} thousands 是否使用千分位分隔符，默认为true
   * @returns {string} 货币格式的字符串
   */
  toCurrency(num, currency = '¥', precision = 2, thousands = true) {
    const rounded = this.round(num, precision);
    let formatted = rounded.toFixed(precision);
    
    if (thousands) {
      // 添加千分位分隔符
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }
    
    return `${currency}${formatted}`;
  }

  /**
   * 格式化数字，添加单位
   * @param {number} num 数字
   * @param {string} unit 单位
   * @param {number} precision 小数位数，默认为2
   * @returns {string} 带单位的格式化字符串
   */
  toUnit(num, unit, precision = 2) {
    const rounded = this.round(num, precision);
    return `${rounded}${unit}`;
  }

  /**
   * 智能格式化大数字（自动添加K、M、B等单位）
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为1
   * @param {string} locale 本地化设置，'zh'为中文，'en'为英文，默认为'zh'
   * @returns {string} 格式化后的字符串
   */
  toReadable(num, precision = 1, locale = 'zh') {
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    const units = locale === 'zh' 
      ? [{ value: 1e12, symbol: '万亿' }, { value: 1e8, symbol: '亿' }, { value: 1e4, symbol: '万' }]
      : [{ value: 1e12, symbol: 'T' }, { value: 1e9, symbol: 'B' }, { value: 1e6, symbol: 'M' }, { value: 1e3, symbol: 'K' }];
    
    for (const unit of units) {
      if (abs >= unit.value) {
        const value = this.divide(abs, unit.value);
        const rounded = this.round(value, precision);
        return `${sign}${rounded}${unit.symbol}`;
      }
    }
    
    return `${sign}${this.round(abs, precision)}`;
  }

  /**
   * 科学计数法格式化
   * @param {number} num 数字
   * @param {number} precision 小数位数，默认为2
   * @returns {string} 科学计数法格式的字符串
   */
  toScientific(num, precision = 2) {
    return num.toExponential(precision);
  }

  /**
   * 格式化为分数形式（简单分数）
   * @param {number} num 数字
   * @param {number} maxDenominator 最大分母，默认为100
   * @returns {string} 分数格式的字符串
   */
  toFraction(num, maxDenominator = 100) {
    if (num === 0) return '0';
    
    const sign = num < 0 ? '-' : '';
    const absNum = Math.abs(num);
    const integerPart = Math.floor(absNum);
    const decimalPart = absNum - integerPart;
    
    if (decimalPart === 0) {
      return `${sign}${integerPart}`;
    }
    
    // 寻找最接近的分数
    let bestNumerator = 1;
    let bestDenominator = 1;
    let minDiff = Math.abs(decimalPart - bestNumerator / bestDenominator);
    
    for (let denominator = 2; denominator <= maxDenominator; denominator++) {
      const numerator = Math.round(decimalPart * denominator);
      const diff = Math.abs(decimalPart - numerator / denominator);
      
      if (diff < minDiff) {
        minDiff = diff;
        bestNumerator = numerator;
        bestDenominator = denominator;
      }
    }
    
    // 简化分数
    const gcd = this.getGCD(bestNumerator, bestDenominator);
    bestNumerator /= gcd;
    bestDenominator /= gcd;
    
    if (integerPart === 0) {
      return `${sign}${bestNumerator}/${bestDenominator}`;
    } else {
      return `${sign}${integerPart} ${bestNumerator}/${bestDenominator}`;
    }
  }

  /**
   * 计算最大公约数（辗转相除法）
   * 用于分数化简
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 最大公约数
   * @example
   * calculator.getGCD(12, 8); // 4
   * calculator.getGCD(15, 25); // 5
   */
  getGCD(a, b) {
    return b === 0 ? a : this.getGCD(b, a % b);
  }

  /**
   * 解析并计算数学表达式
   * 支持四则运算、括号、负数等复杂表达式
   * @param {string} expression - 数学表达式字符串
   * @returns {number} 计算结果
   * @throws {Error} 当表达式格式错误或计算失败时抛出错误
   * @example
   * calculator.calculate('0.1 + 0.2'); // 0.3
   * calculator.calculate('(10 + 5) * 2 - 3'); // 27
   * calculator.calculate('-5 + 3'); // -2
   * calculator.calculate('-(5 + 3) * 2'); // -16
   */
  calculate(expression) {
    try {
      // 清理表达式，移除空格
      let cleanExpression = expression.replace(/\s+/g, '');
      
      // 处理负号：将开头的负号和运算符后的负号转换为 (0-number) 形式
      cleanExpression = cleanExpression.replace(/^-/, '(0-');
      cleanExpression = cleanExpression.replace(/([+\-*/\(])-/g, '$1(0-');
      
      // 计算需要添加的右括号数量
      const leftParens = (cleanExpression.match(/\(0-/g) || []).length;
      cleanExpression += ')'.repeat(leftParens);
      
      // 解析并计算表达式
      return this.evaluateExpression(cleanExpression);
    } catch (error) {
      throw new Error(`表达式计算错误: ${error.message}`);
    }
  }

  /**
   * 递归计算表达式（内部方法）
   * 按照数学运算优先级处理表达式
   * @private
   * @param {string} expression - 预处理后的表达式
   * @returns {number} 计算结果
   * @throws {Error} 当括号不匹配时抛出错误
   */
  evaluateExpression(expression) {
    // 处理括号
    while (expression.includes('(')) {
      const lastOpenParen = expression.lastIndexOf('(');
      const firstCloseParen = expression.indexOf(')', lastOpenParen);
      
      if (firstCloseParen === -1) {
        throw new Error('括号不匹配');
      }
      
      const subExpression = expression.substring(lastOpenParen + 1, firstCloseParen);
      const result = this.evaluateExpression(subExpression);
      
      expression = expression.substring(0, lastOpenParen) + result + expression.substring(firstCloseParen + 1);
    }
    
    // 按运算优先级计算
    expression = this.calculateMultiplyDivide(expression);
    expression = this.calculateAddSubtract(expression);
    
    return parseFloat(expression);
  }

  /**
   * 计算表达式中的乘法和除法运算（内部方法）
   * 优先处理乘除运算
   * @private
   * @param {string} expression - 表达式字符串
   * @returns {string} 处理乘除运算后的表达式
   */
  calculateMultiplyDivide(expression) {
    const regex = /(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/;
    
    while (regex.test(expression)) {
      expression = expression.replace(regex, (match, a, operator, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        
        if (operator === '*') {
          return this.multiply(numA, numB).toString();
        } else {
          return this.divide(numA, numB).toString();
        }
      });
    }
    
    return expression;
  }

  /**
   * 计算表达式中的加法和减法运算（内部方法）
   * 处理加减运算
   * @private
   * @param {string} expression - 表达式字符串
   * @returns {string} 处理加减运算后的表达式
   */
  calculateAddSubtract(expression) {
    const regex = /(-?\d+(?:\.\d+)?)\s*([+\-])\s*(-?\d+(?:\.\d+)?)/;
    
    while (regex.test(expression)) {
      expression = expression.replace(regex, (match, a, operator, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        
        if (operator === '+') {
          return this.add(numA, numB).toString();
        } else {
          return this.subtract(numA, numB).toString();
        }
      });
    }
    
    return expression;
  }

  /**
   * 批量计算多个数学表达式
   * @param {string[]} expressions - 数学表达式数组
   * @returns {number[]} 对应的计算结果数组
   * @example
   * calculator.calculateBatch(['0.1 + 0.2', '0.2 * 3', '1 / 3']);
   * // [0.3, 0.6, 0.3333333333333333]
   */
  calculateBatch(expressions) {
    return expressions.map(expr => this.calculate(expr));
  }

  /**
   * 计算数字的平方
   * @param {number} num - 要计算平方的数字
   * @returns {number} 平方结果
   * @example
   * calculator.square(5); // 25
   * calculator.square(0.5); // 0.25
   * calculator.square(-3); // 9
   */
  square(num) {
    return this.multiply(num, num);
  }

  /**
   * 计算数字的立方
   * @param {number} num - 要计算立方的数字
   * @returns {number} 立方结果
   * @example
   * calculator.cube(3); // 27
   * calculator.cube(0.5); // 0.125
   * calculator.cube(-2); // -8
   */
  cube(num) {
    return this.multiply(this.multiply(num, num), num);
  }

  /**
   * 计算数字的开平方根
   * @param {number} num - 要开平方根的数字
   * @returns {number} 平方根结果
   * @throws {Error} 当输入负数时抛出错误
   * @example
   * calculator.sqrt(25); // 5
   * calculator.sqrt(2); // 1.4142135623730951
   * calculator.sqrt(0.25); // 0.5
   */
  sqrt(num) {
    if (num < 0) {
      throw new Error('不能计算负数的平方根');
    }
    return Math.sqrt(num);
  }

  /**
   * 计算数字的开立方根
   * @param {number} num - 要开立方根的数字
   * @returns {number} 立方根结果
   * @example
   * calculator.cbrt(27); // 3
   * calculator.cbrt(8); // 2
   * calculator.cbrt(-8); // -2
   * calculator.cbrt(0.125); // 0.5
   */
  cbrt(num) {
    return Math.cbrt(num);
  }

  /**
   * 计算数字的幂运算
   * @param {number} base - 底数
   * @param {number} exponent - 指数
   * @returns {number} 幂运算结果
   * @example
   * calculator.pow(2, 3); // 8
   * calculator.pow(5, 2); // 25
   * calculator.pow(2, -1); // 0.5
   * calculator.pow(9, 0.5); // 3 (相当于开平方根)
   */
  pow(base, exponent) {
    return Math.pow(base, exponent);
  }

  /**
   * 计算数字的绝对值
   * @param {number} num - 要计算绝对值的数字
   * @returns {number} 绝对值结果
   * @example
   * calculator.abs(-5); // 5
   * calculator.abs(3.14); // 3.14
   * calculator.abs(0); // 0
   */
  abs(num) {
    return Math.abs(num);
  }

  /**
   * 计算数字的对数（以10为底）
   * @param {number} num - 要计算对数的数字
   * @returns {number} 对数结果
   * @throws {Error} 当输入非正数时抛出错误
   * @example
   * calculator.log10(100); // 2
   * calculator.log10(1000); // 3
   * calculator.log10(1); // 0
   */
  log10(num) {
    if (num <= 0) {
      throw new Error('对数的真数必须大于0');
    }
    return Math.log10(num);
  }

  /**
   * 计算数字的自然对数（以e为底）
   * @param {number} num - 要计算自然对数的数字
   * @returns {number} 自然对数结果
   * @throws {Error} 当输入非正数时抛出错误
   * @example
   * calculator.ln(Math.E); // 1
   * calculator.ln(1); // 0
   * calculator.ln(Math.E * Math.E); // 2
   */
  ln(num) {
    if (num <= 0) {
      throw new Error('对数的真数必须大于0');
    }
    return Math.log(num);
  }

  /**
   * 计算e的幂次方
   * @param {number} exponent - 指数
   * @returns {number} e的幂次方结果
   * @example
   * calculator.exp(1); // 2.718281828459045 (e)
   * calculator.exp(0); // 1
   * calculator.exp(2); // 7.38905609893065 (e²)
   */
  exp(exponent) {
    return Math.exp(exponent);
  }

  /**
   * 计算数字的阶乘
   * @param {number} num - 要计算阶乘的数字（必须是非负整数）
   * @returns {number} 阶乘结果
   * @throws {Error} 当输入负数或非整数时抛出错误
   * @example
   * calculator.factorial(5); // 120
   * calculator.factorial(0); // 1
   * calculator.factorial(3); // 6
   */
  factorial(num) {
    if (num < 0 || !Number.isInteger(num)) {
      throw new Error('阶乘只能计算非负整数');
    }
    if (num === 0 || num === 1) {
      return 1;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result = this.multiply(result, i);
    }
    return result;
  }

  /**
   * 计算数字的倒数
   * @param {number} num - 要计算倒数的数字
   * @returns {number} 倒数结果
   * @throws {Error} 当输入0时抛出错误
   * @example
   * calculator.reciprocal(2); // 0.5
   * calculator.reciprocal(0.5); // 2
   * calculator.reciprocal(-4); // -0.25
   */
  reciprocal(num) {
    if (num === 0) {
      throw new Error('0没有倒数');
    }
    return this.divide(1, num);
  }

  /**
   * 计算数字的百分比值
   * @param {number} num - 要计算百分比的数字
   * @returns {number} 百分比数值（小数形式）
   * @example
   * calculator.percentage(50); // 0.5 (50%)
   * calculator.percentage(25); // 0.25 (25%)
   * calculator.percentage(100); // 1 (100%)
   */
  percentage(num) {
    return this.divide(num, 100);
  }
}

// 创建默认实例
const calculator = new PrecisionCalculator();

/**
 * 支持链式调用的计算器类
 * 提供流畅的API接口，支持连续的数学运算和格式化操作
 * @class ChainableCalculator
 * @example
 * // 基础链式调用
 * calc.chain(10).add(5).multiply(2).subtract(3).valueOf(); // 27
 * 
 * // 链式调用 + 格式化
 * calc.chain(1234.567).round(2).toCurrency('$'); // "$1,234.57"
 */
class ChainableCalculator {
  /**
   * 创建链式计算器实例
   * @param {number} [value=0] - 初始值
   */
  constructor(value = 0) {
    this.value = value;
    this.calculator = calculator;
  }

  /**
   * 精确加法运算（链式调用）
   * @param {number} num - 加数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(10).add(5).valueOf(); // 15
   */
  add(num) {
    this.value = this.calculator.add(this.value, num);
    return this;
  }

  /**
   * 精确减法运算（链式调用）
   * @param {number} num - 减数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(10).subtract(3).valueOf(); // 7
   */
  subtract(num) {
    this.value = this.calculator.subtract(this.value, num);
    return this;
  }

  /**
   * 精确乘法运算（链式调用）
   * @param {number} num - 乘数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(10).multiply(2.5).valueOf(); // 25
   */
  multiply(num) {
    this.value = this.calculator.multiply(this.value, num);
    return this;
  }

  /**
   * 精确除法运算（链式调用）
   * @param {number} num - 除数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @throws {Error} 当除数为0时抛出错误
   * @example
   * calc.chain(10).divide(2).valueOf(); // 5
   */
  divide(num) {
    this.value = this.calculator.divide(this.value, num);
    return this;
  }

  /**
   * 计算当前值的平方（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(5).square().valueOf(); // 25
   * calc.chain(0.5).square().valueOf(); // 0.25
   */
  square() {
    this.value = this.calculator.square(this.value);
    return this;
  }

  /**
   * 计算当前值的立方（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(3).cube().valueOf(); // 27
   * calc.chain(0.5).cube().valueOf(); // 0.125
   */
  cube() {
    this.value = this.calculator.cube(this.value);
    return this;
  }

  /**
   * 计算当前值的开平方根（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @throws {Error} 当当前值为负数时抛出错误
   * @example
   * calc.chain(25).sqrt().valueOf(); // 5
   * calc.chain(2).sqrt().valueOf(); // 1.4142135623730951
   */
  sqrt() {
    this.value = this.calculator.sqrt(this.value);
    return this;
  }

  /**
   * 计算当前值的开立方根（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(27).cbrt().valueOf(); // 3
   * calc.chain(-8).cbrt().valueOf(); // -2
   */
  cbrt() {
    this.value = this.calculator.cbrt(this.value);
    return this;
  }

  /**
   * 计算当前值的幂运算（链式调用）
   * @param {number} exponent - 指数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(2).pow(3).valueOf(); // 8
   * calc.chain(9).pow(0.5).valueOf(); // 3
   */
  pow(exponent) {
    this.value = this.calculator.pow(this.value, exponent);
    return this;
  }

  /**
   * 计算当前值的绝对值（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(-5).abs().valueOf(); // 5
   * calc.chain(3.14).abs().valueOf(); // 3.14
   */
  abs() {
    this.value = this.calculator.abs(this.value);
    return this;
  }

  /**
   * 计算当前值的对数（以10为底）（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @throws {Error} 当当前值非正数时抛出错误
   * @example
   * calc.chain(100).log10().valueOf(); // 2
   * calc.chain(1000).log10().valueOf(); // 3
   */
  log10() {
    this.value = this.calculator.log10(this.value);
    return this;
  }

  /**
   * 计算当前值的自然对数（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @throws {Error} 当当前值非正数时抛出错误
   * @example
   * calc.chain(Math.E).ln().valueOf(); // 1
   * calc.chain(1).ln().valueOf(); // 0
   */
  ln() {
    this.value = this.calculator.ln(this.value);
    return this;
  }

  /**
   * 计算e的当前值次方（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(1).exp().valueOf(); // 2.718281828459045
   * calc.chain(0).exp().valueOf(); // 1
   */
  exp() {
    this.value = this.calculator.exp(this.value);
    return this;
  }

  /**
   * 计算当前值的阶乘（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @throws {Error} 当当前值为负数或非整数时抛出错误
   * @example
   * calc.chain(5).factorial().valueOf(); // 120
   * calc.chain(0).factorial().valueOf(); // 1
   */
  factorial() {
    this.value = this.calculator.factorial(this.value);
    return this;
  }

  /**
   * 计算当前值的倒数（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @throws {Error} 当当前值为0时抛出错误
   * @example
   * calc.chain(2).reciprocal().valueOf(); // 0.5
   * calc.chain(0.5).reciprocal().valueOf(); // 2
   */
  reciprocal() {
    this.value = this.calculator.reciprocal(this.value);
    return this;
  }

  /**
   * 将当前值转换为百分比数值（链式调用）
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(50).percentage().valueOf(); // 0.5
   * calc.chain(25).percentage().valueOf(); // 0.25
   */
  percentage() {
    this.value = this.calculator.percentage(this.value);
    return this;
  }

  /**
   * 四舍五入到指定小数位数（链式调用）
   * @param {number} [precision=0] - 保留的小数位数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(10.345).round(2).valueOf(); // 10.35
   */
  round(precision = 0) {
    this.value = this.calculator.round(this.value, precision);
    return this;
  }

  /**
   * 向上取整到指定小数位数（链式调用）
   * @param {number} [precision=0] - 保留的小数位数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(10.342).ceil(2).valueOf(); // 10.35
   */
  ceil(precision = 0) {
    this.value = this.calculator.ceil(this.value, precision);
    return this;
  }

  /**
   * 向下取整到指定小数位数（链式调用）
   * @param {number} [precision=0] - 保留的小数位数
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * calc.chain(10.348).floor(2).valueOf(); // 10.34
   */
  floor(precision = 0) {
    this.value = this.calculator.floor(this.value, precision);
    return this;
  }

  /**
   * 格式化为百分比
   * @param {number} [precision=2] - 小数位数
   * @param {boolean} [withSymbol=true] - 是否包含%符号
   * @returns {string|number} 格式化后的百分比字符串或数值
   * @example
   * calc.chain(0.1256).toPercent(); // "12.56%"
   * calc.chain(0.1256).toPercent(1, false); // 12.6
   */
  toPercent(precision = 2, withSymbol = true) {
    return this.calculator.toPercent(this.value, precision, withSymbol);
  }

  /**
   * 格式化为货币格式
   * @param {string} [currency='¥'] - 货币符号
   * @param {number} [precision=2] - 小数位数
   * @param {boolean} [thousands=true] - 是否使用千分位分隔符
   * @returns {string} 格式化后的货币字符串
   * @example
   * calc.chain(1234.5).toCurrency('$'); // "$1,234.50"
   */
  toCurrency(currency = '¥', precision = 2, thousands = true) {
    return this.calculator.toCurrency(this.value, currency, precision, thousands);
  }

  /**
   * 格式化数字并添加单位
   * @param {string} unit - 单位字符串
   * @param {number} [precision=2] - 小数位数
   * @returns {string} 格式化后的带单位字符串
   * @example
   * calc.chain(123.456).toUnit('kg'); // "123.46kg"
   */
  toUnit(unit, precision = 2) {
    return this.calculator.toUnit(this.value, unit, precision);
  }

  /**
   * 智能格式化大数字（自动添加K、M、B等单位）
   * @param {number} [precision=1] - 小数位数
   * @param {string} [locale='zh'] - 语言环境 ('zh' 或 'en')
   * @returns {string} 格式化后的可读字符串
   * @example
   * calc.chain(1234567).toReadable(); // "1.2百万"
   * calc.chain(1234567).toReadable(2, 'en'); // "1.23M"
   */
  toReadable(precision = 1, locale = 'zh') {
    return this.calculator.toReadable(this.value, precision, locale);
  }

  /**
   * 科学计数法格式化
   * @param {number} [precision=2] - 小数位数
   * @returns {string} 科学计数法格式的字符串
   * @example
   * calc.chain(123456).toScientific(); // "1.23e+5"
   */
  toScientific(precision = 2) {
    return this.calculator.toScientific(this.value, precision);
  }

  /**
   * 格式化为分数形式
   * @param {number} [maxDenominator=100] - 最大分母值
   * @returns {string} 分数格式的字符串
   * @example
   * calc.chain(0.5).toFraction(); // "1/2"
   * calc.chain(1.25).toFraction(); // "1 1/4"
   */
  toFraction(maxDenominator = 100) {
    return this.calculator.toFraction(this.value, maxDenominator);
  }

  /**
   * 格式化数字，保留指定小数位数
   * @param {number} precision - 小数位数
   * @returns {number} 格式化后的数字
   * @example
   * calc.chain(10.345678).format(2); // 10.35
   */
  format(precision) {
    return this.calculator.format(this.value, precision);
  }

  /**
   * 获取当前计算结果的数值
   * @returns {number} 当前存储的数值
   * @example
   * calc.chain(10).add(5).valueOf(); // 15
   */
  valueOf() {
    return this.value;
  }

  /**
   * 获取当前计算结果的字符串表示
   * @returns {string} 当前数值的字符串形式
   * @example
   * calc.chain(10.5).toString(); // "10.5"
   */
  toString() {
    return this.value.toString();
  }

  /**
   * 重置计算器的值
   * @param {number} [value=0] - 新的初始值
   * @returns {ChainableCalculator} 返回自身以支持链式调用
   * @example
   * const calculator = calc.chain(10);
   * calculator.add(5).reset(20).multiply(2).valueOf(); // 40
   */
  reset(value = 0) {
    this.value = value;
    return this;
  }
}

/**
 * 精度计算工具对象
 * 提供便捷的静态方法进行精确数学计算和格式化
 * @namespace calc
 */
const calc = {
  /**
   * 精确加法运算
   * @param {number} a - 被加数
   * @param {number} b - 加数
   * @returns {number} 精确的加法结果
   * @example
   * calc.add(0.1, 0.2); // 0.3 (而不是 0.30000000000000004)
   */
  add: (a, b) => calculator.add(a, b),
  
  /**
   * 精确减法运算
   * @param {number} a - 被减数
   * @param {number} b - 减数
   * @returns {number} 精确的减法结果
   * @example
   * calc.subtract(0.3, 0.1); // 0.2 (而不是 0.19999999999999998)
   */
  subtract: (a, b) => calculator.subtract(a, b),
  
  /**
   * 精确乘法运算
   * @param {number} a - 被乘数
   * @param {number} b - 乘数
   * @returns {number} 精确的乘法结果
   * @example
   * calc.multiply(0.2, 0.2); // 0.04 (而不是 0.04000000000000001)
   */
  multiply: (a, b) => calculator.multiply(a, b),
  
  /**
   * 精确除法运算
   * @param {number} a - 被除数
   * @param {number} b - 除数
   * @returns {number} 精确的除法结果
   * @throws {Error} 当除数为0时抛出错误
   * @example
   * calc.divide(0.3, 0.1); // 3 (而不是 2.9999999999999996)
   */
  divide: (a, b) => calculator.divide(a, b),
  
  /**
   * 解析并计算数学表达式
   * @param {string} expression - 数学表达式字符串
   * @returns {number} 计算结果
   * @example
   * calc.calculate('0.1 + 0.2'); // 0.3
   * calc.calculate('(10 + 5) * 2 - 3'); // 27
   * calc.calculate('-5 + 3'); // -2
   */
  calculate: (expression) => calculator.calculate(expression),
  
  /**
   * 批量计算多个数学表达式
   * @param {string[]} expressions - 数学表达式数组
   * @returns {number[]} 计算结果数组
   * @example
   * calc.batch(['0.1 + 0.2', '0.2 * 3', '1 / 3']); // [0.3, 0.6, 0.3333333333]
   */
  batch: (expressions) => calculator.calculateBatch(expressions),
  
  /**
   * 计算数字的平方
   * @param {number} num - 要计算平方的数字
   * @returns {number} 平方结果
   * @example
   * calc.square(5); // 25
   * calc.square(0.5); // 0.25
   * calc.square(-3); // 9
   */
  square: (num) => calculator.square(num),
  
  /**
   * 计算数字的立方
   * @param {number} num - 要计算立方的数字
   * @returns {number} 立方结果
   * @example
   * calc.cube(3); // 27
   * calc.cube(0.5); // 0.125
   * calc.cube(-2); // -8
   */
  cube: (num) => calculator.cube(num),
  
  /**
   * 计算数字的开平方根
   * @param {number} num - 要开平方根的数字
   * @returns {number} 平方根结果
   * @throws {Error} 当输入负数时抛出错误
   * @example
   * calc.sqrt(25); // 5
   * calc.sqrt(2); // 1.4142135623730951
   * calc.sqrt(0.25); // 0.5
   */
  sqrt: (num) => calculator.sqrt(num),
  
  /**
   * 计算数字的开立方根
   * @param {number} num - 要开立方根的数字
   * @returns {number} 立方根结果
   * @example
   * calc.cbrt(27); // 3
   * calc.cbrt(8); // 2
   * calc.cbrt(-8); // -2
   * calc.cbrt(0.125); // 0.5
   */
  cbrt: (num) => calculator.cbrt(num),
  
  /**
   * 计算数字的幂运算
   * @param {number} base - 底数
   * @param {number} exponent - 指数
   * @returns {number} 幂运算结果
   * @example
   * calc.pow(2, 3); // 8
   * calc.pow(5, 2); // 25
   * calc.pow(2, -1); // 0.5
   * calc.pow(9, 0.5); // 3
   */
  pow: (base, exponent) => calculator.pow(base, exponent),
  
  /**
   * 计算数字的绝对值
   * @param {number} num - 要计算绝对值的数字
   * @returns {number} 绝对值结果
   * @example
   * calc.abs(-5); // 5
   * calc.abs(3.14); // 3.14
   * calc.abs(0); // 0
   */
  abs: (num) => calculator.abs(num),
  
  /**
   * 计算数字的对数（以10为底）
   * @param {number} num - 要计算对数的数字
   * @returns {number} 对数结果
   * @throws {Error} 当输入非正数时抛出错误
   * @example
   * calc.log10(100); // 2
   * calc.log10(1000); // 3
   * calc.log10(1); // 0
   */
  log10: (num) => calculator.log10(num),
  
  /**
   * 计算数字的自然对数（以e为底）
   * @param {number} num - 要计算自然对数的数字
   * @returns {number} 自然对数结果
   * @throws {Error} 当输入非正数时抛出错误
   * @example
   * calc.ln(Math.E); // 1
   * calc.ln(1); // 0
   * calc.ln(Math.E * Math.E); // 2
   */
  ln: (num) => calculator.ln(num),
  
  /**
   * 计算e的幂次方
   * @param {number} exponent - 指数
   * @returns {number} e的幂次方结果
   * @example
   * calc.exp(1); // 2.718281828459045
   * calc.exp(0); // 1
   * calc.exp(2); // 7.38905609893065
   */
  exp: (exponent) => calculator.exp(exponent),
  
  /**
   * 计算数字的阶乘
   * @param {number} num - 要计算阶乘的数字（必须是非负整数）
   * @returns {number} 阶乘结果
   * @throws {Error} 当输入负数或非整数时抛出错误
   * @example
   * calc.factorial(5); // 120
   * calc.factorial(0); // 1
   * calc.factorial(3); // 6
   */
  factorial: (num) => calculator.factorial(num),
  
  /**
   * 计算数字的倒数
   * @param {number} num - 要计算倒数的数字
   * @returns {number} 倒数结果
   * @throws {Error} 当输入0时抛出错误
   * @example
   * calc.reciprocal(2); // 0.5
   * calc.reciprocal(0.5); // 2
   * calc.reciprocal(-4); // -0.25
   */
  reciprocal: (num) => calculator.reciprocal(num),
  
  /**
   * 计算数字的百分比值
   * @param {number} num - 要计算百分比的数字
   * @returns {number} 百分比数值（小数形式）
   * @example
   * calc.percentage(50); // 0.5
   * calc.percentage(25); // 0.25
   * calc.percentage(100); // 1
   */
  percentage: (num) => calculator.percentage(num),
  
  /**
   * 格式化数字，保留指定小数位数
   * @param {number} num - 要格式化的数字
   * @param {number} precision - 小数位数
   * @returns {number} 格式化后的数字
   * @example
   * calc.format(3.14159, 2); // 3.14
   */
  format: (num, precision) => calculator.format(num, precision),
  
  /**
   * 四舍五入到指定精度
   * @param {number} num - 要舍入的数字
   * @param {number} [precision=0] - 小数位数，默认为0（整数）
   * @returns {number} 舍入后的数字
   * @example
   * calc.round(3.14159, 2); // 3.14
   * calc.round(3.6); // 4
   */
  round: (num, precision = 0) => calculator.round(num, precision),
  
  /**
   * 向上取整到指定精度
   * @param {number} num - 要取整的数字
   * @param {number} [precision=0] - 小数位数，默认为0（整数）
   * @returns {number} 向上取整后的数字
   * @example
   * calc.ceil(3.14159, 2); // 3.15
   * calc.ceil(3.1); // 4
   */
  ceil: (num, precision = 0) => calculator.ceil(num, precision),
  
  /**
   * 向下取整到指定精度
   * @param {number} num - 要取整的数字
   * @param {number} [precision=0] - 小数位数，默认为0（整数）
   * @returns {number} 向下取整后的数字
   * @example
   * calc.floor(3.14159, 2); // 3.14
   * calc.floor(3.9); // 3
   */
  floor: (num, precision = 0) => calculator.floor(num, precision),
  
  /**
   * 转换为百分比格式
   * @param {number} num - 要转换的数字（小数形式）
   * @param {number} [precision=2] - 小数位数，默认为2
   * @param {boolean} [withSymbol=true] - 是否包含%符号，默认为true
   * @returns {string} 百分比字符串
   * @example
   * calc.toPercent(0.1234); // "12.34%"
   * calc.toPercent(0.1234, 1, false); // "12.3"
   */
  toPercent: (num, precision = 2, withSymbol = true) => calculator.toPercent(num, precision, withSymbol),
  
  /**
   * 转换为货币格式
   * @param {number} num - 要转换的数字
   * @param {string} [currency='¥'] - 货币符号，默认为'¥'
   * @param {number} [precision=2] - 小数位数，默认为2
   * @param {boolean} [thousands=true] - 是否使用千分位分隔符，默认为true
   * @returns {string} 货币格式字符串
   * @example
   * calc.toCurrency(1234.56); // "¥1,234.56"
   * calc.toCurrency(1234.56, '$', 2, false); // "$1234.56"
   */
  toCurrency: (num, currency = '¥', precision = 2, thousands = true) => calculator.toCurrency(num, currency, precision, thousands),
  
  /**
   * 转换为带单位的格式
   * @param {number} num - 要转换的数字
   * @param {string} unit - 单位字符串
   * @param {number} [precision=2] - 小数位数，默认为2
   * @returns {string} 带单位的格式字符串
   * @example
   * calc.toUnit(1234.56, 'kg'); // "1234.56kg"
   * calc.toUnit(3.14159, 'm', 1); // "3.1m"
   */
  toUnit: (num, unit, precision = 2) => calculator.toUnit(num, unit, precision),
  
  /**
   * 转换为可读的大数字格式（如万、亿等）
   * @param {number} num - 要转换的数字
   * @param {number} [precision=1] - 小数位数，默认为1
   * @param {string} [locale='zh'] - 语言环境，'zh'为中文，'en'为英文
   * @returns {string} 可读格式字符串
   * @example
   * calc.toReadable(12345); // "1.2万"
   * calc.toReadable(12345, 1, 'en'); // "12.3K"
   */
  toReadable: (num, precision = 1, locale = 'zh') => calculator.toReadable(num, precision, locale),
  
  /**
   * 转换为科学计数法格式
   * @param {number} num - 要转换的数字
   * @param {number} [precision=2] - 小数位数，默认为2
   * @returns {string} 科学计数法字符串
   * @example
   * calc.toScientific(1234.56); // "1.23e+3"
   * calc.toScientific(0.00123, 3); // "1.230e-3"
   */
  toScientific: (num, precision = 2) => calculator.toScientific(num, precision),
  
  /**
   * 转换为分数格式
   * @param {number} num - 要转换的数字
   * @param {number} [maxDenominator=100] - 最大分母值，默认为100
   * @returns {string} 分数字符串
   * @example
   * calc.toFraction(0.5); // "1/2"
   * calc.toFraction(0.333); // "1/3"
   */
  toFraction: (num, maxDenominator = 100) => calculator.toFraction(num, maxDenominator),
  
  /**
   * 设置全局计算精度
   * @param {number} precision - 精度值（小数位数）
   * @returns {void}
   * @example
   * calc.setPrecision(4); // 设置全局精度为4位小数
   */
  setPrecision: (precision) => calculator.setPrecision(precision),
  
  /**
   * 获取计算器实例
   * @returns {PrecisionCalculator} 计算器实例
   * @example
   * const instance = calc.getInstance();
   */
  getInstance: () => calculator,
  
  /**
   * 创建链式调用实例
   * @param {number} [value=0] - 初始值，默认为0
   * @returns {ChainableCalculator} 链式计算器实例
   * @example
   * calc.chain(10).add(5).multiply(2).valueOf(); // 30
   * calc.chain().add(0.1).add(0.2).toPercent(); // "30.00%"
   */
  chain: (value = 0) => new ChainableCalculator(value)
};

// 尝试导入增强模块
let EnhancedCalculator, ChainCalculator;
try {
    const enhancedModule = require('./src/core/calculator.js');
    EnhancedCalculator = enhancedModule.PrecisionCalculator;
    ChainCalculator = enhancedModule.ChainCalculator;
} catch (error) {
    // 如果增强模块不可用，使用基础实现
    console.warn('增强模块未找到，使用基础实现');
    // 使用基础PrecisionCalculator作为备用
    EnhancedCalculator = PrecisionCalculator;
}

// 创建增强计算器实例（如果可用）
let enhancedInstance;
if (EnhancedCalculator) {
    try {
        enhancedInstance = new EnhancedCalculator();
    } catch (error) {
        console.warn('无法创建增强计算器实例，使用基础功能');
    }
}

// 新增功能（仅在增强模块可用时提供）
function batch(expressions) {
    if (enhancedInstance && typeof enhancedInstance.batch === 'function') {
        return enhancedInstance.batch(expressions);
    }
    return calculator.calculateBatch(expressions);
}

function getPerformanceMetrics() {
    if (enhancedInstance && typeof enhancedInstance.getPerformanceMetrics === 'function') {
        return enhancedInstance.getPerformanceMetrics();
    }
    return { message: '性能监控功能需要增强模块支持' };
}

function clearCache() {
    if (enhancedInstance && typeof enhancedInstance.clearCache === 'function') {
        enhancedInstance.clearCache();
        return true;
    }
    return false;
}

function getCacheStats() {
    if (enhancedInstance && typeof enhancedInstance.getCacheStats === 'function') {
        return enhancedInstance.getCacheStats();
    }
    return { message: '缓存统计功能需要增强模块支持' };
}

// 配置管理（如果可用）
function setConfig(config) {
    if (enhancedInstance && enhancedInstance.config && typeof enhancedInstance.config.setConfig === 'function') {
        enhancedInstance.config.setConfig(config);
        return true;
    }
    return false;
}

function getConfig(path, defaultValue) {
    if (enhancedInstance && enhancedInstance.config && typeof enhancedInstance.config.get === 'function') {
        return enhancedInstance.config.get(path, defaultValue);
    }
    return defaultValue;
}

// 国际化支持（如果可用）
function setLocale(locale) {
    if (enhancedInstance && enhancedInstance.i18n && typeof enhancedInstance.i18n.setLocale === 'function') {
        enhancedInstance.i18n.setLocale(locale);
        return true;
    }
    return false;
}

// 使用示例
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = { 
    PrecisionCalculator, 
    ChainableCalculator, 
    calc,
    EnhancedCalculator,
    ChainCalculator,
    batch,
    getPerformanceMetrics,
    clearCache,
    getCacheStats,
    setConfig,
    getConfig,
    setLocale,
    getInstance: () => enhancedInstance,
    version: '1.1.0',
    features: {
        enhanced: !!enhancedInstance,
        config: !!(enhancedInstance && enhancedInstance.config),
        i18n: !!(enhancedInstance && enhancedInstance.i18n),
        performance: !!(enhancedInstance && enhancedInstance.performanceMonitor),
        logging: !!(enhancedInstance && enhancedInstance.logger)
    }
  };
} else {
  // 浏览器环境
  window.PrecisionCalculator = PrecisionCalculator;
  window.ChainableCalculator = ChainableCalculator;
  window.calc = calc;
  window.EnhancedCalculator = EnhancedCalculator;
  window.ChainCalculator = ChainCalculator;
  window.PrecisionCalculatorUtils = {
    batch,
    getPerformanceMetrics,
    clearCache,
    getCacheStats,
    setConfig,
    getConfig,
    setLocale,
    getInstance: () => enhancedInstance,
    version: '1.1.0',
    features: {
        enhanced: !!enhancedInstance,
        config: !!(enhancedInstance && enhancedInstance.config),
        i18n: !!(enhancedInstance && enhancedInstance.i18n),
        performance: !!(enhancedInstance && enhancedInstance.performanceMonitor),
        logging: !!(enhancedInstance && enhancedInstance.logger)
    }
  };
}

/* 使用示例：

// 基础运算
console.log(calc.add(0.1, 0.2)); // 0.3 (而不是 0.30000000000000004)
console.log(calc.multiply(0.1, 3)); // 0.3 (而不是 0.30000000000000004)

// 公式计算
console.log(calc.calculate('0.1 + 0.2')); // 0.3
console.log(calc.calculate('0.1 * 3')); // 0.3
console.log(calc.calculate('-5 + 3')); // -2
console.log(calc.calculate('-(5 + 3) * 2')); // -16
console.log(calc.calculate('10 / 3 + 0.1')); // 3.4333333333

// 复杂公式
console.log(calc.calculate('(0.1 + 0.2) * 3 - 0.5')); // 0.4
console.log(calc.calculate('-10 + 5 * 2')); // 0

// 批量计算
const results = calc.batch([
  '0.1 + 0.2',
  '0.1 * 3',
  '10 / 3'
]);
console.log(results); // [0.3, 0.3, 3.3333333333]

// 设置精度
calc.setPrecision(2);
console.log(calc.format(10/3)); // 3.33

// 数值取整和舍入
console.log(calc.round(10.345, 2)); // 10.35
console.log(calc.ceil(10.342, 2)); // 10.35
console.log(calc.floor(10.348, 2)); // 10.34

// 百分比格式化
console.log(calc.toPercent(0.1256)); // 12.56%
console.log(calc.toPercent(0.1256, 1)); // 12.6%
console.log(calc.toPercent(0.1256, 0)); // 13%
console.log(calc.toPercent(0.1256, 2, false)); // 12.56

// 货币格式化
console.log(calc.toCurrency(1234.5)); // ¥1,234.50
console.log(calc.toCurrency(1234.5, '$')); // $1,234.50
console.log(calc.toCurrency(1234.5, '€', 0)); // €1,235
console.log(calc.toCurrency(1234.5, '¥', 2, false)); // ¥1234.50

// 链式调用示例
console.log(calc.chain(10).add(5).multiply(2).subtract(3).valueOf()); // 27
console.log(calc.chain(0.1).add(0.2).multiply(3).round(2).valueOf()); // 0.9
console.log(calc.chain(1234.567).round(2).toCurrency('$')); // $1,234.57
console.log(calc.chain(0.1256).multiply(100).round(1).toPercent(1)); // 12.6%

// 复杂链式调用
const result = calc.chain(100)
  .multiply(0.1)     // 10
  .add(5.5)          // 15.5
  .divide(2)         // 7.75
  .round(1)          // 7.8
  .valueOf();
console.log(result); // 7.8

// 链式调用 + 格式化
const formatted = calc.chain(1000)
  .multiply(1.08)    // 应用8%税率
  .round(2)          // 四舍五入到2位小数
  .toCurrency('$');  // 格式化为美元
console.log(formatted); // $1,080.00

// 单位格式化
console.log(calc.toUnit(123.456, 'kg')); // 123.46kg
console.log(calc.toUnit(123.456, 'm²', 1)); // 123.5m²
console.log(calc.toUnit(0.912, 'L', 3)); // 0.912L

// 大数字格式化
console.log(calc.toReadable(1234)); // 1.2千
console.log(calc.toReadable(12345)); // 1.2万
console.log(calc.toReadable(12345678)); // 1.2千万
console.log(calc.toReadable(1234567890)); // 12.3亿
console.log(calc.toReadable(1234, 1, 'en')); // 1.2K
console.log(calc.toReadable(1234567, 2, 'en')); // 1.23M

// 科学计数法
console.log(calc.toScientific(123456)); // 1.23e+5
console.log(calc.toScientific(0.00012345, 3)); // 1.235e-4

// 分数格式化
console.log(calc.toFraction(0.5)); // 1/2
console.log(calc.toFraction(1.25)); // 1 1/4
console.log(calc.toFraction(3.333333)); // 3 1/3
console.log(calc.toFraction(Math.PI, 1000)); // 3 22/7

*/