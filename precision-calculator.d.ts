/**
 * TypeScript类型定义文件
 * @version 1.1.0
 * 包含增强功能的类型定义
 */

/**
 * 精度计算器类
 */
export declare class PrecisionCalculator {
  /**
   * 构造函数
   * @param precision 默认精度，默认为10位小数
   */
  constructor(precision?: number);

  /**
   * 设置计算精度
   * @param precision 精度位数
   */
  setPrecision(precision: number): void;

  /**
   * 获取数字的小数位数
   * @param num 数字
   * @returns 小数位数
   */
  getDecimalPlaces(num: number): number;

  /**
   * 将数字转换为整数（消除小数点）
   * @param num 数字
   * @returns 整数和放大倍数
   */
  toInteger(num: number): { integer: number; multiplier: number };

  // 基础运算
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;

  // 数学运算
  square(num: number): number;
  cube(num: number): number;
  sqrt(num: number): number;
  cbrt(num: number): number;
  pow(base: number, exponent: number): number;
  abs(num: number): number;
  log10(num: number): number;
  ln(num: number): number;
  exp(exponent: number): number;
  factorial(num: number): number;
  reciprocal(num: number): number;
  percentage(num: number): number;

  // 格式化方法
  format(num: number, precision?: number): number;
  round(num: number, precision?: number): number;
  ceil(num: number, precision?: number): number;
  floor(num: number, precision?: number): number;
  toPercent(num: number, precision?: number, withSymbol?: boolean): string;
  toCurrency(num: number, symbol?: string, precision?: number, withComma?: boolean): string;
  toUnit(num: number, unit: string, precision?: number): string;
  toReadable(num: number, precision?: number, locale?: 'zh' | 'en'): string;
  toScientific(num: number, precision?: number): string;
  toFraction(num: number, maxDenominator?: number): string;

  // 计算方法
  calculate(expression: string): number;
  calculateBatch(expressions: string[]): number[];
}

/**
 * 链式计算器类
 */
export declare class ChainableCalculator {
  /**
   * 构造函数
   * @param value 初始值
   */
  constructor(value?: number);

  // 基础运算（链式）
  add(num: number): ChainableCalculator;
  subtract(num: number): ChainableCalculator;
  multiply(num: number): ChainableCalculator;
  divide(num: number): ChainableCalculator;

  // 数学运算（链式）
  square(): ChainableCalculator;
  cube(): ChainableCalculator;
  sqrt(): ChainableCalculator;
  cbrt(): ChainableCalculator;
  pow(exponent: number): ChainableCalculator;
  abs(): ChainableCalculator;
  log10(): ChainableCalculator;
  ln(): ChainableCalculator;
  exp(): ChainableCalculator;
  factorial(): ChainableCalculator;
  reciprocal(): ChainableCalculator;
  percentage(): ChainableCalculator;

  // 取整和舍入（链式）
  round(precision?: number): ChainableCalculator;
  ceil(precision?: number): ChainableCalculator;
  floor(precision?: number): ChainableCalculator;

  // 格式化方法（链式）
  toPercent(precision?: number, withSymbol?: boolean): string;
  toCurrency(symbol?: string, precision?: number, withComma?: boolean): string;
  toUnit(unit: string, precision?: number): string;
  toReadable(precision?: number, locale?: 'zh' | 'en'): string;
  toScientific(precision?: number): string;
  toFraction(maxDenominator?: number): string;
  format(precision?: number): ChainableCalculator;

  // 获取结果
  valueOf(): number;
  toString(): string;
  reset(value?: number): ChainableCalculator;
}

/**
 * 静态计算方法接口
 */
export interface CalcInterface {
  // 基础运算
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;

  // 数学运算
  square(num: number): number;
  cube(num: number): number;
  sqrt(num: number): number;
  cbrt(num: number): number;
  pow(base: number, exponent: number): number;
  abs(num: number): number;
  log10(num: number): number;
  ln(num: number): number;
  exp(exponent: number): number;
  factorial(num: number): number;
  reciprocal(num: number): number;
  percentage(num: number): number;

  // 表达式计算
  calculate(expression: string): number;
  batch(expressions: string[]): number[];

  // 格式化
  format(num: number, precision?: number): number;
  round(num: number, precision?: number): number;
  ceil(num: number, precision?: number): number;
  floor(num: number, precision?: number): number;
  toPercent(num: number, precision?: number, withSymbol?: boolean): string;
  toCurrency(num: number, symbol?: string, precision?: number, withComma?: boolean): string;
  toUnit(num: number, unit: string, precision?: number): string;
  toReadable(num: number, precision?: number, locale?: 'zh' | 'en'): string;
  toScientific(num: number, precision?: number): string;
  toFraction(num: number, maxDenominator?: number): string;

  // 精度控制
  setPrecision(precision: number): void;
  getInstance(): PrecisionCalculator;
  chain(value?: number): ChainableCalculator;
}

/**
 * 主要导出的calc对象
 */
export declare const calc: CalcInterface;

// 配置相关类型
export interface ConfigOptions {
  precision?: {
    default?: number;
    max?: number;
    min?: number;
  };
  rounding?: {
    mode?: string;
    precision?: number;
  };
  errorHandling?: {
    mode?: 'throw' | 'null' | 'nan' | 'inf' | 'log_throw' | 'log_return';
    logErrors?: boolean;
    throwOnOverflow?: boolean;
    throwOnUnderflow?: boolean;
  };
  performance?: {
    cacheEnabled?: boolean;
    cacheSize?: number;
    memoizeFactorial?: boolean;
    memoizePower?: boolean;
    benchmarkEnabled?: boolean;
  };
  logging?: {
    enabled?: boolean;
    level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    logOperations?: boolean;
    logPerformance?: boolean;
    maxLogs?: number;
  };
  formatting?: {
    currency?: {
      symbol?: string;
      precision?: number;
      thousandsSeparator?: string;
      decimalSeparator?: string;
    };
    percentage?: {
      precision?: number;
      symbol?: string;
    };
    scientific?: {
      precision?: number;
      exponentialThreshold?: number;
    };
  };
  validation?: {
    strictMode?: boolean;
    allowInfinite?: boolean;
    allowNaN?: boolean;
    maxExpressionLength?: number;
    maxArrayLength?: number;
  };
  i18n?: {
    locale?: string;
    fallbackLocale?: string;
    dateFormat?: string;
    timeFormat?: string;
  };
}

// 性能指标类型
export interface PerformanceMetrics {
  operationCount: number;
  totalTime: number;
  averageTime: number;
  cacheHitRate: number;
  memoryUsage?: number;
}

// 缓存统计类型
export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

// 测试结果类型
export interface TestResult {
  total: number;
  passed: number;
  failed: number;
  successRate: string;
  totalTime: string;
  errors: Array<{
    testName: string;
    error: string;
    duration: number;
  }>;
}

// 基准测试结果类型
export interface BenchmarkResult {
  name: string;
  iterations: number;
  errors: number;
  min: string;
  max: string;
  avg: string;
  median: string;
  p95: string;
  p99: string;
}

// 增强计算器类
export declare class EnhancedCalculator {
  constructor(options?: { config?: ConfigOptions; locale?: string });
  
  // 基础运算方法
  add(a: number | string, b: number | string, precision?: number): number;
  subtract(a: number | string, b: number | string, precision?: number): number;
  multiply(a: number | string, b: number | string, precision?: number): number;
  divide(a: number | string, b: number | string, precision?: number): number;
  power(base: number | string, exponent: number | string, precision?: number): number;
  sqrt(n: number | string, precision?: number): number;
  factorial(n: number | string): number;
  abs(n: number | string, precision?: number): number;
  round(n: number | string, precision?: number): number;
  ceil(n: number | string, precision?: number): number;
  floor(n: number | string, precision?: number): number;
  
  // 格式化方法
  formatCurrency(value: number | string, symbol?: string, precision?: number): string;
  formatPercentage(value: number | string, precision?: number): string;
  
  // 链式调用
  chain(initialValue: number | string): ChainCalculator;
  
  // 批量计算
  batch(numbers: (number | string)[], operation: string, precision?: number): (number | null)[];
  
  // 性能和缓存
  getPerformanceMetrics(): PerformanceMetrics;
  clearCache(): void;
  getCacheStats(): CacheStats;
}

// 链式计算器类
export declare class ChainCalculator {
  constructor(calculator: EnhancedCalculator, initialValue: number | string);
  
  setPrecision(precision: number): ChainCalculator;
  add(value: number | string): ChainCalculator;
  subtract(value: number | string): ChainCalculator;
  multiply(value: number | string): ChainCalculator;
  divide(value: number | string): ChainCalculator;
  power(exponent: number | string): ChainCalculator;
  sqrt(): ChainCalculator;
  abs(): ChainCalculator;
  round(precision?: number): ChainCalculator;
  
  result(): number;
  toCurrency(symbol?: string, precision?: number): string;
  toPercentage(precision?: number): string;
}

// 测试套件类
export declare class EnhancedTestSuite {
  constructor();
  runAllTests(): Promise<TestResult>;
  runTest(testName: string, testFn: () => void | Promise<void>): Promise<void>;
}

// 基准测试器类
export declare class BenchmarkTester {
  constructor();
  benchmark(name: string, fn: () => void, iterations?: number): BenchmarkResult;
  getResults(): BenchmarkResult[];
}

// 断言工具类
export declare class Assert {
  static assertEqual(actual: any, expected: any, message?: string): void;
  static assertAlmostEqual(actual: number, expected: number, tolerance?: number, message?: string): void;
  static assertTrue(condition: boolean, message?: string): void;
  static assertFalse(condition: boolean, message?: string): void;
  static assertThrows(fn: () => void, expectedError?: string, message?: string): void;
  static assertNotNull(value: any, message?: string): void;
  static assertInstanceOf(obj: any, constructor: Function, message?: string): void;
}

// 功能特性类型
export interface Features {
  enhanced: boolean;
  config: boolean;
  i18n: boolean;
  performance: boolean;
  logging: boolean;
}

// 全局函数声明
export declare function batch(numbers: (number | string)[], operation: string, precision?: number): (number | null)[];
export declare function getPerformanceMetrics(): PerformanceMetrics;
export declare function clearCache(): boolean;
export declare function getCacheStats(): CacheStats;
export declare function setConfig(config: ConfigOptions): boolean;
export declare function getConfig(path: string, defaultValue?: any): any;
export declare function setLocale(locale: string): boolean;
export declare function getInstance(): EnhancedCalculator | null;

// 版本和特性信息
export declare const version: string;
export declare const features: Features;

/**
 * 默认导出（用于CommonJS）
 */
declare const _default: {
  PrecisionCalculator: typeof PrecisionCalculator;
  ChainableCalculator: typeof ChainableCalculator;
  calc: CalcInterface;
};

export default _default;

/**
 * 全局声明（用于浏览器环境）
 */
declare global {
  interface Window {
    PrecisionCalculator: typeof PrecisionCalculator;
    ChainableCalculator: typeof ChainableCalculator;
    calc: CalcInterface;
  }
}