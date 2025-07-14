/**
 * ES Module version of Precision Calculator
 * 精度计算工具类 - ES模块版本
 * 支持 import { PrecisionCalculator, calc } from "mathfix" 语法
 * 兼容浏览器和Vue3前端项目
 */

// 导入共享的核心类
import { PrecisionCalculator, ChainableCalculator } from './src/shared/core-calculator.js';
import { setConfig as setGlobalConfig, getConfig as getGlobalConfig, getGlobalConfigRef } from './src/shared/config-manager.js';
import { 
  batch as utilsBatch, 
  createRawCalc, 
  createCalc,
  getPerformanceMetrics,
  clearCache,
  getCacheStats,
  setLocale,
  getInstance,
  version,
  features
} from './src/shared/utils.js';

// 创建全局计算器实例
const calculator = new PrecisionCalculator();

// 使用共享工具创建计算器对象
const rawCalc = createRawCalc(calculator);
const calc = createCalc(calculator, getGlobalConfigRef());

// 兼容性函数
const EnhancedCalculator = PrecisionCalculator;
const ChainCalculator = ChainableCalculator;

// 使用共享的批量计算函数
const batch = utilsBatch;

// 使用共享的配置和工具函数
const setConfig = setGlobalConfig;
const getConfig = getGlobalConfig;

// ES模块命名导出
export {
  PrecisionCalculator,
  ChainableCalculator,
  calc,
  rawCalc,
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
  rawCalc,
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
