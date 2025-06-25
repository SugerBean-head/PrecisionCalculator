# Precision Calculator

一个专门解决JavaScript浮点数精度问题的高精度计算工具库。现已包含增强功能：配置管理、国际化支持、性能优化、日志记录、测试套件等。

## 📦 安装

### NPM 安装
```bash
npm install precision-calculator
```

### 直接下载
下载 `precision-calculator.js` 文件直接使用。

## 🌟 特性

### 核心功能
- ✅ **精确计算**: 解决JavaScript浮点数精度问题
- 🧮 **公式支持**: 支持复杂数学表达式计算
- ➖ **负号处理**: 完美支持负数和负号运算
- 🎯 **精度控制**: 可自定义计算精度
- 📊 **数据格式化**: 支持百分比、货币、单位等多种格式化
- 🔢 **取整舍入**: 支持四舍五入、向上取整、向下取整等操作
- 🔗 **链式调用**: 支持流畅的链式操作，提高代码可读性
- 📝 **TypeScript支持**: 完整的类型定义，提供类型安全
- 📦 **轻量级**: 无依赖，纯JavaScript实现
- 🌐 **兼容性**: 支持浏览器和Node.js环境

### 增强功能 🆕
- ✅ **配置管理** - 灵活的配置系统，支持精度、舍入、错误处理等设置
- ✅ **国际化支持** - 多语言错误消息和格式化（中文、英文、日文）
- ✅ **性能优化** - LRU缓存、记忆化、快速算法、性能监控
- ✅ **日志记录** - 操作日志、性能指标、错误追踪
- ✅ **增强测试** - 测试套件、基准测试、断言工具
- ✅ **错误处理** - 自定义错误类型、详细错误信息
- ✅ **输入验证** - 严格的参数验证和类型检查

## 🚀 快速开始

### Node.js 环境
```javascript
const { calc } = require('precision-calculator');
// 或者导入其他类: const { PrecisionCalculator, ChainableCalculator } = require('precision-calculator');

// 基础运算
console.log(calc.add(0.1, 0.2));        // 0.3
console.log(calc.subtract(0.3, 0.1));   // 0.2
console.log(calc.multiply(0.2, 3));     // 0.6
console.log(calc.divide(0.3, 0.1));     // 3

// 数学运算
console.log(calc.sqrt(25));             // 5
console.log(calc.pow(2, 3));            // 8
console.log(calc.factorial(5));         // 120

// 链式调用
const result = calc.chain(100)
  .add(50)
  .multiply(1.08)
  .round(2)
  .valueOf();
console.log(result);                     // 162
```

### 增强功能使用 🆕

```javascript
const { 
  EnhancedCalculator, 
  setConfig, 
  setLocale, 
  batch,
  getPerformanceMetrics 
} = require('precision-calculator');

// 1. 配置管理
setConfig({
  precision: { default: 4 },
  performance: { cacheEnabled: true },
  logging: { enabled: true }
});

// 2. 增强计算器
const calc = new EnhancedCalculator();
console.log(calc.add(0.1, 0.2));                    // 0.3
console.log(calc.formatCurrency(1234.56, '$'));     // $1,234.56
console.log(calc.formatPercentage(0.1234));         // 12.34%

// 3. 链式调用
const result = calc.chain(100)
  .add(50)
  .multiply(2)
  .divide(3)
  .result();
console.log(result);  // 100

// 4. 批量计算
const numbers = [1, 2, 3, 4, 5];
const squares = batch(numbers, 'square');
console.log(squares);  // [1, 4, 9, 16, 25]

// 5. 国际化
setLocale('zh-CN');
console.log(calc.formatCurrency(1234.56, '¥'));     // ¥1,234.56

// 6. 性能监控
const metrics = getPerformanceMetrics();
console.log(`操作次数: ${metrics.operationCount}`);
console.log(`缓存命中率: ${(metrics.cacheHitRate * 100).toFixed(2)}%`);
```

### TypeScript 环境

```typescript
import { calc, PrecisionCalculator, ChainableCalculator } from 'precision-calculator';

// 类型安全的基础运算
const sum: number = calc.add(0.1, 0.2);        // 0.3
const difference: number = calc.subtract(0.3, 0.1);   // 0.2
const product: number = calc.multiply(0.2, 3);     // 0.6
const quotient: number = calc.divide(0.3, 0.1);     // 3

// 数学运算
const sqrt: number = calc.sqrt(25);             // 5
const power: number = calc.pow(2, 3);            // 8
const factorial: number = calc.factorial(5);         // 120

// 格式化（返回字符串）
const percentage: string = calc.toPercent(0.1256, 2);  // "12.56%"
const currency: string = calc.toCurrency(1234.56, '$'); // "$1,234.56"

// 链式调用
const result: number = calc.chain(100)
  .add(50)
  .multiply(1.08)
  .round(2)
  .valueOf();
console.log(result);                     // 162

// 使用类实例
const calculator = new PrecisionCalculator(4);
const precise: number = calculator.add(0.1, 0.2);
```

### 浏览器环境
```html
<script src="precision-calculator.js"></script>
<script>
    console.log(calc.add(0.1, 0.2)); // 0.3
    console.log(calc.multiply(0.1, 3)); // 0.3
    
    // 使用链式调用
    const result = calc.chain(100).add(50).multiply(1.08).valueOf();
</script>
```

## 文件结构

```
precision-calculator/
├── precision-calculator.js     # 主库文件（包含增强功能）
├── precision-calculator.d.ts   # TypeScript类型定义（增强版）
├── example.ts                  # TypeScript使用示例（增强版）
├── tsconfig.json              # TypeScript配置
├── test.js                    # 基础测试文件
├── index.html                 # 浏览器演示页面
├── package.json               # 包配置文件
├── .npmignore                 # npm忽略文件
├── README.md                  # 说明文档
└── src/                       # 源代码目录
    ├── core/
    │   ├── calculator.js      # 增强计算器核心
    │   └── config.js          # 配置管理
    ├── errors/
    │   └── calculator-errors.js # 自定义错误类型
    ├── utils/
    │   ├── validator.js       # 输入验证
    │   ├── performance.js     # 性能优化工具
    │   └── logger.js          # 日志记录
    ├── i18n/
    │   └── index.js           # 国际化支持
    └── tests/
        └── enhanced-test.js   # 增强测试套件
```

## 🧪 测试

### 基础测试

```bash
npm test
```

### 增强测试套件 🆕

```bash
npm run test:enhanced
```

### TypeScript 支持

本库提供完整的 TypeScript 类型定义。如需使用 TypeScript 相关功能，请先安装 TypeScript 编译器：

```bash
# 全局安装 TypeScript
npm install -g typescript

# 或在项目中安装
npm install --save-dev typescript
```

安装后可使用以下命令：

```bash
# TypeScript 类型检查
npm run test:ts

# 检查类型定义文件
npm run type-check
```

### 性能基准测试 🆕

```bash
npm run benchmark
```

### 其他脚本

```bash
npm run build      # 构建项目
npm run lint       # 代码检查
npm run coverage   # 覆盖率报告
npm run docs       # 生成文档
```

### 启动演示页面
```bash
npm run demo
```
然后访问 http://localhost:8000 查看完整的功能演示。

### 快速验证
```bash
npm start
```

## 📖 API 文档

### 基础运算方法

#### `calc.add(a, b)`
精确加法运算
```javascript
calc.add(0.1, 0.2); // 0.3 (而不是 0.30000000000000004)
```

#### `calc.subtract(a, b)`
精确减法运算
```javascript
calc.subtract(0.3, 0.1); // 0.2 (而不是 0.19999999999999998)
```

#### `calc.multiply(a, b)`
精确乘法运算
```javascript
calc.multiply(0.1, 3); // 0.3 (而不是 0.30000000000000004)
```

#### `calc.divide(a, b)`
精确除法运算
```javascript
calc.divide(0.3, 0.1); // 3 (而不是 2.9999999999999996)
```

### 增强功能 API 🆕

#### 配置管理

```javascript
// 设置配置
setConfig({
  precision: { default: 4, max: 10, min: 0 },
  errorHandling: { mode: 'throw', logErrors: true },
  performance: { cacheEnabled: true, cacheSize: 1000 },
  logging: { enabled: true, level: 'INFO' }
});

// 获取配置
const precision = getConfig('precision.default', 2);
```

#### 增强计算器类

```javascript
const calc = new EnhancedCalculator({
  config: { precision: { default: 4 } },
  locale: 'zh-CN'
});

// 所有基础运算方法
calc.add(a, b, precision?)
calc.subtract(a, b, precision?)
calc.multiply(a, b, precision?)
calc.divide(a, b, precision?)
calc.power(base, exponent, precision?)
calc.sqrt(n, precision?)
calc.factorial(n)
calc.abs(n, precision?)
calc.round(n, precision?)
calc.ceil(n, precision?)
calc.floor(n, precision?)

// 格式化方法
calc.formatCurrency(value, symbol?, precision?)
calc.formatPercentage(value, precision?)

// 链式调用
calc.chain(initialValue)

// 批量计算
calc.batch(numbers, operation, precision?)

// 性能和缓存
calc.getPerformanceMetrics()
calc.clearCache()
calc.getCacheStats()
```

#### 链式计算器

```javascript
const result = calc.chain(100)
  .setPrecision(2)
  .add(50)
  .multiply(2)
  .divide(3)
  .round()
  .result();  // 获取最终结果

// 格式化输出
const currency = calc.chain(1234.56)
  .multiply(1.1)
  .toCurrency('$', 2);  // "$1,358.02"

const percentage = calc.chain(0.1234)
  .multiply(100)
  .toPercentage(1);  // "12.3%"
```

#### 批量计算

```javascript
// 批量运算
const numbers = [1, 2, 3, 4, 5];
const results = batch(numbers, 'square', 2);  // [1, 4, 9, 16, 25]
const sums = batch(numbers, 'add', 2, 10);    // [11, 12, 13, 14, 15]
```

#### 性能监控

```javascript
// 获取性能指标
const metrics = getPerformanceMetrics();
console.log({
  operationCount: metrics.operationCount,
  totalTime: metrics.totalTime,
  averageTime: metrics.averageTime,
  cacheHitRate: metrics.cacheHitRate
});

// 缓存统计
const stats = getCacheStats();
console.log({
  size: stats.size,
  hits: stats.hits,
  misses: stats.misses,
  hitRate: stats.hitRate
});

// 清理缓存
clearCache();
```

#### 国际化

```javascript
// 设置语言
setLocale('zh-CN');  // 中文
setLocale('en-US');  // 英文
setLocale('ja-JP');  // 日文

// 本地化格式化
const calc = new EnhancedCalculator({ locale: 'zh-CN' });
console.log(calc.formatCurrency(1234.56, '¥'));  // ¥1,234.56
```

#### 测试和基准测试

```javascript
// 测试套件
const testSuite = new EnhancedTestSuite();
testSuite.runTest('加法测试', () => {
  const result = calc.add(1, 2);
  Assert.assertEqual(result, 3);
});

// 基准测试
const benchmark = new BenchmarkTester();
const result = benchmark.benchmark('加法性能', () => {
  calc.add(Math.random(), Math.random());
}, 10000);

console.log(`平均时间: ${result.avg}`);
console.log(`P95: ${result.p95}`);
```

### 公式计算方法

#### `calc.calculate(expression)`
计算数学表达式
```javascript
// 基础运算
calc.calculate('0.1 + 0.2'); // 0.3
calc.calculate('0.1 * 3'); // 0.3

// 负号支持
calc.calculate('-5 + 3'); // -2
calc.calculate('-(5 + 3) * 2'); // -16
calc.calculate('10 + -5'); // 5

// 复杂表达式
calc.calculate('(0.1 + 0.2) * 3 - 0.5'); // 0.4
calc.calculate('10 / 3 + 0.1'); // 3.4333333333
```

#### `calc.batch(expressions)`
批量计算多个表达式
```javascript
const results = calc.batch([
    '0.1 + 0.2',
    '0.1 * 3',
    '10 / 3'
]);
console.log(results); // [0.3, 0.3, 3.3333333333]
```

### 数值取整和舍入方法

#### `calc.round(number, precision)`
四舍五入到指定小数位数
```javascript
calc.round(10.345, 2); // 10.35
calc.round(10.345); // 10 (默认取整)
```

#### `calc.ceil(number, precision)`
向上取整到指定小数位数
```javascript
calc.ceil(10.342, 2); // 10.35
calc.ceil(10.1); // 11 (默认取整)
```

#### `calc.floor(number, precision)`
向下取整到指定小数位数
```javascript
calc.floor(10.348, 2); // 10.34
calc.floor(10.9); // 10 (默认取整)
```

### 单位格式化方法

#### `calc.toPercent(number, precision, withSymbol)`
格式化为百分比
```javascript
calc.toPercent(0.1256); // "12.56%"
calc.toPercent(0.1256, 1); // "12.6%"
calc.toPercent(0.1256, 2, false); // 12.56
```

#### `calc.toCurrency(number, currency, precision, thousands)`
格式化为货币格式
```javascript
calc.toCurrency(1234.5); // "¥1,234.50"
calc.toCurrency(1234.5, '$'); // "$1,234.50"
calc.toCurrency(1234.5, '€', 0); // "€1,235"
calc.toCurrency(1234.5, '¥', 2, false); // "¥1234.50"
```

#### `calc.toUnit(number, unit, precision)`
格式化数字，添加单位
```javascript
calc.toUnit(123.456, 'kg'); // "123.46kg"
calc.toUnit(123.456, 'm²', 1); // "123.5m²"
calc.toUnit(0.912, 'L', 3); // "0.912L"
```

#### `calc.toReadable(number, precision, locale)`
智能格式化大数字（自动添加K、M、B等单位）
```javascript
calc.toReadable(1234); // "1.2千"
calc.toReadable(12345); // "1.2万"
calc.toReadable(1234567890); // "12.3亿"
calc.toReadable(1234, 1, 'en'); // "1.2K"
calc.toReadable(1234567, 2, 'en'); // "1.23M"
```

### 特殊格式化方法

#### `calc.toScientific(number, precision)`
科学计数法格式化
```javascript
calc.toScientific(123456); // "1.23e+5"
calc.toScientific(0.00012345, 3); // "1.235e-4"
```

#### `calc.toFraction(number, maxDenominator)`
格式化为分数形式
```javascript
calc.toFraction(0.5); // "1/2"
calc.toFraction(1.25); // "1 1/4"
calc.toFraction(3.333333); // "3 1/3"
```

### 链式调用方法

#### `calc.chain(initialValue)`
创建支持链式调用的计算器实例
```javascript
// 基础链式调用
calc.chain(10).add(5).multiply(2).subtract(3).valueOf(); // 27

// 精度计算链式调用
calc.chain(0.1).add(0.2).multiply(3).round(2).valueOf(); // 0.9

// 链式调用 + 格式化
calc.chain(1234.567).round(2).toCurrency('$'); // "$1,234.57"
```

#### 链式调用支持的方法
- **运算方法**: `add()`, `subtract()`, `multiply()`, `divide()`
- **取整方法**: `round()`, `ceil()`, `floor()`
- **格式化方法**: `toPercent()`, `toCurrency()`, `toUnit()`, `toReadable()`, `toScientific()`, `toFraction()`, `format()`
- **工具方法**: `valueOf()`, `toString()`, `reset()`

```javascript
// 复杂链式调用示例
const result = calc.chain(100)
  .multiply(1.08)     // 应用8%税率
  .add(50)            // 加上手续费
  .divide(3)          // 三等分
  .round(2)           // 保留2位小数
  .valueOf();         // 获取最终值

// 投资收益计算
const profit = calc.chain(10000)
  .multiply(1.08)     // 第一年8%收益
  .multiply(1.08)     // 第二年8%收益
  .multiply(1.08)     // 第三年8%收益
  .subtract(10000)    // 减去本金
  .toCurrency('¥');   // 格式化为人民币
```

### 工具方法

#### `calc.format(number, precision)`
格式化数字，保留指定小数位数
```javascript
calc.format(10/3, 2); // 3.33
calc.format(0.1 + 0.2, 1); // 0.3
```

#### `calc.setPrecision(precision)`
设置默认精度
```javascript
calc.setPrecision(2);
calc.format(10/3); // 3.33
```

#### `calc.getInstance()`
获取计算器实例，用于高级操作
```javascript
const calculator = calc.getInstance();
calculator.setPrecision(4);
```

## 🎯 使用场景

### 1. 财务计算
```javascript
// 价格计算
const price = calc.calculate('19.99 * 1.08'); // 含税价格
const discount = calc.calculate('100 - 15.5'); // 折扣计算
```

### 2. 科学计算
```javascript
// 物理公式
const velocity = calc.calculate('9.8 * 2.5'); // v = gt
const area = calc.calculate('3.14159 * 2.5 * 2.5'); // 圆面积
```

### 3. 数据分析
```javascript
// 统计计算
const average = calc.calculate('(85.5 + 92.3 + 78.9) / 3');
const percentage = calc.calculate('45 / 120 * 100');
```

## 📋 使用场景

- 💰 **金融计算**: 价格计算、利息计算、汇率转换、货币格式化
- 📊 **数据分析**: 统计计算、百分比计算、数据格式化展示
- 🛒 **电商系统**: 购物车总价、折扣计算、价格展示
- 📈 **图表展示**: 精确的数据可视化、智能数字格式化
- 🧮 **科学计算**: 需要高精度的数值计算、科学计数法
- 📋 **报表系统**: 数据格式化、单位转换、可读性优化
- 💹 **投资理财**: 收益率计算、百分比展示、货币格式化
- 🔗 **业务流程**: 复杂计算流程的链式处理，提高代码可读性

## 🔍 精度对比

### JavaScript原生计算问题
```javascript
// 原生JavaScript的精度问题
0.1 + 0.2                    // 0.30000000000000004
0.3 - 0.1                    // 0.19999999999999998
0.2 * 0.2                    // 0.04000000000000001
0.3 / 0.1                    // 2.9999999999999996

// 格式化问题
(0.1256 * 100).toFixed(2) + '%'  // "12.56%" (但计算过程有精度误差)
parseFloat((1234.5).toFixed(2))   // 可能产生精度问题
```

### 使用本工具的精确结果
```javascript
// 使用精度计算工具
calc.add(0.1, 0.2)           // 0.3
calc.subtract(0.3, 0.1)      // 0.2
calc.multiply(0.2, 0.2)      // 0.04
calc.divide(0.3, 0.1)        // 3

// 公式计算
calc.calculate('0.1 + 0.2')  // 0.3
calc.calculate('0.3 - 0.1')  // 0.2

// 精确格式化
calc.toPercent(0.1256)       // "12.56%" (精确计算)
calc.toCurrency(1234.5)      // "¥1,234.50" (精确格式化)
calc.round(10.345, 2)        // 10.35 (精确四舍五入)
```

## 🎨 在线演示

打开 `index.html` 文件可以看到完整的在线演示，包括：

- 基础运算测试
- 公式计算测试
- 批量计算测试
- 精度对比演示
- 使用示例

## 🔧 高级用法

### 批量计算

```javascript
// 批量计算多个表达式
const results = calc.batch([
  '1 + 2 * 3',
  '(4 + 5) / 3',
  '10 - 2.5'
]);
// results: [7, 3, 7.5]
```

### 自定义精度

```javascript
// 设置全局精度
calc.setPrecision(4);
calc.format(1/3); // 0.3333

// 单次计算指定精度
calc.format(1/3, 2); // 0.33
```

### 组合格式化

```javascript
// 先计算，再格式化
const result = calc.calculate('0.1 + 0.2');
calc.toPercent(result, 1); // "30.0%"

// 链式操作
const price = calc.multiply(19.99, 2);
calc.toCurrency(price, '$', 2); // "$39.98"

// 复杂格式化
const value = calc.calculate('1.2 * 3 / 4');
calc.toUnit(calc.round(value, 2), 'm²'); // "0.9m²"
```

### 智能数字格式化

```javascript
// 自动选择合适的单位
calc.toReadable(1200); // "1.2千"
calc.toReadable(1200000); // "1.2百万"

// 不同语言环境
calc.toReadable(1200, 2, 'en'); // "1.20K"
calc.toReadable(1200000, 2, 'en'); // "1.20M"
```

### 链式调用高级用法

```javascript
// 电商价格计算
const finalPrice = calc.chain(99.99)
  .multiply(0.8)        // 8折优惠
  .subtract(10)         // 减10元券
  .multiply(1.13)       // 加13%税
  .round(2)             // 保留2位小数
  .toCurrency('¥');     // 格式化为人民币
// 结果: "¥81.59"

// 投资复利计算
const investment = calc.chain(10000)
  .multiply(1.08)       // 年化8%收益
  .multiply(1.08)       // 第二年
  .multiply(1.08)       // 第三年
  .subtract(10000)      // 减去本金得到收益
  .toPercent(2);        // 转换为收益率百分比

// 数据处理流水线
const processedData = calc.chain(rawValue)
  .multiply(conversionRate)  // 单位转换
  .add(offset)              // 添加偏移量
  .round(precision)         // 精度控制
  .toUnit('kg');            // 添加单位

// 重置和复用
const calculator = calc.chain(0);
calculator.reset(100).add(50).multiply(2); // 300
calculator.reset(200).subtract(50).divide(3); // 50
```

### 创建自定义计算器实例
```javascript
const { PrecisionCalculator } = require('./precision-calculator.js');

const myCalculator = new PrecisionCalculator();
myCalculator.setPrecision(6);

const result = myCalculator.calculate('10 / 3');
console.log(result); // 3.333333
```

### 处理复杂表达式
```javascript
// 支持嵌套括号
calc.calculate('((0.1 + 0.2) * 3 - 0.5) / 2'); // 0.2

// 支持多重负号
calc.calculate('--5 + 3'); // 8
calc.calculate('-(-5 + 3)'); // 2
```

## ⚠️ 注意事项

1. **表达式格式**: 确保表达式格式正确，支持 `+`、`-`、`*`、`/`、`()`
2. **除零检查**: 除法运算会自动检查除数是否为零
3. **精度限制**: 默认精度为10位小数，可通过 `setPrecision()` 调整
4. **性能考虑**: 对于大量计算，建议使用批量计算方法

## 🐛 错误处理

```javascript
try {
    const result = calc.calculate('10 / 0');
} catch (error) {
    console.error('计算错误:', error.message);
}

try {
    const result = calc.calculate('invalid expression');
} catch (error) {
    console.error('表达式错误:', error.message);
}
```

## 环境支持

### 浏览器支持

支持所有现代浏览器，包括：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Node.js 支持

支持 Node.js 12.0.0 及以上版本。

### TypeScript 支持

- TypeScript 4.0+
- 完整的类型定义
- 智能代码提示
- 类型安全保证

## 性能特性 🆕

### 缓存机制
- LRU缓存算法
- 可配置缓存大小
- 自动缓存清理
- 缓存命中率统计

### 算法优化
- 快速幂算法
- 记忆化阶乘
- 优化的GCD/LCM算法
- 性能基准测试

### 内存管理
- 自动垃圾回收
- 内存使用监控
- 资源泄漏防护

## 配置选项 🆕

```javascript
const config = {
  // 精度配置
  precision: {
    default: 2,        // 默认精度
    max: 15,          // 最大精度
    min: 0            // 最小精度
  },
  
  // 舍入配置
  rounding: {
    mode: 'ROUND_HALF_UP',  // 舍入模式
    precision: 2            // 舍入精度
  },
  
  // 错误处理
  errorHandling: {
    mode: 'throw',          // 错误模式
    logErrors: true,        // 记录错误
    throwOnOverflow: true   // 溢出时抛出异常
  },
  
  // 性能配置
  performance: {
    cacheEnabled: true,     // 启用缓存
    cacheSize: 1000,       // 缓存大小
    memoizeFactorial: true, // 记忆化阶乘
    benchmarkEnabled: false // 启用基准测试
  },
  
  // 日志配置
  logging: {
    enabled: true,          // 启用日志
    level: 'INFO',         // 日志级别
    logOperations: false,   // 记录操作
    maxLogs: 1000          // 最大日志数
  },
  
  // 验证配置
  validation: {
    strictMode: false,      // 严格模式
    allowInfinite: false,   // 允许无穷大
    allowNaN: false        // 允许NaN
  },
  
  // 国际化配置
  i18n: {
    locale: 'zh-CN',       // 语言环境
    fallbackLocale: 'en-US', // 备用语言
    dateFormat: 'YYYY-MM-DD', // 日期格式
    timeFormat: 'HH:mm:ss'   // 时间格式
  }
};
```

## 更新日志 🆕

### v1.1.0 (最新)
- ✅ 新增配置管理系统
- ✅ 新增国际化支持（中文、英文、日文）
- ✅ 新增性能优化功能（缓存、记忆化、快速算法）
- ✅ 新增日志记录和监控
- ✅ 新增增强测试套件和基准测试
- ✅ 新增自定义错误类型和输入验证
- ✅ 增强TypeScript类型定义
- ✅ 优化代码结构和模块化

### v1.0.0
- ✅ 基础数学运算功能
- ✅ 链式调用支持
- ✅ 批量计算功能
- ✅ 格式化功能
- ✅ TypeScript支持
- ✅ 浏览器和Node.js兼容

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/your-username/precision-calculator.git
cd precision-calculator

# 安装依赖（如果有）
npm install

# 运行测试
npm test
npm run test:enhanced

# 运行基准测试
npm run benchmark
```

## 📄 许可证

MIT License - 可自由使用、修改和分发。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个工具！

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看本文档的示例
2. 运行 `index.html` 中的测试用例
3. 检查浏览器控制台的错误信息

---

**让JavaScript数值计算更精确！** 🎯