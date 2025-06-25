/**
 * 日志和监控模块
 * @author Precision Calculator Team
 * @version 1.1.0
 */

/**
 * 日志级别枚举
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

/**
 * 日志级别名称映射
 */
const LogLevelNames = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL'
};

/**
 * 计算器日志器
 */
class CalculatorLogger {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.level = options.level || LogLevel.INFO;
    this.maxLogs = options.maxLogs || 1000;
    this.logs = [];
    this.listeners = [];
    this.sessionId = this.generateSessionId();
  }

  /**
   * 生成会话ID
   * @returns {string} 会话ID
   */
  generateSessionId() {
    return 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 记录日志
   * @param {number} level - 日志级别
   * @param {string} message - 日志消息
   * @param {Object} data - 附加数据
   */
  log(level, message, data = {}) {
    if (!this.enabled || level < this.level) {
      return;
    }

    const logEntry = {
      id: this.generateLogId(),
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      level: level,
      levelName: LogLevelNames[level],
      message: message,
      data: data,
      stack: level >= LogLevel.ERROR ? new Error().stack : null
    };

    // 添加到日志数组
    this.logs.push(logEntry);

    // 保持日志数量限制
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 通知监听器
    this.notifyListeners(logEntry);

    // 输出到控制台
    this.outputToConsole(logEntry);
  }

  /**
   * 生成日志ID
   * @returns {string} 日志ID
   */
  generateLogId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  /**
   * 输出到控制台
   * @param {Object} logEntry - 日志条目
   */
  outputToConsole(logEntry) {
    const { levelName, timestamp, message, data } = logEntry;
    const timeStr = new Date(timestamp).toLocaleTimeString();
    const prefix = `[${levelName}] ${timeStr}`;

    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, message, data);
        if (logEntry.stack) {
          console.error('Stack trace:', logEntry.stack);
        }
        break;
    }
  }

  /**
   * 通知监听器
   * @param {Object} logEntry - 日志条目
   */
  notifyListeners(logEntry) {
    this.listeners.forEach(listener => {
      try {
        listener(logEntry);
      } catch (error) {
        console.error('日志监听器错误:', error);
      }
    });
  }

  /**
   * 调试日志
   * @param {string} message - 消息
   * @param {Object} data - 数据
   */
  debug(message, data = {}) {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * 信息日志
   * @param {string} message - 消息
   * @param {Object} data - 数据
   */
  info(message, data = {}) {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * 警告日志
   * @param {string} message - 消息
   * @param {Object} data - 数据
   */
  warn(message, data = {}) {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * 错误日志
   * @param {string} message - 消息
   * @param {Object} data - 数据
   */
  error(message, data = {}) {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * 致命错误日志
   * @param {string} message - 消息
   * @param {Object} data - 数据
   */
  fatal(message, data = {}) {
    this.log(LogLevel.FATAL, message, data);
  }

  /**
   * 记录操作日志
   * @param {string} operation - 操作名称
   * @param {Array} inputs - 输入参数
   * @param {*} result - 结果
   * @param {number} duration - 执行时间（毫秒）
   * @param {Object} metadata - 元数据
   */
  logOperation(operation, inputs, result, duration, metadata = {}) {
    this.info('计算操作', {
      operation,
      inputs,
      result,
      duration: `${duration.toFixed(4)}ms`,
      metadata,
      type: 'operation'
    });
  }

  /**
   * 记录性能指标
   * @param {string} metric - 指标名称
   * @param {number} value - 指标值
   * @param {string} unit - 单位
   * @param {Object} tags - 标签
   */
  logMetric(metric, value, unit = '', tags = {}) {
    this.debug('性能指标', {
      metric,
      value,
      unit,
      tags,
      type: 'metric'
    });
  }

  /**
   * 记录错误
   * @param {Error} error - 错误对象
   * @param {Object} context - 上下文信息
   */
  logError(error, context = {}) {
    this.error('计算错误', {
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorStack: error.stack,
      context,
      type: 'error'
    });
  }

  /**
   * 添加日志监听器
   * @param {Function} listener - 监听器函数
   */
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  /**
   * 移除日志监听器
   * @param {Function} listener - 监听器函数
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 获取日志
   * @param {Object} filter - 过滤条件
   * @returns {Array} 日志数组
   */
  getLogs(filter = {}) {
    let filteredLogs = [...this.logs];

    if (filter.level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= filter.level);
    }

    if (filter.startTime) {
      const startTime = new Date(filter.startTime).getTime();
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp).getTime() >= startTime
      );
    }

    if (filter.endTime) {
      const endTime = new Date(filter.endTime).getTime();
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp).getTime() <= endTime
      );
    }

    if (filter.type) {
      filteredLogs = filteredLogs.filter(log => 
        log.data.type === filter.type
      );
    }

    if (filter.operation) {
      filteredLogs = filteredLogs.filter(log => 
        log.data.operation === filter.operation
      );
    }

    return filteredLogs;
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const stats = {
      totalLogs: this.logs.length,
      sessionId: this.sessionId,
      levels: {},
      types: {},
      operations: {},
      timeRange: null
    };

    // 统计各级别日志数量
    Object.values(LogLevel).forEach(level => {
      stats.levels[LogLevelNames[level]] = 0;
    });

    // 统计各类型日志数量
    this.logs.forEach(log => {
      stats.levels[log.levelName]++;
      
      if (log.data.type) {
        stats.types[log.data.type] = (stats.types[log.data.type] || 0) + 1;
      }
      
      if (log.data.operation) {
        stats.operations[log.data.operation] = (stats.operations[log.data.operation] || 0) + 1;
      }
    });

    // 时间范围
    if (this.logs.length > 0) {
      stats.timeRange = {
        start: this.logs[0].timestamp,
        end: this.logs[this.logs.length - 1].timestamp
      };
    }

    return stats;
  }

  /**
   * 导出日志
   * @param {string} format - 导出格式 ('json' | 'csv' | 'txt')
   * @param {Object} filter - 过滤条件
   * @returns {string} 导出的日志数据
   */
  exportLogs(format = 'json', filter = {}) {
    const logs = this.getLogs(filter);

    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(logs, null, 2);
      
      case 'csv':
        if (logs.length === 0) return '';
        
        const headers = ['timestamp', 'level', 'message', 'operation', 'duration'];
        const csvRows = [headers.join(',')];
        
        logs.forEach(log => {
          const row = [
            log.timestamp,
            log.levelName,
            `"${log.message}"`,
            log.data.operation || '',
            log.data.duration || ''
          ];
          csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
      
      case 'txt':
        return logs.map(log => {
          const time = new Date(log.timestamp).toLocaleString();
          return `[${log.levelName}] ${time} - ${log.message}`;
        }).join('\n');
      
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  /**
   * 清空日志
   */
  clear() {
    this.logs = [];
  }

  /**
   * 设置日志级别
   * @param {number} level - 日志级别
   */
  setLevel(level) {
    this.level = level;
  }

  /**
   * 启用/禁用日志
   * @param {boolean} enabled - 是否启用
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

/**
 * 操作装饰器 - 自动记录函数调用
 */
function logOperation(logger, operationName) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
      const startTime = performance.now();
      
      try {
        const result = originalMethod.apply(this, args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        logger.logOperation(operationName || propertyKey, args, result, duration);
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        logger.logError(error, {
          operation: operationName || propertyKey,
          inputs: args,
          duration
        });
        
        throw error;
      }
    };
    
    return descriptor;
  };
}

// 创建全局日志器实例
const globalLogger = new CalculatorLogger({
  enabled: true,
  level: LogLevel.INFO
});

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CalculatorLogger,
    LogLevel,
    LogLevelNames,
    logOperation,
    globalLogger
  };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculatorLogger = {
    CalculatorLogger,
    LogLevel,
    LogLevelNames,
    logOperation,
    globalLogger
  };
}