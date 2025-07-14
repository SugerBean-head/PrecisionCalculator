/**
 * 共享的配置管理模块
 * 提供全局配置的设置和获取功能
 * 供mathfix.js和mathfix.mjs共同使用
 */

/**
 * 全局配置对象
 */
let globalConfig = {
  precision: {
    default: 10
  },
  performance: {
    cacheEnabled: false
  },
  logging: {
    enabled: false
  }
};

/**
 * 设置全局配置
 * @param {object} config - 配置对象
 * @param {object} [config.precision] - 精度配置
 * @param {number} [config.precision.default] - 默认精度
 * @returns {boolean} 设置是否成功
 */
function setConfig(config) {
  if (config && typeof config === 'object') {
    globalConfig = { ...globalConfig, ...config };
    return true;
  }
  return false;
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
 */
function resetConfig() {
  globalConfig = {
    precision: {
      default: 10
    },
    performance: {
      cacheEnabled: false
    },
    logging: {
      enabled: false
    }
  };
}

/**
 * 获取全局配置对象的引用
 * @returns {object} 全局配置对象
 */
function getGlobalConfigRef() {
  return globalConfig;
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS 环境
  module.exports = {
    setConfig,
    getConfig,
    resetConfig,
    getGlobalConfigRef,
    // 为了兼容性，也导出带Global前缀的函数名
    setGlobalConfig: setConfig,
    getGlobalConfig: getConfig
  };
} else {
  // ES Module 环境或浏览器环境
  if (typeof window !== 'undefined') {
    window.ConfigManager = {
      setConfig,
      getConfig,
      resetConfig,
      getGlobalConfigRef
    };
  }
}

// ES Module 导出（如果支持）
if (typeof exports !== 'undefined') {
  exports.setConfig = setConfig;
  exports.getConfig = getConfig;
  exports.resetConfig = resetConfig;
  exports.getGlobalConfigRef = getGlobalConfigRef;
  // 为了兼容性，也导出带Global前缀的函数名
  exports.setGlobalConfig = setConfig;
  exports.getGlobalConfig = getConfig;
}