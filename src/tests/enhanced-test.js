/**
 * 增强测试套件
 * 提供全面的测试功能，包括基础运算、边界条件、性能测试等
 */

// 导入性能测量模块
let performance;
try {
  // Node.js 环境
  const { performance: nodePerformance } = require('perf_hooks');
  performance = nodePerformance;
} catch (error) {
  // 浏览器环境或备用方案
  performance = typeof window !== 'undefined' && window.performance ? window.performance : {
    now: () => Date.now()
  };
}

// 导入依赖
const fs = require('fs');
const path = require('path');

// 导入依赖模块
const mainModule = require('../../precision-calculator.js');
const {
  PrecisionCalculator,
  EnhancedCalculator,
  ChainCalculator,
  EnhancedTestSuite: ExportedTestSuite,
  BenchmarkTester: ExportedBenchmarkTester,
  Assert: ExportedAssert,
  setConfig,
  getConfig,
  setLocale,
  batch,
  getPerformanceMetrics,
  clearCache,
  getCacheStats
} = mainModule;

/**
 * 测试结果收集器
 */
class TestCollector {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      performance: [],
      coverage: new Map()
    };
    this.startTime = Date.now();
  }

  /**
   * 记录测试结果
   * @param {string} testName - 测试名称
   * @param {boolean} passed - 是否通过
   * @param {string} error - 错误信息
   * @param {number} duration - 执行时间
   */
  recordTest(testName, passed, error = null, duration = 0) {
    this.results.total++;
    
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push({ testName, error, duration });
    }
    
    if (duration > 0) {
      this.results.performance.push({ testName, duration });
    }
  }

  /**
   * 记录覆盖率
   * @param {string} functionName - 函数名
   * @param {boolean} covered - 是否覆盖
   */
  recordCoverage(functionName, covered) {
    this.results.coverage.set(functionName, covered);
  }

  /**
   * 生成测试报告
   * @returns {Object} 测试报告
   */
  generateReport() {
    const totalTime = Date.now() - this.startTime;
    const successRate = (this.results.passed / this.results.total * 100).toFixed(2);
    const avgPerformance = this.results.performance.length > 0 
      ? (this.results.performance.reduce((sum, p) => sum + p.duration, 0) / this.results.performance.length).toFixed(2)
      : 0;
    
    const coverageRate = this.results.coverage.size > 0
      ? (Array.from(this.results.coverage.values()).filter(Boolean).length / this.results.coverage.size * 100).toFixed(2)
      : 0;

    return {
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        successRate: `${successRate}%`,
        totalTime: `${totalTime}ms`,
        avgPerformance: `${avgPerformance}ms`,
        coverageRate: `${coverageRate}%`
      },
      errors: this.results.errors,
      performance: this.results.performance.sort((a, b) => b.duration - a.duration),
      coverage: Object.fromEntries(this.results.coverage)
    };
  }
}

/**
 * 性能基准测试器
 */
class BenchmarkTester {
  constructor() {
    this.benchmarks = [];
  }

  /**
   * 运行基准测试
   * @param {string} name - 测试名称
   * @param {Function} fn - 测试函数
   * @param {number} iterations - 迭代次数
   * @returns {Object} 基准测试结果
   */
  benchmark(name, fn, iterations = 1000) {
    const times = [];
    let errors = 0;
    
    // 预热
    for (let i = 0; i < Math.min(10, iterations); i++) {
      try {
        fn();
      } catch (error) {
        // 忽略预热错误
      }
    }
    
    // 正式测试
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      try {
        fn();
        const end = performance.now();
        times.push(end - start);
      } catch (error) {
        errors++;
      }
    }
    
    if (times.length === 0) {
      return {
        name,
        error: '所有测试都失败了',
        iterations,
        errors
      };
    }
    
    const sorted = times.sort((a, b) => a - b);
    const result = {
      name,
      iterations: times.length,
      errors,
      min: sorted[0].toFixed(3),
      max: sorted[sorted.length - 1].toFixed(3),
      avg: (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(3),
      median: sorted[Math.floor(sorted.length / 2)].toFixed(3),
      p95: sorted[Math.floor(sorted.length * 0.95)].toFixed(3),
      p99: sorted[Math.floor(sorted.length * 0.99)].toFixed(3)
    };
    
    this.benchmarks.push(result);
    return result;
  }

  /**
   * 获取所有基准测试结果
   * @returns {Array} 基准测试结果数组
   */
  getResults() {
    return this.benchmarks;
  }
}

/**
 * 断言工具
 */
class Assert {
  static assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`断言失败: ${message}\n期望: ${expected}\n实际: ${actual}`);
    }
  }

  static assertAlmostEqual(actual, expected, tolerance = 1e-10, message = '') {
    const diff = Math.abs(Number(actual) - Number(expected));
    if (diff > tolerance) {
      throw new Error(`断言失败: ${message}\n期望: ${expected} (±${tolerance})\n实际: ${actual}\n差值: ${diff}`);
    }
  }

  static assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`断言失败: ${message}\n期望: true\n实际: ${condition}`);
    }
  }

  static assertFalse(condition, message = '') {
    if (condition) {
      throw new Error(`断言失败: ${message}\n期望: false\n实际: ${condition}`);
    }
  }

  static assertThrows(fn, expectedError = null, message = '') {
    try {
      fn();
      throw new Error(`断言失败: ${message}\n期望抛出异常，但没有抛出`);
    } catch (error) {
      if (expectedError && !error.message.includes(expectedError)) {
        throw new Error(`断言失败: ${message}\n期望异常: ${expectedError}\n实际异常: ${error.message}`);
      }
    }
  }

  static assertNotNull(value, message = '') {
    if (value === null || value === undefined) {
      throw new Error(`断言失败: ${message}\n期望: 非空值\n实际: ${value}`);
    }
  }

  static assertInstanceOf(obj, constructor, message = '') {
    if (!(obj instanceof constructor)) {
      throw new Error(`断言失败: ${message}\n期望: ${constructor.name}的实例\n实际: ${typeof obj}`);
    }
  }
}

/**
 * 增强测试套件
 */
class EnhancedTestSuite {
  constructor() {
    this.collector = new TestCollector();
    this.benchmark = new BenchmarkTester();
  }

  /**
   * 运行单个测试
   * @param {string} testName - 测试名称
   * @param {Function} testFn - 测试函数
   */
  async runTest(testName, testFn) {
    const start = Date.now();
    try {
      await testFn();
      const duration = Date.now() - start;
      this.collector.recordTest(testName, true, null, duration);
      console.log(`✓ ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - start;
      this.collector.recordTest(testName, false, error.message, duration);
      console.log(`✗ ${testName} (${duration}ms): ${error.message}`);
    }
  }

  /**
   * 基础运算测试
   */
  async testBasicOperations() {
    console.log('\n=== 基础运算测试 ===');
    const calc = new EnhancedCalculator();
    
    await this.runTest('加法测试', () => {
      Assert.assertAlmostEqual(calc.add(0.1, 0.2), 0.3, 1e-10, '0.1 + 0.2 应该等于 0.3');
      Assert.assertAlmostEqual(calc.add(1, 2), 3, 1e-10, '1 + 2 应该等于 3');
      Assert.assertAlmostEqual(calc.add(-1, 1), 0, 1e-10, '-1 + 1 应该等于 0');
      this.collector.recordCoverage('add', true);
    });

    await this.runTest('减法测试', () => {
      Assert.assertAlmostEqual(calc.subtract(0.3, 0.1), 0.2, 1e-10, '0.3 - 0.1 应该等于 0.2');
      Assert.assertAlmostEqual(calc.subtract(5, 3), 2, 1e-10, '5 - 3 应该等于 2');
      Assert.assertAlmostEqual(calc.subtract(0, 0), 0, 1e-10, '0 - 0 应该等于 0');
      this.collector.recordCoverage('subtract', true);
    });

    await this.runTest('乘法测试', () => {
      Assert.assertAlmostEqual(calc.multiply(0.1, 0.2), 0.02, 1e-10, '0.1 * 0.2 应该等于 0.02');
      Assert.assertAlmostEqual(calc.multiply(3, 4), 12, 1e-10, '3 * 4 应该等于 12');
      Assert.assertAlmostEqual(calc.multiply(-2, 3), -6, 1e-10, '-2 * 3 应该等于 -6');
      this.collector.recordCoverage('multiply', true);
    });

    await this.runTest('除法测试', () => {
      Assert.assertAlmostEqual(calc.divide(0.3, 0.1), 3, 1e-10, '0.3 / 0.1 应该等于 3');
      Assert.assertAlmostEqual(calc.divide(10, 2), 5, 1e-10, '10 / 2 应该等于 5');
      Assert.assertAlmostEqual(calc.divide(-6, 3), -2, 1e-10, '-6 / 3 应该等于 -2');
      this.collector.recordCoverage('divide', true);
    });

    await this.runTest('除零测试', () => {
      Assert.assertThrows(() => calc.divide(1, 0), 'zero', '除零应该抛出异常');
      Assert.assertThrows(() => calc.divide(0, 0), 'zero', '0除以0应该抛出异常');
    });
  }

  /**
   * 边界条件测试
   */
  async testBoundaryConditions() {
    console.log('\n=== 边界条件测试 ===');
    const calc = new EnhancedCalculator();

    await this.runTest('极大数测试', () => {
      const largeNum = 1e15;
      Assert.assertAlmostEqual(calc.add(largeNum, 1), largeNum + 1, 1, '极大数加法');
      Assert.assertAlmostEqual(calc.multiply(largeNum, 2), largeNum * 2, largeNum * 0.001, '极大数乘法');
    });

    await this.runTest('极小数测试', () => {
      const smallNum = 1e-15;
      Assert.assertAlmostEqual(calc.add(smallNum, smallNum), smallNum * 2, 1e-16, '极小数加法');
      Assert.assertAlmostEqual(calc.multiply(smallNum, 2), smallNum * 2, 1e-16, '极小数乘法');
    });

    await this.runTest('零值测试', () => {
      Assert.assertAlmostEqual(calc.add(0, 0), 0, 1e-10, '0 + 0');
      Assert.assertAlmostEqual(calc.multiply(0, 100), 0, 1e-10, '0 * 100');
      Assert.assertAlmostEqual(calc.power(0, 1), 0, 1e-10, '0^1');
    });

    await this.runTest('负数测试', () => {
      Assert.assertAlmostEqual(calc.add(-1, -2), -3, 1e-10, '负数加法');
      Assert.assertAlmostEqual(calc.multiply(-2, -3), 6, 1e-10, '负数乘法');
      Assert.assertAlmostEqual(calc.divide(-6, -2), 3, 1e-10, '负数除法');
    });

    await this.runTest('精度边界测试', () => {
      // 测试不同精度设置
      const result1 = calc.add(1/3, 1/3, 2);
      const result2 = calc.add(1/3, 1/3, 10);
      Assert.assertTrue(Math.abs(result1 - 0.67) < 0.01, '低精度结果');
      Assert.assertTrue(Math.abs(result2 - 0.6666666667) < 1e-9, '高精度结果');
    });
  }

  /**
   * 数学函数测试
   */
  async testMathFunctions() {
    console.log('\n=== 数学函数测试 ===');
    const calc = new EnhancedCalculator();

    await this.runTest('幂运算测试', () => {
      Assert.assertAlmostEqual(calc.power(2, 3), 8, 1e-10, '2^3 = 8');
      Assert.assertAlmostEqual(calc.power(5, 0), 1, 1e-10, '5^0 = 1');
      Assert.assertAlmostEqual(calc.power(2, -2), 0.25, 1e-10, '2^(-2) = 0.25');
      this.collector.recordCoverage('power', true);
    });

    await this.runTest('平方根测试', () => {
      Assert.assertAlmostEqual(calc.sqrt(4), 2, 1e-10, '√4 = 2');
      Assert.assertAlmostEqual(calc.sqrt(9), 3, 1e-10, '√9 = 3');
      Assert.assertAlmostEqual(calc.sqrt(2), Math.sqrt(2), 1e-10, '√2');
      this.collector.recordCoverage('sqrt', true);
    });

    await this.runTest('阶乘测试', () => {
      Assert.assertEqual(calc.factorial(0), 1, '0! = 1');
      Assert.assertEqual(calc.factorial(1), 1, '1! = 1');
      Assert.assertEqual(calc.factorial(5), 120, '5! = 120');
      Assert.assertEqual(calc.factorial(10), 3628800, '10! = 3628800');
      this.collector.recordCoverage('factorial', true);
    });

    await this.runTest('阶乘异常测试', () => {
      Assert.assertThrows(() => calc.factorial(-1), 'Invalid', '负数阶乘应该抛出异常');
      Assert.assertThrows(() => calc.factorial(1.5), 'Invalid', '小数阶乘应该抛出异常');
    });
  }

  /**
   * 格式化测试
   */
  async testFormatting() {
    console.log('\n=== 格式化测试 ===');
    const calc = new EnhancedCalculator();

    await this.runTest('货币格式化测试', () => {
      Assert.assertEqual(calc.formatCurrency(123.456), '$123.46', '默认货币格式');
      Assert.assertEqual(calc.formatCurrency(123.456, '¥'), '¥123.46', '人民币格式');
      Assert.assertEqual(calc.formatCurrency(0), '$0.00', '零值货币格式');
      this.collector.recordCoverage('formatCurrency', true);
    });

    await this.runTest('百分比格式化测试', () => {
      Assert.assertEqual(calc.formatPercentage(0.1234), '12.34%', '百分比格式');
      Assert.assertEqual(calc.formatPercentage(1), '100.00%', '100%格式');
      Assert.assertEqual(calc.formatPercentage(0), '0.00%', '0%格式');
      this.collector.recordCoverage('formatPercentage', true);
    });
  }

  /**
   * 性能基准测试
   */
  async testPerformance() {
    console.log('\n=== 性能基准测试 ===');
    const calc = new EnhancedCalculator();

    // 基础运算性能测试
    this.benchmark.benchmark('加法性能', () => {
      calc.add(Math.random(), Math.random());
    }, 10000);

    this.benchmark.benchmark('乘法性能', () => {
      calc.multiply(Math.random() * 1000, Math.random() * 1000);
    }, 10000);

    this.benchmark.benchmark('除法性能', () => {
      calc.divide(Math.random() * 1000, Math.random() * 100 + 1);
    }, 10000);

    this.benchmark.benchmark('幂运算性能', () => {
      calc.power(Math.random() * 10, Math.floor(Math.random() * 5));
    }, 1000);

    this.benchmark.benchmark('平方根性能', () => {
      calc.sqrt(Math.random() * 1000);
    }, 10000);

    this.benchmark.benchmark('阶乘性能', () => {
      calc.factorial(Math.floor(Math.random() * 10));
    }, 1000);

    // 复杂运算性能测试
    this.benchmark.benchmark('复合运算性能', () => {
      const a = Math.random() * 100;
      const b = Math.random() * 100;
      const c = Math.random() * 100;
      calc.add(
        calc.multiply(a, b),
        calc.divide(c, b + 1)
      );
    }, 5000);
  }

  /**
   * 压力测试
   */
  async testStress() {
    console.log('\n=== 压力测试 ===');
    const calc = new EnhancedCalculator();

    await this.runTest('大量计算压力测试', () => {
      const iterations = 10000;
      let result = 0;
      
      for (let i = 0; i < iterations; i++) {
        result = calc.add(result, i / 1000);
      }
      
      Assert.assertTrue(result > 0, '压力测试结果应该大于0');
      Assert.assertTrue(result < iterations, '压力测试结果应该在合理范围内');
    });

    await this.runTest('内存使用测试', () => {
      const initialMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
      const largeArray = [];
      
      for (let i = 0; i < 1000; i++) {
        largeArray.push(calc.multiply(i, Math.PI));
      }
      
      const finalMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // 内存增长应该在合理范围内（小于10MB）
      Assert.assertTrue(memoryIncrease < 10 * 1024 * 1024, '内存使用应该在合理范围内');
    });
  }

  /**
   * 运行所有测试
   */
  async runAllTests() {
    console.log('🚀 开始运行增强测试套件...');
    console.log('=' .repeat(50));
    
    const startTime = Date.now();
    
    try {
      // 运行各个测试模块
      await this.testBasicOperations();
      await this.testBoundaryConditions();
      await this.testMathFunctions();
      await this.testFormatting();
      await this.testPerformance();
      await this.testStress();
      
    } catch (error) {
      console.error('测试运行出错:', error);
      this.collector.recordTest('测试套件运行', false, error.message, Date.now() - startTime);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // 生成测试报告
    const report = this.generateReport(totalTime);
    
    // 保存报告到文件
    await this.saveReport(report);
    
    return report;
  }

  /**
   * 生成测试报告
   */
  generateReport(totalTime) {
    const report = this.collector.generateReport();
    const benchmarkResults = this.benchmark.getResults();

    console.log('\n' + '=' .repeat(50));
    console.log('测试报告');
    console.log('=' .repeat(50));
    console.log(`总测试数: ${report.summary.total}`);
    console.log(`通过: ${report.summary.passed}`);
    console.log(`失败: ${report.summary.failed}`);
    console.log(`成功率: ${report.summary.successRate}`);
    console.log(`总耗时: ${report.summary.totalTime}`);
    console.log(`平均耗时: ${report.summary.avgPerformance}`);
    console.log(`代码覆盖率: ${report.summary.coverageRate}`);

    if (report.errors.length > 0) {
      console.log('\n失败的测试:');
      report.errors.forEach(error => {
        console.log(`  ✗ ${error.testName}: ${error.error}`);
      });
    }

    if (benchmarkResults.length > 0) {
      console.log('\n性能基准测试结果:');
      benchmarkResults.forEach(result => {
        console.log(`  ${result.name}:`);
        console.log(`    迭代次数: ${result.iterations}`);
        console.log(`    平均耗时: ${result.avg}ms`);
        console.log(`    最小耗时: ${result.min}ms`);
        console.log(`    最大耗时: ${result.max}ms`);
        console.log(`    95%分位: ${result.p95}ms`);
        if (result.errors > 0) {
          console.log(`    错误次数: ${result.errors}`);
        }
      });
    }

    return {
      summary: report,
      benchmarks: benchmarkResults,
      timestamp: new Date().toISOString(),
      totalTime
    };
  }

  /**
   * 保存报告到文件
   */
  async saveReport(report) {
    this.saveReportToFile(report);
  }

  /**
   * 保存报告到文件
   * @param {Object} report - 测试报告
   */
  saveReportToFile(report) {
    try {
      const reportDir = path.join(__dirname, '../../reports');
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportFile = path.join(reportDir, `test-report-${timestamp}.json`);
      
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
      console.log(`\n详细报告已保存到: ${reportFile}`);
    } catch (error) {
      console.warn('保存报告失败:', error.message);
    }
  }
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
  const testSuite = new EnhancedTestSuite();
  testSuite.runAllTests().then(report => {
    console.log('\n测试完成!');
    if (report.summary.failed > 0) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('测试套件运行失败:', error);
    process.exit(1);
  });
}

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EnhancedTestSuite,
    TestCollector,
    BenchmarkTester,
    Assert
  };
}