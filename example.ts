/**
 * TypeScript 使用示例
 * 演示 Precision Calculator 的各种功能（包含增强功能）
 * @version 1.1.0
 */

import { 
  calc,
  PrecisionCalculator, 
  ChainableCalculator,
  EnhancedCalculator,
  ChainCalculator,
  EnhancedTestSuite,
  BenchmarkTester,
  Assert,
  ConfigOptions,
  batch,
  getPerformanceMetrics,
  clearCache,
  getCacheStats,
  setConfig,
  getConfig,
  setLocale
} from './precision-calculator';

// 基础运算示例
const basicCalculations = () => {
  console.log('=== 基础运算 ===');
  
  // 类型安全的基础运算
  const sum: number = calc.add(0.1, 0.2);
  const difference: number = calc.subtract(0.3, 0.1);
  const product: number = calc.multiply(0.2, 0.2);
  const quotient: number = calc.divide(0.3, 0.1);
  
  console.log(`0.1 + 0.2 = ${sum}`);
  console.log(`0.3 - 0.1 = ${difference}`);
  console.log(`0.2 * 0.2 = ${product}`);
  console.log(`0.3 / 0.1 = ${quotient}`);
};

// 数学运算示例
const mathCalculations = () => {
  console.log('\n=== 数学运算 ===');
  
  const sqrt: number = calc.sqrt(25);
  const square: number = calc.square(5);
  const power: number = calc.pow(2, 3);
  const factorial: number = calc.factorial(5);
  const absolute: number = calc.abs(-10);
  
  console.log(`√25 = ${sqrt}`);
  console.log(`5² = ${square}`);
  console.log(`2³ = ${power}`);
  console.log(`5! = ${factorial}`);
  console.log(`|-10| = ${absolute}`);
};

// 格式化示例
const formattingExamples = () => {
  console.log('\n=== 格式化 ===');
  
  const percentage: string = calc.toPercent(0.1256, 2);
  const currency: string = calc.toCurrency(1234.56, '$');
  const unit: string = calc.toUnit(123.456, 'kg', 2);
  const readable: string = calc.toReadable(12345);
  const scientific: string = calc.toScientific(123456);
  
  console.log(`百分比: ${percentage}`);
  console.log(`货币: ${currency}`);
  console.log(`单位: ${unit}`);
  console.log(`可读: ${readable}`);
  console.log(`科学计数法: ${scientific}`);
};

// 链式调用示例
const chainCalculations = () => {
  console.log('\n=== 链式调用 ===');
  
  // 类型安全的链式调用
  const result1: number = calc.chain(100)
    .add(50)
    .multiply(1.08)
    .round(2)
    .valueOf();
  
  const result2: string = calc.chain(0.1256)
    .multiply(100)
    .round(1)
    .toPercent(1);
  
  console.log(`链式计算结果: ${result1}`);
  console.log(`链式格式化: ${result2}`);
};

// 使用PrecisionCalculator类
const classUsage = () => {
  console.log('\n=== 类使用 ===');
  
  const calculator = new PrecisionCalculator(4);
  
  const sum: number = calculator.add(0.1, 0.2);
  const formatted: number = calculator.format(10/3, 4);
  const expression: number = calculator.calculate('(10 + 5) * 2 - 3');
  
  console.log(`类计算: ${sum}`);
  console.log(`格式化: ${formatted}`);
  console.log(`表达式: ${expression}`);
};

// 批量计算示例
const batchCalculations = () => {
  console.log('\n=== 批量计算 ===');
  
  const expressions: string[] = [
    '0.1 + 0.2',
    '0.2 * 3',
    '1 / 3',
    '(10 + 5) * 2'
  ];
  
  const results: number[] = calc.batch(expressions);
  
  expressions.forEach((expr, index) => {
    console.log(`${expr} = ${results[index]}`);
  });
};

// 类型安全的错误处理
const errorHandling = () => {
  console.log('\n=== 错误处理 ===');
  
  try {
    // 这些操作可能抛出错误
    const divideByZero: number = calc.divide(10, 0);
    console.log(`除零结果: ${divideByZero}`);
  } catch (error) {
    console.log(`捕获错误: ${error}`);
  }
  
  try {
    const negativeRoot: number = calc.sqrt(-1);
    console.log(`负数开方: ${negativeRoot}`);
  } catch (error) {
    console.log(`捕获错误: ${error}`);
  }
};

// ===== 增强功能示例 =====
const enhancedExamples = () => {
  console.log('\n=== 增强功能示例 ===');

  // 1. 配置管理示例
  const config: ConfigOptions = {
    precision: {
      default: 4,
      max: 10,
      min: 0
    },
    errorHandling: {
      mode: 'log_throw',
      logErrors: true
    },
    performance: {
      cacheEnabled: true,
      cacheSize: 1000
    },
    logging: {
      enabled: true,
      level: 'INFO'
    }
  };

  setConfig(config);
  console.log('当前精度配置:', getConfig('precision.default', 2));

  // 2. 增强计算器使用
  const enhancedCalc = new EnhancedCalculator({
    config: config,
    locale: 'zh-CN'
  });

  console.log('增强加法:', enhancedCalc.add(0.1, 0.2));
  console.log('增强乘法:', enhancedCalc.multiply(3.14159, 2, 3));
  console.log('货币格式化:', enhancedCalc.formatCurrency(1234.56, '¥'));
  console.log('百分比格式化:', enhancedCalc.formatPercentage(0.1234));

  // 3. 链式调用增强版
  const chainResult = enhancedCalc.chain(100)
    .add(50)
    .multiply(2)
    .divide(3)
    .round(2)
    .result();
  console.log('链式计算结果:', chainResult);

  // 4. 批量计算
  const numbers = [1, 2, 3, 4, 5];
  const batchResults = batch(numbers, 'square', 2);
  console.log('批量平方计算:', batchResults);

  // 5. 性能监控
  const metrics = getPerformanceMetrics();
  console.log('性能指标:', {
    操作次数: metrics.operationCount,
    总时间: metrics.totalTime + 'ms',
    平均时间: metrics.averageTime + 'ms',
    缓存命中率: (metrics.cacheHitRate * 100).toFixed(2) + '%'
  });

  // 6. 缓存统计
  const cacheStats = getCacheStats();
  console.log('缓存统计:', {
    大小: cacheStats.size,
    命中: cacheStats.hits,
    未命中: cacheStats.misses,
    命中率: (cacheStats.hitRate * 100).toFixed(2) + '%'
  });

  // 7. 国际化示例
  setLocale('en-US');
  console.log('英文货币格式:', enhancedCalc.formatCurrency(1234.56, '$'));

  setLocale('ja-JP');
  console.log('日文货币格式:', enhancedCalc.formatCurrency(1234.56, '¥'));

  // 8. 测试套件示例
  const testSuite = new EnhancedTestSuite();

  // 添加自定义测试
  testSuite.runTest('加法测试', () => {
    const result = enhancedCalc.add(1, 2);
    Assert.assertEqual(result, 3, '1 + 2 应该等于 3');
  });

  testSuite.runTest('精度测试', () => {
    const result = enhancedCalc.add(0.1, 0.2, 10);
    Assert.assertAlmostEqual(result, 0.3, 0.0001, '0.1 + 0.2 应该约等于 0.3');
  });

  // 9. 基准测试示例
  const benchmark = new BenchmarkTester();

  // 测试加法性能
  const addBenchmark = benchmark.benchmark('加法性能测试', () => {
    enhancedCalc.add(Math.random() * 1000, Math.random() * 1000);
  }, 10000);

  console.log('加法基准测试结果:', {
    名称: addBenchmark.name,
    迭代次数: addBenchmark.iterations,
    平均时间: addBenchmark.avg,
    最小时间: addBenchmark.min,
    最大时间: addBenchmark.max
  });

  // 测试乘法性能
  const multiplyBenchmark = benchmark.benchmark('乘法性能测试', () => {
    enhancedCalc.multiply(Math.random() * 1000, Math.random() * 1000);
  }, 10000);

  console.log('乘法基准测试结果:', {
    名称: multiplyBenchmark.name,
    迭代次数: multiplyBenchmark.iterations,
    平均时间: multiplyBenchmark.avg,
    P95: multiplyBenchmark.p95,
    P99: multiplyBenchmark.p99
  });

  // 10. 断言工具示例
  console.log('\n=== 断言测试 ===');
  try {
    Assert.assertTrue(enhancedCalc.add(1, 1) === 2, '1 + 1 应该等于 2');
    Assert.assertFalse(enhancedCalc.divide(1, 0) === Infinity, '1 / 0 不应该等于 Infinity');
    console.log('所有断言测试通过');
  } catch (error) {
    console.error('断言测试失败:', error.message);
  }

  // 11. 清理缓存
  clearCache();
  console.log('缓存已清理');
};

// 运行所有示例
const runExamples = () => {
  console.log('TypeScript 精度计算器示例\n');
  
  basicCalculations();
  mathCalculations();
  formattingExamples();
  chainCalculations();
  classUsage();
  batchCalculations();
  errorHandling();
  enhancedExamples();
  
  console.log('\n✅ 所有示例运行完成!');
};

// 导出示例函数（如果需要在其他地方使用）
export {
  basicCalculations,
  mathCalculations,
  formattingExamples,
  chainCalculations,
  classUsage,
  batchCalculations,
  errorHandling,
  enhancedExamples,
  runExamples
};

// 如果直接运行此文件
if (typeof require !== 'undefined' && require.main === module) {
  runExamples();
}