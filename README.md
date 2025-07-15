# Precision Calculator

一个专门解决 JavaScript 浮点数精度问题的高精度计算工具库。

## 📦 安装

### NPM 安装

```bash
npm install mathfix
```

### 直接下载

下载 `mathfix.js` 文件直接使用。

## 🚀 快速开始

### ES 模块导入 (推荐)

在现代前端项目（如 Vue、React）或 Node.js 中，推荐使用 ES 模块导入。

```javascript
// 导入核心计算对象
import { calc, rawCalc } from "mathfix";

// 基础运算（应用全局配置的精度）
console.log(calc.add(0.1, 0.2)); // 0.3
console.log(calc.subtract(0.3, 0.1)); // 0.2
console.log(calc.multiply(0.2, 3)); // 0.6
console.log(calc.divide(0.3, 0.1)); // 3

// 原始计算（不经过全局配置处理）
console.log(rawCalc.divide(1, 3)); // 0.3333333333333333 (完整精度)
console.log(calc.divide(1, 3)); // 根据setConfig配置的精度显示

// 对比原始值和配置处理后的值
import { setConfig } from "mathfix";
setConfig({ precision: { default: 4 } });
console.log('原始值:', rawCalc.divide(1, 3)); // 0.3333333333333333
console.log('配置后:', calc.divide(1, 3)); // 0.3333

// 也可以导入其他模块
import { PrecisionCalculator, ChainableCalculator } from "mathfix";
```

### 多种导入方式支持

```javascript
// 方式1: 命名导入 (推荐)
import { calc, PrecisionCalculator, batch } from "mathfix";

// 方式2: 默认导入
import precisionCalc from "mathfix";
const calculator = new precisionCalc.PrecisionCalculator();

// 方式3: 混合导入
import defaultExport, { ChainableCalculator } from "mathfix";

// 方式4: 命名空间导入
import * as PC from "mathfix";
const calc = new PC.PrecisionCalculator();

// 方式5: 重命名导入
import { PrecisionCalculator as Calculator, calc as mathCalc } from "mathfix";

// 方式6: 动态导入
const { PrecisionCalculator } = await import("mathfix");
```

### CommonJS 导入

```javascript
const { calc } = require("mathfix");
// 或者导入其他类: const { PrecisionCalculator, ChainableCalculator } = require('mathfix');

// 基础运算
console.log(calc.add(0.1, 0.2)); // 0.3
console.log(calc.subtract(0.3, 0.1)); // 0.2
console.log(calc.multiply(0.2, 3)); // 0.6
console.log(calc.divide(0.3, 0.1)); // 3

// 数学运算
console.log(calc.sqrt(25)); // 5
console.log(calc.pow(2, 3)); // 8
console.log(calc.factorial(5)); // 120

// 链式调用
const result = calc.chain(100).add(50).multiply(1.08).round(2).valueOf();
console.log(result); // 162
```

### 增强功能使用

```javascript
const {
  EnhancedCalculator,
  setConfig,
  setLocale,
  batch,
  getPerformanceMetrics,
} = require("mathfix");

// 1. 配置管理
setConfig({
  precision: { default: 4 },
  performance: { cacheEnabled: true },
  logging: { enabled: true },
});

// 2. 增强计算器
const calc = new EnhancedCalculator();
console.log(calc.add(0.1, 0.2)); // 0.3
console.log(calc.formatCurrency(1234.56, "$")); // $1,234.56
console.log(calc.formatPercentage(0.1234)); // 12.34%

// 3. 链式调用
const result = calc.chain(100).add(50).multiply(2).divide(3).result();
console.log(result); // 100

// 4. 批量计算
const numbers = [1, 2, 3, 4, 5];
const squares = batch(numbers, "square");
console.log(squares); // [1, 4, 9, 16, 25]

// 5. 国际化
setLocale("zh-CN");
console.log(calc.formatCurrency(1234.56, "¥")); // ¥1,234.56

// 6. 性能监控
const metrics = getPerformanceMetrics();
console.log(`操作次数: ${metrics.operationCount}`);
console.log(`缓存命中率: ${(metrics.cacheHitRate * 100).toFixed(2)}%`);
```

### TypeScript 环境

```typescript
import { calc, PrecisionCalculator, ChainableCalculator } from "mathfix";

// 类型安全的基础运算
const sum: number = calc.add(0.1, 0.2); // 0.3
const difference: number = calc.subtract(0.3, 0.1); // 0.2
const product: number = calc.multiply(0.2, 3); // 0.6
const quotient: number = calc.divide(0.3, 0.1); // 3

// 数学运算
const sqrt: number = calc.sqrt(25); // 5
const power: number = calc.pow(2, 3); // 8
const factorial: number = calc.factorial(5); // 120

// 格式化（返回字符串）
const percentage: string = calc.toPercent(0.1256, 2); // "12.56%"
const currency: string = calc.toCurrency(1234.56, "$"); // "$1,234.56"

// 链式调用
const result: number = calc
  .chain(100)
  .add(50)
  .multiply(1.08)
  .round(2)
  .valueOf();
console.log(result); // 162

// 使用类实例
const calculator = new PrecisionCalculator(4);
const precise: number = calculator.add(0.1, 0.2);
```

### 浏览器环境

```html
<script src="mathfix.js"></script>
<script>
  console.log(calc.add(0.1, 0.2)); // 0.3
  console.log(calc.multiply(0.1, 3)); // 0.3

  // 使用链式调用
  const result = calc.chain(100).add(50).multiply(1.08).valueOf();
</script>
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

### 增强功能 API

#### 配置管理

```javascript
// 设置配置
setConfig({
  precision: { default: 4, max: 10, min: 0 },
  errorHandling: { mode: "throw", logErrors: true },
  performance: { cacheEnabled: true, cacheSize: 1000 },
  logging: { enabled: true, level: "INFO" },
});

// 获取配置
const precision = getConfig("precision.default", 2);
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

#### 原始值计算 (rawCalc)

`rawCalc` 提供不经过全局配置处理的原始计算结果，适用于需要完整精度或自定义精度控制的场景。

```javascript
import { calc, rawCalc, setConfig } from "mathfix";

// 设置全局精度配置
setConfig({ precision: { default: 4 } });

// 对比原始值和配置处理后的值
console.log('原始值:', rawCalc.divide(1, 3)); // 0.3333333333333333
console.log('配置后:', calc.divide(1, 3)); // 0.3333

// 原始值适用场景
// 1. 需要完整精度的科学计算
const preciseResult = rawCalc.divide(22, 7); // 3.142857142857143

// 2. 中间计算保持精度，最终结果再格式化
const intermediate = rawCalc.multiply(rawCalc.divide(1, 3), 3); // 1
const formatted = calc.format(intermediate, 2); // 1.00

// 3. 自定义精度控制
const customPrecision = rawCalc.format(rawCalc.divide(1, 3), 6); // 0.333333

// 4. 避免配置影响的独立计算
const independent = rawCalc.add(0.1, 0.2); // 0.30000000000000004 (原始JavaScript结果)
const corrected = calc.add(0.1, 0.2); // 0.3 (精度修正后)
```

#### 链式计算器

```javascript
const result = calc
  .chain(100)
  .setPrecision(2)
  .add(50)
  .multiply(2)
  .divide(3)
  .round()
  .result(); // 获取最终结果

// 格式化输出
const currency = calc.chain(1234.56).multiply(1.1).toCurrency("$", 2); // "$1,358.02"

const percentage = calc.chain(0.1234).multiply(100).toPercentage(1); // "12.3%"
```

#### 批量计算

```javascript
// 批量运算
const numbers = [1, 2, 3, 4, 5];
const results = batch(numbers, "square", 2); // [1, 4, 9, 16, 25]
const sums = batch(numbers, "add", 2, 10); // [11, 12, 13, 14, 15]
```

#### 性能监控

```javascript
// 获取性能指标
const metrics = getPerformanceMetrics();
console.log({
  operationCount: metrics.operationCount,
  totalTime: metrics.totalTime,
  averageTime: metrics.averageTime,
  cacheHitRate: metrics.cacheHitRate,
});

// 缓存统计
const stats = getCacheStats();
console.log({
  size: stats.size,
  hits: stats.hits,
  misses: stats.misses,
  hitRate: stats.hitRate,
});

// 清理缓存
clearCache();
```

#### 国际化

```javascript
// 设置语言
setLocale("zh-CN"); // 中文
setLocale("en-US"); // 英文
setLocale("ja-JP"); // 日文

// 本地化格式化
const calc = new EnhancedCalculator({ locale: "zh-CN" });
console.log(calc.formatCurrency(1234.56, "¥")); // ¥1,234.56
```

### 公式计算方法

#### `calc.calculate(expression)`

计算数学表达式

```javascript
// 基础运算
calc.calculate("0.1 + 0.2"); // 0.3
calc.calculate("0.1 * 3"); // 0.3

// 负号支持
calc.calculate("-5 + 3"); // -2
calc.calculate("-(5 + 3) * 2"); // -16
calc.calculate("10 + -5"); // 5

// 复杂表达式
calc.calculate("(0.1 + 0.2) * 3 - 0.5"); // 0.4
calc.calculate("10 / 3 + 0.1"); // 3.4333333333
```

#### `calc.batch(expressions)`

批量计算多个表达式

```javascript
const results = calc.batch(["0.1 + 0.2", "0.1 * 3", "10 / 3"]);
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
calc.toCurrency(1234.5, "$"); // "$1,234.50"
calc.toCurrency(1234.5, "€", 0); // "€1,235"
calc.toCurrency(1234.5, "¥", 2, false); // "¥1234.50"
```

#### `calc.toUnit(number, unit, precision)`

格式化数字，添加单位

```javascript
calc.toUnit(123.456, "kg"); // "123.46kg"
calc.toUnit(123.456, "m²", 1); // "123.5m²"
calc.toUnit(0.912, "L", 3); // "0.912L"
```

#### `calc.toReadable(number, precision, locale)`

智能格式化大数字（自动添加 K、M、B 等单位）

```javascript
calc.toReadable(1234); // "1.2千"
calc.toReadable(12345); // "1.2万"
calc.toReadable(1234567890); // "12.3亿"
calc.toReadable(1234, 1, "en"); // "1.2K"
calc.toReadable(1234567, 2, "en"); // "1.23M"
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
calc.chain(1234.567).round(2).toCurrency("$"); // "$1,234.57"
```

#### 链式调用支持的方法

- **运算方法**: `add()`, `subtract()`, `multiply()`, `divide()`
- **取整方法**: `round()`, `ceil()`, `floor()`
- **格式化方法**: `toPercent()`, `toCurrency()`, `toUnit()`, `toReadable()`, `toScientific()`, `toFraction()`, `format()`
- **工具方法**: `valueOf()`, `toString()`, `reset()`

```javascript
// 复杂链式调用示例
const result = calc
  .chain(100)
  .multiply(1.08) // 应用8%税率
  .add(50) // 加上手续费
  .divide(3) // 三等分
  .round(2) // 保留2位小数
  .valueOf(); // 获取最终值

// 投资收益计算
const profit = calc
  .chain(10000)
  .multiply(1.08) // 第一年8%收益
  .multiply(1.08) // 第二年8%收益
  .multiply(1.08) // 第三年8%收益
  .subtract(10000) // 减去本金
  .toCurrency("¥"); // 格式化为人民币
```

### 工具方法

#### `calc.format(number, precision)`

格式化数字，保留指定小数位数

```javascript
calc.format(10 / 3, 2); // 3.33
calc.format(0.1 + 0.2, 1); // 0.3
```

#### `calc.setPrecision(precision)`

设置默认精度

```javascript
calc.setPrecision(2);
calc.format(10 / 3); // 3.33
```

## 🔍 精度对比

### JavaScript 原生计算问题

```javascript
// 原生JavaScript的精度问题
0.1 + 0.2; // 0.30000000000000004
0.3 - 0.1; // 0.19999999999999998
0.2 * 0.2; // 0.04000000000000001
0.3 / 0.1; // 2.9999999999999996

// 格式化问题
(0.1256 * 100).toFixed(2) + "%"; // "12.56%" (但计算过程有精度误差)
parseFloat((1234.5).toFixed(2)); // 可能产生精度问题
```

### 使用本工具的精确结果

```javascript
// 使用精度计算工具
calc.add(0.1, 0.2); // 0.3
calc.subtract(0.3, 0.1); // 0.2
calc.multiply(0.2, 0.2); // 0.04
calc.divide(0.3, 0.1); // 3

// 公式计算
calc.calculate("0.1 + 0.2"); // 0.3
calc.calculate("0.3 - 0.1"); // 0.2

// 精确格式化
calc.toPercent(0.1256); // "12.56%" (精确计算)
calc.toCurrency(1234.5); // "¥1,234.50" (精确格式化)
calc.round(10.345, 2); // 10.35 (精确四舍五入)
```

## 🔧 高级用法

### 批量计算

```javascript
// 批量计算多个表达式
const results = calc.batch(["1 + 2 * 3", "(4 + 5) / 3", "10 - 2.5"]);
// results: [7, 3, 7.5]
```

### 自定义精度

```javascript
// 设置全局精度
calc.setPrecision(4);
calc.format(1 / 3); // 0.3333

// 单次计算指定精度
calc.format(1 / 3, 2); // 0.33
```

### 组合格式化

```javascript
// 先计算，再格式化
const result = calc.calculate("0.1 + 0.2");
calc.toPercent(result, 1); // "30.0%"

// 链式操作
const price = calc.multiply(19.99, 2);
calc.toCurrency(price, "$", 2); // "$39.98"

// 复杂格式化
const value = calc.calculate("1.2 * 3 / 4");
calc.toUnit(calc.round(value, 2), "m²"); // "0.9m²"
```

### 智能数字格式化

```javascript
// 自动选择合适的单位
calc.toReadable(1200); // "1.2千"
calc.toReadable(1200000); // "1.2百万"

// 不同语言环境
calc.toReadable(1200, 2, "en"); // "1.20K"
calc.toReadable(1200000, 2, "en"); // "1.20M"
```

### 链式调用高级用法

```javascript
// 电商价格计算
const finalPrice = calc
  .chain(99.99)
  .multiply(0.8) // 8折优惠
  .subtract(10) // 减10元券
  .multiply(1.13) // 加13%税
  .round(2) // 保留2位小数
  .toCurrency("¥"); // 格式化为人民币
// 结果: "¥81.59"

// 投资复利计算
const investment = calc
  .chain(10000)
  .multiply(1.08) // 年化8%收益
  .multiply(1.08) // 第二年
  .multiply(1.08) // 第三年
  .subtract(10000) // 减去本金得到收益
  .toPercent(2); // 转换为收益率百分比

// 数据处理流水线
const processedData = calc
  .chain(rawValue)
  .multiply(conversionRate) // 单位转换
  .add(offset) // 添加偏移量
  .round(precision) // 精度控制
  .toUnit("kg"); // 添加单位

// 重置和复用
const calculator = calc.chain(0);
calculator.reset(100).add(50).multiply(2); // 300
calculator.reset(200).subtract(50).divide(3); // 50
```

### 创建自定义计算器实例

```javascript
const { PrecisionCalculator } = require("./mathfix.js");

const myCalculator = new PrecisionCalculator();
myCalculator.setPrecision(6);

const result = myCalculator.calculate("10 / 3");
console.log(result); // 3.333333
```

### 处理复杂表达式

```javascript
// 支持嵌套括号
calc.calculate("((0.1 + 0.2) * 3 - 0.5) / 2"); // 0.2

// 支持多重负号
calc.calculate("--5 + 3"); // 8
calc.calculate("-(-5 + 3)"); // 2
```

## ⚠️ 注意事项

1. **表达式格式**: 确保表达式格式正确，支持 `+`、`-`、`*`、`/`、`()`
2. **除零检查**: 除法运算会自动检查除数是否为零
3. **精度限制**: 默认精度为 10 位小数，可通过 `setPrecision()` 调整
4. **性能考虑**: 对于大量计算，建议使用批量计算方法

## 🐛 错误处理

```javascript
try {
  const result = calc.calculate("10 / 0");
} catch (error) {
  console.error("计算错误:", error.message);
}

try {
  const result = calc.calculate("invalid expression");
} catch (error) {
  console.error("表达式错误:", error.message);
}
```
