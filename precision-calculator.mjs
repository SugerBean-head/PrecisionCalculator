/**
 * ES Module version of Precision Calculator
 * 精度计算工具类 - ES模块版本
 * 支持 import { PrecisionCalculator, calc } from "precision-calculator" 语法
 */

// 导入CommonJS版本的所有功能
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const precisionCalculator = require('./precision-calculator.js');

// 解构所有导出的功能
const {
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
  getInstance,
  version,
  features
} = precisionCalculator;

// ES模块命名导出
export {
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
  getInstance,
  version,
  features
};

// 默认导出
export default {
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
  getInstance,
  version,
  features
};

/**
 * 使用示例:
 * 
 * // 命名导入
 * import { PrecisionCalculator, calc } from "precision-calculator";
 * const calculator = new PrecisionCalculator();
 * console.log(calc.add(0.1, 0.2)); // 0.3
 * 
 * // 默认导入
 * import precisionCalc from "precision-calculator";
 * const calculator = new precisionCalc.PrecisionCalculator();
 * 
 * // 混合导入
 * import precisionCalc, { calc, batch } from "precision-calculator";
 * 
 * // 全部导入
 * import * as PC from "precision-calculator";
 * const calculator = new PC.PrecisionCalculator();
 */