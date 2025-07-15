/**
 * 计算器工厂模块
 * 统一管理计算器实例的创建
 */

// 尝试导入模块加载器
let loadModule;
try {
  const moduleLoader = require('../utils/module-loader');
  loadModule = moduleLoader.loadModule;
} catch (error) {
  // 如果模块加载器不可用，使用内联实现
  loadModule = function(path, fallback) {
    try {
      return require(path);
    } catch (error) {
      console.warn(`模块 ${path} 未找到，使用后备实现`);
      return fallback;
    }
  };
}

// 导入基础计算器类
const { PrecisionCalculator: BasicCalculator } = loadModule('../shared/core-calculator', {
  PrecisionCalculator: null
});

// 尝试导入增强计算器类
const { PrecisionCalculator: EnhancedCalculator } = loadModule('../core/calculator', {
  PrecisionCalculator: null
});

/**
 * 计算器工厂类
 * 负责创建和管理计算器实例
 */
class CalculatorFactory {
  /**
   * 创建基础计算器实例
   * @param {object} [options={}] - 配置选项
   * @returns {BasicCalculator} 基础计算器实例
   */
  static createBasicCalculator(options = {}) {
    if (!BasicCalculator) {
      throw new Error('基础计算器模块未找到');
    }
    return new BasicCalculator(options);
  }
  
  /**
   * 创建增强计算器实例
   * @param {object} [options={}] - 配置选项
   * @returns {EnhancedCalculator} 增强计算器实例
   */
  static createEnhancedCalculator(options = {}) {
    if (!EnhancedCalculator) {
      throw new Error('增强计算器模块未找到，请确保src/core/calculator.js存在');
    }
    return new EnhancedCalculator(options);
  }
  
  /**
   * 根据选项创建适当的计算器实例
   * @param {object} [options={}] - 配置选项
   * @param {boolean} [options.enhanced=false] - 是否使用增强模式
   * @returns {BasicCalculator|EnhancedCalculator} 计算器实例
   */
  static createCalculator(options = {}) {
    return options.enhanced ? 
      this.createEnhancedCalculator(options) : 
      this.createBasicCalculator(options);
  }
}

// 导出工厂类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CalculatorFactory
  };
} else if (typeof window !== 'undefined') {
  window.CalculatorFactory = CalculatorFactory;
}

// ES Module 导出
if (typeof exports !== 'undefined') {
  exports.CalculatorFactory = CalculatorFactory;
}