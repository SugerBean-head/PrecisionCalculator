/**
 * 国际化支持模块
 * @author Precision Calculator Team
 * @version 1.1.0
 */

/**
 * 语言包定义
 */
const LOCALES = {
  'zh-CN': {
    name: '简体中文',
    messages: {
      // 错误消息
      errors: {
        divisionByZero: '除数不能为零',
        invalidInput: '输入参数无效: {0}',
        numberRange: '数值超出有效范围: {0}',
        precisionError: '精度计算错误: {0}',
        expressionParse: '表达式解析失败: {0}',
        mathOperation: '数学运算错误: {0}',
        overflow: '数值溢出: {0}',
        underflow: '数值下溢: {0}',
        invalidPrecision: '精度值必须是非负整数',
        invalidExpression: '表达式格式不正确',
        unsupportedOperation: '不支持的运算操作: {0}',
        configurationError: '配置错误: {0}'
      },
      
      // 验证消息
      validation: {
        required: '此字段为必填项',
        mustBeNumber: '必须是有效数字',
        mustBeInteger: '必须是整数',
        mustBePositive: '必须是正数',
        mustBeNonNegative: '必须是非负数',
        tooLarge: '数值过大',
        tooSmall: '数值过小',
        invalidFormat: '格式不正确',
        invalidLength: '长度不符合要求'
      },
      
      // 操作消息
      operations: {
        add: '加法',
        subtract: '减法',
        multiply: '乘法',
        divide: '除法',
        power: '幂运算',
        sqrt: '平方根',
        factorial: '阶乘',
        sin: '正弦',
        cos: '余弦',
        tan: '正切',
        log: '对数',
        exp: '指数',
        abs: '绝对值',
        round: '四舍五入',
        ceil: '向上取整',
        floor: '向下取整'
      },
      
      // 格式化
      formatting: {
        currency: '货币',
        percentage: '百分比',
        scientific: '科学计数法',
        decimal: '小数',
        fraction: '分数'
      },
      
      // 单位
      units: {
        length: {
          mm: '毫米',
          cm: '厘米',
          m: '米',
          km: '千米',
          inch: '英寸',
          ft: '英尺',
          yard: '码',
          mile: '英里'
        },
        weight: {
          mg: '毫克',
          g: '克',
          kg: '千克',
          ton: '吨',
          oz: '盎司',
          lb: '磅'
        },
        time: {
          ms: '毫秒',
          s: '秒',
          min: '分钟',
          h: '小时',
          day: '天',
          week: '周',
          month: '月',
          year: '年'
        }
      },
      
      // 日志消息
      logging: {
        operationStarted: '操作开始: {0}',
        operationCompleted: '操作完成: {0}',
        operationFailed: '操作失败: {0}',
        performanceWarning: '性能警告: 操作耗时 {0}ms',
        cacheHit: '缓存命中: {0}',
        cacheMiss: '缓存未命中: {0}'
      }
    },
    
    // 数字格式化
    numberFormat: {
      decimal: '.',
      thousands: ',',
      grouping: [3],
      currency: {
        symbol: '¥',
        position: 'before'
      },
      percentage: {
        symbol: '%',
        position: 'after'
      }
    },
    
    // 日期时间格式
    dateTimeFormat: {
      date: 'YYYY年MM月DD日',
      time: 'HH:mm:ss',
      dateTime: 'YYYY年MM月DD日 HH:mm:ss',
      shortDate: 'MM/DD',
      longDate: 'YYYY年MM月DD日 dddd'
    }
  },
  
  'en-US': {
    name: 'English (US)',
    messages: {
      errors: {
        divisionByZero: 'Division by zero is not allowed',
        invalidInput: 'Invalid input parameter: {0}',
        numberRange: 'Number out of valid range: {0}',
        precisionError: 'Precision calculation error: {0}',
        expressionParse: 'Expression parsing failed: {0}',
        mathOperation: 'Math operation error: {0}',
        overflow: 'Number overflow: {0}',
        underflow: 'Number underflow: {0}',
        invalidPrecision: 'Precision must be a non-negative integer',
        invalidExpression: 'Invalid expression format',
        unsupportedOperation: 'Unsupported operation: {0}',
        configurationError: 'Configuration error: {0}'
      },
      
      validation: {
        required: 'This field is required',
        mustBeNumber: 'Must be a valid number',
        mustBeInteger: 'Must be an integer',
        mustBePositive: 'Must be positive',
        mustBeNonNegative: 'Must be non-negative',
        tooLarge: 'Number too large',
        tooSmall: 'Number too small',
        invalidFormat: 'Invalid format',
        invalidLength: 'Invalid length'
      },
      
      operations: {
        add: 'Addition',
        subtract: 'Subtraction',
        multiply: 'Multiplication',
        divide: 'Division',
        power: 'Power',
        sqrt: 'Square Root',
        factorial: 'Factorial',
        sin: 'Sine',
        cos: 'Cosine',
        tan: 'Tangent',
        log: 'Logarithm',
        exp: 'Exponential',
        abs: 'Absolute Value',
        round: 'Round',
        ceil: 'Ceiling',
        floor: 'Floor'
      },
      
      formatting: {
        currency: 'Currency',
        percentage: 'Percentage',
        scientific: 'Scientific Notation',
        decimal: 'Decimal',
        fraction: 'Fraction'
      },
      
      units: {
        length: {
          mm: 'Millimeter',
          cm: 'Centimeter',
          m: 'Meter',
          km: 'Kilometer',
          inch: 'Inch',
          ft: 'Foot',
          yard: 'Yard',
          mile: 'Mile'
        },
        weight: {
          mg: 'Milligram',
          g: 'Gram',
          kg: 'Kilogram',
          ton: 'Ton',
          oz: 'Ounce',
          lb: 'Pound'
        },
        time: {
          ms: 'Millisecond',
          s: 'Second',
          min: 'Minute',
          h: 'Hour',
          day: 'Day',
          week: 'Week',
          month: 'Month',
          year: 'Year'
        }
      },
      
      logging: {
        operationStarted: 'Operation started: {0}',
        operationCompleted: 'Operation completed: {0}',
        operationFailed: 'Operation failed: {0}',
        performanceWarning: 'Performance warning: Operation took {0}ms',
        cacheHit: 'Cache hit: {0}',
        cacheMiss: 'Cache miss: {0}'
      }
    },
    
    numberFormat: {
      decimal: '.',
      thousands: ',',
      grouping: [3],
      currency: {
        symbol: '$',
        position: 'before'
      },
      percentage: {
        symbol: '%',
        position: 'after'
      }
    },
    
    dateTimeFormat: {
      date: 'MM/DD/YYYY',
      time: 'HH:mm:ss',
      dateTime: 'MM/DD/YYYY HH:mm:ss',
      shortDate: 'MM/DD',
      longDate: 'dddd, MMMM DD, YYYY'
    }
  },
  
  'ja-JP': {
    name: '日本語',
    messages: {
      errors: {
        divisionByZero: 'ゼロで割ることはできません',
        invalidInput: '無効な入力パラメータ: {0}',
        numberRange: '数値が有効範囲外です: {0}',
        precisionError: '精度計算エラー: {0}',
        expressionParse: '式の解析に失敗しました: {0}',
        mathOperation: '数学演算エラー: {0}',
        overflow: '数値オーバーフロー: {0}',
        underflow: '数値アンダーフロー: {0}',
        invalidPrecision: '精度は非負の整数である必要があります',
        invalidExpression: '式の形式が正しくありません',
        unsupportedOperation: 'サポートされていない操作: {0}',
        configurationError: '設定エラー: {0}'
      },
      
      validation: {
        required: 'このフィールドは必須です',
        mustBeNumber: '有効な数値である必要があります',
        mustBeInteger: '整数である必要があります',
        mustBePositive: '正の数である必要があります',
        mustBeNonNegative: '非負の数である必要があります',
        tooLarge: '数値が大きすぎます',
        tooSmall: '数値が小さすぎます',
        invalidFormat: '形式が正しくありません',
        invalidLength: '長さが正しくありません'
      },
      
      operations: {
        add: '加算',
        subtract: '減算',
        multiply: '乗算',
        divide: '除算',
        power: 'べき乗',
        sqrt: '平方根',
        factorial: '階乗',
        sin: 'サイン',
        cos: 'コサイン',
        tan: 'タンジェント',
        log: '対数',
        exp: '指数',
        abs: '絶対値',
        round: '四捨五入',
        ceil: '切り上げ',
        floor: '切り下げ'
      },
      
      formatting: {
        currency: '通貨',
        percentage: 'パーセンテージ',
        scientific: '科学記数法',
        decimal: '小数',
        fraction: '分数'
      },
      
      units: {
        length: {
          mm: 'ミリメートル',
          cm: 'センチメートル',
          m: 'メートル',
          km: 'キロメートル',
          inch: 'インチ',
          ft: 'フィート',
          yard: 'ヤード',
          mile: 'マイル'
        },
        weight: {
          mg: 'ミリグラム',
          g: 'グラム',
          kg: 'キログラム',
          ton: 'トン',
          oz: 'オンス',
          lb: 'ポンド'
        },
        time: {
          ms: 'ミリ秒',
          s: '秒',
          min: '分',
          h: '時間',
          day: '日',
          week: '週',
          month: '月',
          year: '年'
        }
      },
      
      logging: {
        operationStarted: '操作開始: {0}',
        operationCompleted: '操作完了: {0}',
        operationFailed: '操作失敗: {0}',
        performanceWarning: 'パフォーマンス警告: 操作に{0}ms要しました',
        cacheHit: 'キャッシュヒット: {0}',
        cacheMiss: 'キャッシュミス: {0}'
      }
    },
    
    numberFormat: {
      decimal: '.',
      thousands: ',',
      grouping: [3],
      currency: {
        symbol: '¥',
        position: 'before'
      },
      percentage: {
        symbol: '%',
        position: 'after'
      }
    },
    
    dateTimeFormat: {
      date: 'YYYY年MM月DD日',
      time: 'HH:mm:ss',
      dateTime: 'YYYY年MM月DD日 HH:mm:ss',
      shortDate: 'MM/DD',
      longDate: 'YYYY年MM月DD日 dddd'
    }
  }
};

/**
 * 国际化管理器
 */
class I18nManager {
  constructor(locale = 'zh-CN', fallbackLocale = 'en-US') {
    this.currentLocale = locale;
    this.fallbackLocale = fallbackLocale;
    this.customMessages = {};
    this.formatters = new Map();
    
    // 初始化格式化器
    this.initializeFormatters();
  }

  /**
   * 初始化格式化器
   */
  initializeFormatters() {
    // 数字格式化器
    this.formatters.set('number', (value, options = {}) => {
      const format = this.getNumberFormat();
      const precision = options.precision || 0;
      
      let result = Number(value).toFixed(precision);
      
      if (options.thousands !== false) {
        const parts = result.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
        result = parts.join(format.decimal);
      }
      
      return result;
    });
    
    // 货币格式化器
    this.formatters.set('currency', (value, options = {}) => {
      const format = this.getNumberFormat();
      const currency = format.currency;
      const precision = options.precision || 2;
      
      const number = this.formatters.get('number')(value, { precision, thousands: true });
      
      return currency.position === 'before' 
        ? `${currency.symbol}${number}`
        : `${number}${currency.symbol}`;
    });
    
    // 百分比格式化器
    this.formatters.set('percentage', (value, options = {}) => {
      const format = this.getNumberFormat();
      const percentage = format.percentage;
      const precision = options.precision || 2;
      
      const number = this.formatters.get('number')(value * 100, { precision });
      
      return percentage.position === 'before'
        ? `${percentage.symbol}${number}`
        : `${number}${percentage.symbol}`;
    });
    
    // 日期格式化器
    this.formatters.set('date', (value, format) => {
      const dateFormat = this.getDateTimeFormat();
      const targetFormat = format || dateFormat.date;
      
      // 简单的日期格式化实现
      const date = new Date(value);
      return this.formatDate(date, targetFormat);
    });
  }

  /**
   * 设置当前语言
   * @param {string} locale - 语言代码
   */
  setLocale(locale) {
    if (LOCALES[locale]) {
      this.currentLocale = locale;
    } else {
      console.warn(`不支持的语言: ${locale}，使用默认语言`);
    }
  }

  /**
   * 获取当前语言
   * @returns {string} 当前语言代码
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * 获取支持的语言列表
   * @returns {Array} 支持的语言列表
   */
  getSupportedLocales() {
    return Object.keys(LOCALES).map(code => ({
      code,
      name: LOCALES[code].name
    }));
  }

  /**
   * 获取消息
   * @param {string} key - 消息键
   * @param {Array} params - 参数数组
   * @param {string} locale - 指定语言
   * @returns {string} 本地化消息
   */
  getMessage(key, params = [], locale = null) {
    const targetLocale = locale || this.currentLocale;
    let message = this.getMessageByPath(key, targetLocale);
    
    // 如果找不到消息，尝试备用语言
    if (!message && targetLocale !== this.fallbackLocale) {
      message = this.getMessageByPath(key, this.fallbackLocale);
    }
    
    // 如果还是找不到，检查自定义消息
    if (!message) {
      message = this.customMessages[key];
    }
    
    // 如果仍然找不到，返回键名
    if (!message) {
      console.warn(`未找到消息: ${key}`);
      return key;
    }
    
    // 参数替换
    return this.formatMessage(message, params);
  }

  /**
   * 通过路径获取消息
   * @param {string} path - 消息路径
   * @param {string} locale - 语言代码
   * @returns {string} 消息
   */
  getMessageByPath(path, locale) {
    const localeData = LOCALES[locale];
    if (!localeData) return null;
    
    const keys = path.split('.');
    let current = localeData.messages;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    
    return typeof current === 'string' ? current : null;
  }

  /**
   * 格式化消息（参数替换）
   * @param {string} message - 消息模板
   * @param {Array} params - 参数数组
   * @returns {string} 格式化后的消息
   */
  formatMessage(message, params) {
    if (!params || params.length === 0) {
      return message;
    }
    
    return message.replace(/\{(\d+)\}/g, (match, index) => {
      const paramIndex = parseInt(index, 10);
      return paramIndex < params.length ? String(params[paramIndex]) : match;
    });
  }

  /**
   * 添加自定义消息
   * @param {string} key - 消息键
   * @param {string} message - 消息内容
   */
  addCustomMessage(key, message) {
    this.customMessages[key] = message;
  }

  /**
   * 批量添加自定义消息
   * @param {Object} messages - 消息对象
   */
  addCustomMessages(messages) {
    Object.assign(this.customMessages, messages);
  }

  /**
   * 获取错误消息
   * @param {string} errorType - 错误类型
   * @param {Array} params - 参数
   * @returns {string} 错误消息
   */
  getErrorMessage(errorType, params = []) {
    return this.getMessage(`errors.${errorType}`, params);
  }

  /**
   * 获取验证消息
   * @param {string} validationType - 验证类型
   * @param {Array} params - 参数
   * @returns {string} 验证消息
   */
  getValidationMessage(validationType, params = []) {
    return this.getMessage(`validation.${validationType}`, params);
  }

  /**
   * 获取操作名称
   * @param {string} operation - 操作类型
   * @returns {string} 操作名称
   */
  getOperationName(operation) {
    return this.getMessage(`operations.${operation}`);
  }

  /**
   * 获取单位名称
   * @param {string} category - 单位类别
   * @param {string} unit - 单位代码
   * @returns {string} 单位名称
   */
  getUnitName(category, unit) {
    return this.getMessage(`units.${category}.${unit}`);
  }

  /**
   * 获取数字格式配置
   * @returns {Object} 数字格式配置
   */
  getNumberFormat() {
    const localeData = LOCALES[this.currentLocale];
    return localeData ? localeData.numberFormat : LOCALES[this.fallbackLocale].numberFormat;
  }

  /**
   * 获取日期时间格式配置
   * @returns {Object} 日期时间格式配置
   */
  getDateTimeFormat() {
    const localeData = LOCALES[this.currentLocale];
    return localeData ? localeData.dateTimeFormat : LOCALES[this.fallbackLocale].dateTimeFormat;
  }

  /**
   * 格式化数字
   * @param {number} value - 数值
   * @param {Object} options - 格式化选项
   * @returns {string} 格式化后的数字
   */
  formatNumber(value, options = {}) {
    const formatter = this.formatters.get('number');
    return formatter ? formatter(value, options) : String(value);
  }

  /**
   * 格式化货币
   * @param {number} value - 数值
   * @param {Object} options - 格式化选项
   * @returns {string} 格式化后的货币
   */
  formatCurrency(value, options = {}) {
    const formatter = this.formatters.get('currency');
    return formatter ? formatter(value, options) : String(value);
  }

  /**
   * 格式化百分比
   * @param {number} value - 数值（0-1之间）
   * @param {Object} options - 格式化选项
   * @returns {string} 格式化后的百分比
   */
  formatPercentage(value, options = {}) {
    const formatter = this.formatters.get('percentage');
    return formatter ? formatter(value, options) : String(value);
  }

  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @param {string} format - 格式字符串
   * @returns {string} 格式化后的日期
   */
  formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return format
      .replace(/YYYY/g, year)
      .replace(/MM/g, month)
      .replace(/DD/g, day)
      .replace(/HH/g, hour)
      .replace(/mm/g, minute)
      .replace(/ss/g, second);
  }

  /**
   * 检测浏览器语言
   * @returns {string} 检测到的语言代码
   */
  detectBrowserLanguage() {
    if (typeof navigator !== 'undefined') {
      const language = navigator.language || navigator.userLanguage;
      const supportedLocales = Object.keys(LOCALES);
      
      // 精确匹配
      if (supportedLocales.includes(language)) {
        return language;
      }
      
      // 语言代码匹配（如 zh-CN -> zh）
      const languageCode = language.split('-')[0];
      const match = supportedLocales.find(locale => locale.startsWith(languageCode));
      
      return match || this.fallbackLocale;
    }
    
    return this.fallbackLocale;
  }

  /**
   * 自动设置语言（基于浏览器检测）
   */
  autoSetLocale() {
    const detectedLanguage = this.detectBrowserLanguage();
    this.setLocale(detectedLanguage);
  }
}

// 创建全局国际化管理器实例
const globalI18n = new I18nManager();

// 便捷函数
const t = (key, params, locale) => globalI18n.getMessage(key, params, locale);
const tError = (errorType, params) => globalI18n.getErrorMessage(errorType, params);
const tValidation = (validationType, params) => globalI18n.getValidationMessage(validationType, params);

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    I18nManager,
    LOCALES,
    globalI18n,
    t,
    tError,
    tValidation
  };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculatorI18n = {
    I18nManager,
    LOCALES,
    globalI18n,
    t,
    tError,
    tValidation
  };
}