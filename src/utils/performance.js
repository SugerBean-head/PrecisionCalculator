/**
 * 性能优化工具模块
 * @author Precision Calculator Team
 * @version 1.1.0
 */

/**
 * LRU缓存实现
 */
class LRUCache {
  /**
   * @param {number} capacity - 缓存容量
   */
  constructor(capacity = 1000) {
    this.capacity = capacity;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 获取缓存值
   * @param {string} key - 缓存键
   * @returns {*} 缓存值或undefined
   */
  get(key) {
    if (this.cache.has(key)) {
      // 移动到最新位置
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      this.hits++;
      return value;
    }
    this.misses++;
    return undefined;
  }

  /**
   * 设置缓存值
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   */
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最旧的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%',
      size: this.cache.size,
      capacity: this.capacity
    };
  }
}

/**
 * 记忆化装饰器
 */
class Memoizer {
  constructor(cacheSize = 1000) {
    this.cache = new LRUCache(cacheSize);
  }

  /**
   * 记忆化函数
   * @param {Function} fn - 要记忆化的函数
   * @param {Function} keyGenerator - 键生成器
   * @returns {Function} 记忆化后的函数
   */
  memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
    return (...args) => {
      const key = keyGenerator(...args);
      let result = this.cache.get(key);
      
      if (result === undefined) {
        result = fn.apply(this, args);
        this.cache.set(key, result);
      }
      
      return result;
    };
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    return this.cache.getStats();
  }
}

/**
 * 性能基准测试工具
 */
class Benchmark {
  /**
   * 执行基准测试
   * @param {Function} fn - 要测试的函数
   * @param {Array} args - 函数参数
   * @param {number} iterations - 迭代次数
   * @returns {Object} 测试结果
   */
  static run(fn, args = [], iterations = 10000) {
    const results = [];
    let totalTime = 0;
    let minTime = Infinity;
    let maxTime = 0;

    // 预热
    for (let i = 0; i < Math.min(100, iterations); i++) {
      fn.apply(null, args);
    }

    // 正式测试
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn.apply(null, args);
      const end = performance.now();
      
      const duration = end - start;
      results.push(duration);
      totalTime += duration;
      minTime = Math.min(minTime, duration);
      maxTime = Math.max(maxTime, duration);
    }

    const avgTime = totalTime / iterations;
    
    // 计算标准差
    const variance = results.reduce((sum, time) => {
      return sum + Math.pow(time - avgTime, 2);
    }, 0) / iterations;
    const stdDev = Math.sqrt(variance);

    // 计算中位数
    const sortedResults = results.sort((a, b) => a - b);
    const median = iterations % 2 === 0
      ? (sortedResults[iterations / 2 - 1] + sortedResults[iterations / 2]) / 2
      : sortedResults[Math.floor(iterations / 2)];

    return {
      iterations,
      totalTime: totalTime.toFixed(4) + 'ms',
      avgTime: avgTime.toFixed(4) + 'ms',
      minTime: minTime.toFixed(4) + 'ms',
      maxTime: maxTime.toFixed(4) + 'ms',
      median: median.toFixed(4) + 'ms',
      stdDev: stdDev.toFixed(4) + 'ms',
      opsPerSecond: Math.round(1000 / avgTime),
      results: results.map(r => parseFloat(r.toFixed(4)))
    };
  }

  /**
   * 比较多个函数的性能
   * @param {Object} functions - 函数对象 {name: function}
   * @param {Array} args - 函数参数
   * @param {number} iterations - 迭代次数
   * @returns {Object} 比较结果
   */
  static compare(functions, args = [], iterations = 10000) {
    const results = {};
    const names = Object.keys(functions);
    
    for (const name of names) {
      results[name] = this.run(functions[name], args, iterations);
    }

    // 找出最快的函数
    let fastest = names[0];
    let fastestTime = parseFloat(results[fastest].avgTime);
    
    for (const name of names) {
      const avgTime = parseFloat(results[name].avgTime);
      if (avgTime < fastestTime) {
        fastest = name;
        fastestTime = avgTime;
      }
    }

    // 计算相对性能
    for (const name of names) {
      const avgTime = parseFloat(results[name].avgTime);
      results[name].relativeTo = fastest;
      results[name].speedRatio = (avgTime / fastestTime).toFixed(2) + 'x';
      results[name].isFastest = name === fastest;
    }

    return {
      fastest,
      results,
      summary: {
        totalFunctions: names.length,
        iterations,
        fastestFunction: fastest,
        fastestTime: fastestTime.toFixed(4) + 'ms'
      }
    };
  }
}

/**
 * 快速算法实现
 */
class FastAlgorithms {
  /**
   * 快速幂算法
   * @param {number} base - 底数
   * @param {number} exp - 指数
   * @param {Function} multiply - 乘法函数
   * @returns {number} 结果
   */
  static fastPow(base, exp, multiply) {
    if (exp === 0) return 1;
    if (exp === 1) return base;
    if (exp < 0) return 1 / this.fastPow(base, -exp, multiply);
    
    let result = 1;
    let currentBase = base;
    let currentExp = Math.floor(exp);
    
    while (currentExp > 0) {
      if (currentExp % 2 === 1) {
        result = multiply(result, currentBase);
      }
      currentBase = multiply(currentBase, currentBase);
      currentExp = Math.floor(currentExp / 2);
    }
    
    return result;
  }

  /**
   * 记忆化阶乘计算
   */
  static createMemoizedFactorial() {
    const cache = new Map([[0, 1], [1, 1]]);
    
    return function factorial(n) {
      if (cache.has(n)) {
        return cache.get(n);
      }
      
      let result = cache.get(n - 1) || 1;
      for (let i = cache.size; i <= n; i++) {
        result *= i;
        cache.set(i, result);
      }
      
      return result;
    };
  }

  /**
   * 快速GCD算法（欧几里得算法）
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 最大公约数
   */
  static gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  }

  /**
   * 快速LCM算法（最小公倍数）
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 最小公倍数
   */
  static lcm(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  }
}

/**
 * 性能监控器
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = true;
  }

  /**
   * 开始计时
   * @param {string} label - 标签
   */
  start(label) {
    if (!this.enabled) return;
    
    this.metrics.set(label, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  /**
   * 结束计时
   * @param {string} label - 标签
   * @returns {number} 持续时间
   */
  end(label) {
    if (!this.enabled) return 0;
    
    const metric = this.metrics.get(label);
    if (!metric) return 0;
    
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    return metric.duration;
  }

  /**
   * 获取指标
   * @param {string} label - 标签
   * @returns {Object} 指标数据
   */
  getMetric(label) {
    return this.metrics.get(label);
  }

  /**
   * 获取所有指标
   * @returns {Object} 所有指标
   */
  getAllMetrics() {
    const result = {};
    for (const [label, metric] of this.metrics) {
      result[label] = {
        duration: metric.duration ? metric.duration.toFixed(4) + 'ms' : 'running',
        startTime: metric.startTime,
        endTime: metric.endTime
      };
    }
    return result;
  }

  /**
   * 清空指标
   */
  clear() {
    this.metrics.clear();
  }

  /**
   * 启用/禁用监控
   * @param {boolean} enabled - 是否启用
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// 创建全局实例
const globalMemoizer = new Memoizer();
const globalMonitor = new PerformanceMonitor();
const memoizedFactorial = FastAlgorithms.createMemoizedFactorial();

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LRUCache,
    Memoizer,
    Benchmark,
    FastAlgorithms,
    PerformanceMonitor,
    globalMemoizer,
    globalMonitor,
    memoizedFactorial
  };
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  window.PrecisionCalculatorPerformance = {
    LRUCache,
    Memoizer,
    Benchmark,
    FastAlgorithms,
    PerformanceMonitor,
    globalMemoizer,
    globalMonitor,
    memoizedFactorial
  };
}