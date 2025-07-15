/**
 * 模块加载器工具
 * 提供统一的模块加载机制，简化错误处理
 */

/**
 * 加载模块，如果失败则使用后备实现
 * @param {string} path - 模块路径
 * @param {object} fallback - 后备实现
 * @param {boolean} [silent=false] - 是否静默失败（不输出警告）
 * @returns {object} 加载的模块或后备实现
 */
function loadModule(path, fallback, silent = false) {
  try {
    return require(path);
  } catch (error) {
    if (!silent) {
      console.warn(`模块 ${path} 未找到，使用后备实现`);
    }
    return fallback;
  }
}

/**
 * 检测当前运行环境
 * @returns {object} 环境信息
 */
function detectEnvironment() {
  return {
    isNode: typeof module !== 'undefined' && module.exports,
    isBrowser: typeof window !== 'undefined',
    isESModule: typeof exports !== 'undefined' && typeof module === 'undefined'
  };
}

/**
 * 根据环境导出模块
 * @param {object} modules - 要导出的模块
 */
function exportForEnvironment(modules) {
  const env = detectEnvironment();
  
  if (env.isNode) {
    // CommonJS 环境
    module.exports = modules;
  } else if (env.isBrowser) {
    // 浏览器环境
    window.MathFixUtils = modules;
  }
  
  // ES Module 环境
  if (typeof exports !== 'undefined') {
    Object.keys(modules).forEach(key => {
      exports[key] = modules[key];
    });
  }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadModule,
    detectEnvironment,
    exportForEnvironment
  };
} else if (typeof window !== 'undefined') {
  window.ModuleLoader = {
    loadModule,
    detectEnvironment,
    exportForEnvironment
  };
}

// ES Module 导出
if (typeof exports !== 'undefined') {
  exports.loadModule = loadModule;
  exports.detectEnvironment = detectEnvironment;
  exports.exportForEnvironment = exportForEnvironment;
}