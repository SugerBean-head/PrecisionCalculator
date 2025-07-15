/**
 * 共享的配置管理模块
 * 提供全局配置和实例配置的管理功能
 * 供mathfix.js和mathfix.mjs共同使用
 */

// 尝试导入错误模块
let ConfigurationError;
try {
  const errors = require('../errors/index');
  ConfigurationError = errors.ConfigurationError;
} catch (error) {
  // 如果错误模块不可用，使用基础Error类
  ConfigurationError = Error;
}

/**
 * 默认配置
 * @type {object}
 */
const DEFAULT_CONFIG = {
  precision: {
    default: 10,
    max: 20,
    min: 0
  },
  performance: {
    cacheEnabled: true,
    cacheSize: 1000,
    memoize: true
  },
  logging: {
    enabled: false,
    level: 'info',
    format: 'simple'
  },
  errors: {
    throwOnInvalidInput: true,
    throwOnDivisionByZero: true,
    returnValueOnError: null
  },
  i18n: {
    locale: 'zh-CN',
    fallbackLocale: 'en-US'
  }
};

/**
 * 全局配置对象
 * @type {object}
 */
let globalConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

/**
 * 验证配置对象
 * @param {object} config - 要验证的配置对象
 * @param {string} [path=''] - 当前配置路径
 * @returns {boolean} 配置是否有效
 * @throws {ConfigurationError} 当配置无效时抛出错误
 * @private
 */
function _validateConfig(config, path = '') {
  if (!config || typeof config !== 'object') {
    throw new ConfigurationError('配置必须是对象', { path, value: config });
  }
  
  // 验证精度配置
  if (path === '' || path === 'precision') {
    const precision = path === '' ? config.precision : config;
    if (precision) {
      if (precision.default !== undefined && (typeof precision.default !== 'number' || precision.default < 0)) {
        throw new ConfigurationError('默认精度必须是非负数', { path: `${path}.default`, value: precision.default });
      }
      if (precision.max !== undefined && (typeof precision.max !== 'number' || precision.max < 0)) {
        throw new ConfigurationError('最大精度必须是非负数', { path: `${path}.max`, value: precision.max });
      }
      if (precision.min !== undefined && (typeof precision.min !== 'number' || precision.min < 0)) {
        throw new ConfigurationError('最小精度必须是非负数', { path: `${path}.min`, value: precision.min });
      }
    }
  }
  
  return true;
}

/**
 * 深度合并两个对象
 * @param {object} target - 目标对象
 * @param {object} source - 源对象
 * @returns {object} 合并后的对象
 * @private
 */
function _deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        result[key] = _deepMerge(target[key], source[key]);
      } else {
        result[key] = { ...source[key] };
      }
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * 设置全局配置
 * @param {object} config - 配置对象
 * @param {boolean} [merge=true] - 是否合并配置，false表示替换整个配置
 * @returns {boolean} 设置是否成功
 * @throws {ConfigurationError} 当配置无效时抛出错误
 */
function setConfig(config, merge = true) {
  try {
    if (!config || typeof config !== 'object') {
      throw new ConfigurationError('配置必须是对象', { value: config });
    }
    
    // 验证配置
    _validateConfig(config);
    
    // 更新配置
    if (merge) {
      globalConfig = _deepMerge(globalConfig, config);
    } else {
      // 完全替换配置，但确保包含所有必要的字段
      const newConfig = _deepMerge(DEFAULT_CONFIG, config);
      globalConfig = newConfig;
    }
    
    return true;
  } catch (error) {
    if (error instanceof ConfigurationError) {
      throw error;
    } else {
      throw new ConfigurationError('设置配置失败', { error: error.message });
    }
  }
}

/**
 * 获取全局配置
 * @param {string} [path] - 配置路径，如 'precision.default'
 * @param {*} [defaultValue] - 默认值
 * @returns {*} 配置值
 */
function getConfig(path, defaultValue) {
  if (!path) return globalConfig;
  
  const keys = path.split('.');
  let current = globalConfig;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * 重置配置为默认值
 * @returns {boolean} 是否成功重置
 */
function resetConfig() {
  globalConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  return true;
}

/**
 * 获取全局配置对象的引用
 * @returns {object} 全局配置对象
 */
function getGlobalConfigRef() {
  return globalConfig;
}

/**
 * 创建实例配置
 * @param {object} [instanceConfig={}] - 实例配置
 * @returns {object} 配置管理器
 */
function createInstanceConfig(instanceConfig = {}) {
  let config = _deepMerge(globalConfig, instanceConfig);
  
  return {
    /**
     * 设置实例配置
     * @param {object} newConfig - 新配置
     * @param {boolean} [merge=true] - 是否合并配置
     * @returns {boolean} 设置是否成功
     */
    setConfig: function(newConfig, merge = true) {
      try {
        _validateConfig(newConfig);
        
        if (merge) {
          config = _deepMerge(config, newConfig);
        } else {
          // 完全替换配置，但基于全局配置
          config = _deepMerge(globalConfig, newConfig);
        }
        
        return true;
      } catch (error) {
        if (error instanceof ConfigurationError) {
          throw error;
        } else {
          throw new ConfigurationError('设置实例配置失败', { error: error.message });
        }
      }
    },
    
    /**
     * 获取实例配置
     * @param {string} [path] - 配置路径
     * @param {*} [defaultValue] - 默认值
     * @returns {*} 配置值
     */
    getConfig: function(path, defaultValue) {
      if (!path) return config;
      
      const keys = path.split('.');
      let current = config;
      
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return defaultValue;
        }
      }
      
      return current !== undefined ? current : defaultValue;
    },
    
    /**
     * 重置实例配置为全局配置
     * @returns {boolean} 是否成功重置
     */
    resetConfig: function() {
      config = JSON.parse(JSON.stringify(globalConfig));
      return true;
    },
    
    /**
     * 获取实例配置对象的引用
     * @returns {object} 实例配置对象
     */
    getConfigRef: function() {
      return config;
    }
  };
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setConfig,
    getConfig,
    resetConfig,
    getGlobalConfigRef,
    createInstanceConfig,
    // 为了兼容性，也导出带Global前缀的函数名
    setGlobalConfig: setConfig,
    getGlobalConfig: getConfig
  };
} else if (typeof window !== 'undefined') {
  window.ConfigManager = {
    setConfig,
    getConfig,
    resetConfig,
    getGlobalConfigRef,
    createInstanceConfig,
    setGlobalConfig: setConfig,
    getGlobalConfig: getConfig
  };
}

// ES Module 导出
if (typeof exports !== 'undefined') {
  exports.setConfig = setConfig;
  exports.getConfig = getConfig;
  exports.resetConfig = resetConfig;
  exports.getGlobalConfigRef = getGlobalConfigRef;
  exports.createInstanceConfig = createInstanceConfig;
  exports.setGlobalConfig = setConfig;
  exports.getGlobalConfig = getConfig;
}