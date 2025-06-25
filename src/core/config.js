/**
 * 配置管理模块
 * @author Precision Calculator Team
 * @version 1.1.0
 */

/**
 * 舍入模式枚举
 */
const RoundingMode = {
  ROUND_UP: 'ROUND_UP',                    // 向上舍入
  ROUND_DOWN: 'ROUND_DOWN',                // 向下舍入
  ROUND_CEIL: 'ROUND_CEIL',                // 向正无穷舍入
  ROUND_FLOOR: 'ROUND_FLOOR',              // 向负无穷舍入
  ROUND_HALF_UP: 'ROUND_HALF_UP',          // 四舍五入
  ROUND_HALF_DOWN: 'ROUND_HALF_DOWN',      // 五舍六入
  ROUND_HALF_EVEN: 'ROUND_HALF_EVEN',      // 银行家舍入
  ROUND_HALF_CEIL: 'ROUND_HALF_CEIL',      // 半数向正无穷舍入
  ROUND_HALF_FLOOR: 'ROUND_HALF_FLOOR'     // 半数向负无穷舍入
};

/**
 * 错误处理模式枚举
 */
const ErrorHandlingMode = {
  THROW: 'throw',           // 抛出异常
  RETURN_NULL: 'null',      // 返回null
  RETURN_NAN: 'nan',        // 返回NaN
  RETURN_INFINITY: 'inf',   // 返回Infinity
  LOG_AND_THROW: 'log_throw', // 记录日志并抛出异常
  LOG_AND_RETURN: 'log_return' // 记录日志并返回默认值
};

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  // 精度设置
  precision: {
    default: 10,              // 默认精度
    max: 100,                 // 最大精度
    min: 0                    // 最小精度
  },
  
  // 舍入设置
  rounding: {
    mode: RoundingMode.ROUND_HALF_UP,  // 舍入模式
    precision: 10             // 舍入精度
  },
  
  // 错误处理
  errorHandling: {
    mode: ErrorHandlingMode.THROW,     // 错误处理模式
    logErrors: true,          // 是否记录错误日志
    throwOnOverflow: true,    // 溢出时是否抛出异常
    throwOnUnderflow: false   // 下溢时是否抛出异常
  },
  
  // 性能设置
  performance: {
    cacheEnabled: true,       // 是否启用缓存
    cacheSize: 1000,          // 缓存大小
    memoizeFactorial: true,   // 是否记忆化阶乘
    memoizePower: true,       // 是否记忆化幂运算
    benchmarkEnabled: false   // 是否启用性能基准测试
  },
  
  // 日志设置
  logging: {
    enabled: true,            // 是否启用日志
    level: 'INFO',            // 日志级别
    logOperations: false,     // 是否记录操作日志
    logPerformance: false,    // 是否记录性能日志
    maxLogs: 1000            // 最大日志数量
  },
  
  // 格式化设置
  formatting: {
    currency: {
      symbol: '¥',            // 默认货币符号
      precision: 2,           // 货币精度
      thousandsSeparator: ',', // 千位分隔符
      decimalSeparator: '.'   // 小数分隔符
    },
    percentage: {
      precision: 2,           // 百分比精度
      symbol: '%'             // 百分比符号
    },
    scientific: {
      precision: 6,           // 科学计数法精度
      exponentialThreshold: 6 // 指数阈值
    }
  },
  
  // 验证设置
  validation: {
    strictMode: false,        // 严格模式
    allowInfinite: false,     // 是否允许无穷大
    allowNaN: false,          // 是否允许NaN
    maxExpressionLength: 1000, // 表达式最大长度
    maxArrayLength: 10000     // 数组最大长度
  },
  
  // 国际化设置
  i18n: {
    locale: 'zh-CN',          // 默认语言
    fallbackLocale: 'en-US',  // 备用语言
    dateFormat: 'YYYY-MM-DD', // 日期格式
    timeFormat: 'HH:mm:ss'    // 时间格式
  }
};

/**
 * 配置管理器
 */
class ConfigManager {
  constructor(initialConfig = {}) {
    this.config = this.deepMerge(DEFAULT_CONFIG, initialConfig);
    this.listeners = [];
    this.history = [{ ...this.config }];
    this.maxHistorySize = 10;
  }

  /**
   * 深度合并对象
   * @param {Object} target - 目标对象
   * @param {Object} source - 源对象
   * @returns {Object} 合并后的对象
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(source[key]) && this.isObject(target[key])) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * 检查是否为对象
   * @param {*} obj - 要检查的值
   * @returns {boolean} 是否为对象
   */
  isObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  }

  /**
   * 获取配置值
   * @param {string} path - 配置路径，用点分隔
   * @param {*} defaultValue - 默认值
   * @returns {*} 配置值
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let current = this.config;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current;
  }

  /**
   * 设置配置值
   * @param {string} path - 配置路径
   * @param {*} value - 配置值
   * @param {boolean} notify - 是否通知监听器
   */
  set(path, value, notify = true) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.config;
    
    // 导航到目标对象
    for (const key of keys) {
      if (!(key in current) || !this.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const oldValue = current[lastKey];
    current[lastKey] = value;
    
    // 保存到历史记录
    this.saveToHistory();
    
    // 通知监听器
    if (notify) {
      this.notifyListeners(path, value, oldValue);
    }
  }

  /**
   * 批量设置配置
   * @param {Object} config - 配置对象
   * @param {boolean} merge - 是否合并
   */
  setConfig(config, merge = true) {
    if (merge) {
      this.config = this.deepMerge(this.config, config);
    } else {
      this.config = { ...config };
    }
    
    this.saveToHistory();
    this.notifyListeners('*', this.config, null);
  }

  /**
   * 重置配置
   * @param {string} path - 要重置的路径，不提供则重置全部
   */
  reset(path = null) {
    if (path) {
      const defaultValue = this.getDefaultValue(path);
      this.set(path, defaultValue);
    } else {
      this.config = this.deepMerge({}, DEFAULT_CONFIG);
      this.saveToHistory();
      this.notifyListeners('*', this.config, null);
    }
  }

  /**
   * 获取默认值
   * @param {string} path - 配置路径
   * @returns {*} 默认值
   */
  getDefaultValue(path) {
    const keys = path.split('.');
    let current = DEFAULT_CONFIG;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  /**
   * 保存到历史记录
   */
  saveToHistory() {
    this.history.push({ ...this.config });
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * 撤销配置更改
   * @returns {boolean} 是否成功撤销
   */
  undo() {
    if (this.history.length > 1) {
      this.history.pop(); // 移除当前配置
      this.config = { ...this.history[this.history.length - 1] };
      this.notifyListeners('*', this.config, null);
      return true;
    }
    return false;
  }

  /**
   * 添加配置监听器
   * @param {Function} listener - 监听器函数
   */
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  /**
   * 移除配置监听器
   * @param {Function} listener - 监听器函数
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知监听器
   * @param {string} path - 配置路径
   * @param {*} newValue - 新值
   * @param {*} oldValue - 旧值
   */
  notifyListeners(path, newValue, oldValue) {
    this.listeners.forEach(listener => {
      try {
        listener(path, newValue, oldValue, this.config);
      } catch (error) {
        console.error('配置监听器错误:', error);
      }
    });
  }

  /**
   * 验证配置
   * @param {Object} config - 要验证的配置
   * @returns {Object} 验证结果
   */
  validate(config = this.config) {
    const errors = [];
    const warnings = [];
    
    // 验证精度设置
    if (config.precision) {
      if (config.precision.default < 0 || config.precision.default > 100) {
        errors.push('默认精度必须在0-100之间');
      }
      if (config.precision.max < config.precision.min) {
        errors.push('最大精度不能小于最小精度');
      }
    }
    
    // 验证性能设置
    if (config.performance) {
      if (config.performance.cacheSize < 0) {
        errors.push('缓存大小不能为负数');
      }
      if (config.performance.cacheSize > 10000) {
        warnings.push('缓存大小过大可能影响内存使用');
      }
    }
    
    // 验证日志设置
    if (config.logging) {
      const validLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
      if (!validLevels.includes(config.logging.level)) {
        errors.push(`无效的日志级别: ${config.logging.level}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 导出配置
   * @param {string} format - 导出格式 ('json' | 'yaml')
   * @returns {string} 导出的配置
   */
  export(format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(this.config, null, 2);
      case 'yaml':
        // 简单的YAML导出（实际项目中可能需要专门的YAML库）
        return this.toYaml(this.config);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  /**
   * 简单的YAML转换
   * @param {Object} obj - 要转换的对象
   * @param {number} indent - 缩进级别
   * @returns {string} YAML字符串
   */
  toYaml(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (this.isObject(value)) {
        yaml += `${spaces}${key}:\n${this.toYaml(value, indent + 1)}`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          yaml += `${spaces}  - ${item}\n`;
        });
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }

  /**
   * 从JSON导入配置
   * @param {string} jsonString - JSON字符串
   * @param {boolean} merge - 是否合并
   */
  importFromJson(jsonString, merge = true) {
    try {
      const config = JSON.parse(jsonString);
      this.setConfig(config, merge);
    } catch (error) {
      throw new Error(`JSON解析失败: ${error.message}`);
    }
  }

  /**
   * 获取完整配置
   * @returns {Object} 完整配置对象
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * 获取配置摘要
   * @returns {Object} 配置摘要
   */
  getSummary() {
    return {
      precision: this.get('precision.default'),
      roundingMode: this.get('rounding.mode'),
      errorHandling: this.get('errorHandling.mode'),
      cacheEnabled: this.get('performance.cacheEnabled'),
      loggingEnabled: this.get('logging.enabled'),
      locale: this.get('i18n.locale')
    };
  }
}

// 创建全局配置管理器实例
const globalConfig = new ConfigManager();

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ConfigManager,
    RoundingMode,
    ErrorHandlingMode,
    DEFAULT_CONFIG,
    globalConfig
  };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculatorConfig = {
    ConfigManager,
    RoundingMode,
    ErrorHandlingMode,
    DEFAULT_CONFIG,
    globalConfig
  };
}