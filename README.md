# MathFix

一个专门解决 JavaScript 浮点数精度问题的数学计算库，提供精确的数学运算和丰富的高级数学函数。

## 特性

- ✅ **精确计算**：完全解决 JavaScript 浮点数精度问题
- ✅ **丰富功能**：提供基础运算、高级数学函数、统计函数等
- ✅ **链式调用**：支持现代化的链式调用语法
- ✅ **TypeScript 支持**：完整的类型定义
- ✅ **多模块格式**：支持 CommonJS 和 ES Module
- ✅ **浏览器兼容**：可直接在浏览器中使用

## 安装

```bash
npm install mathfix
```

## 快速开始

### 基础使用

```javascript
const MathFix = require('mathfix');

// 解决浮点数精度问题
console.log(0.1 + 0.2);                    // 0.30000000000000004
console.log(MathFix.add(0.1, 0.2));        // 0.3

console.log(0.3 - 0.1);                    // 0.19999999999999998
console.log(MathFix.subtract(0.3, 0.1));   // 0.2

console.log(0.1 * 0.2);                    // 0.020000000000000004
console.log(MathFix.multiply(0.1, 0.2));   // 0.02

console.log(0.3 / 0.1);                    // 2.9999999999999996
console.log(MathFix.divide(0.3, 0.1));     // 3
```

### ES Module 使用

```javascript
import MathFix from 'mathfix/mathfix.mjs';
// 或者
import { add, subtract, multiply, divide } from 'mathfix/mathfix.mjs';

const result = add(0.1, 0.2); // 0.3
```

## API 文档

### 基础运算

#### `add(a, b)` - 加法
```javascript
MathFix.add(0.1, 0.2);        // 0.3
MathFix.add(1.1, 2.2);        // 3.3
```

#### `subtract(a, b)` - 减法
```javascript
MathFix.subtract(0.3, 0.1);   // 0.2
MathFix.subtract(3.3, 1.1);   // 2.2
```

#### `multiply(a, b)` - 乘法
```javascript
MathFix.multiply(0.1, 0.2);   // 0.02
MathFix.multiply(1.23, 4.56); // 5.6088
```

#### `divide(a, b)` - 除法
```javascript
MathFix.divide(0.3, 0.1);     // 3
MathFix.divide(1, 3);         // 0.3333333333333333
```

#### `round(num, precision)` - 四舍五入
```javascript
MathFix.round(3.14159, 2);    // 3.14
MathFix.round(3.14159, 4);    // 3.1416
```

#### `format(num)` - 格式化数字
```javascript
MathFix.format(0.30000000000000004); // "0.3"
```

### 高级数学函数

#### `power(base, exponent)` - 幂运算
```javascript
MathFix.power(2, 3);          // 8
MathFix.power(1.1, 2);        // 1.21
MathFix.power(4, 0.5);        // 2
```

#### `sqrt(num, precision)` - 开方
```javascript
MathFix.sqrt(9);              // 3
MathFix.sqrt(8, 3);           // 2
MathFix.sqrt(16);             // 4
```

#### `percentage(total, percent)` - 百分比计算
```javascript
MathFix.percentage(200, 15);  // 30 (200的15%)
```

#### `percentageChange(oldValue, newValue)` - 百分比变化
```javascript
MathFix.percentageChange(100, 120); // 20 (增长20%)
MathFix.percentageChange(120, 100); // -16.666666666666664 (减少16.67%)
```

#### `compoundInterest(principal, rate, time, frequency)` - 复利计算
```javascript
// 本金1000，年利率5%，3年
MathFix.compoundInterest(1000, 0.05, 3);     // 1157.625

// 本金1000，年利率5%，3年，每年复利4次
MathFix.compoundInterest(1000, 0.05, 3, 4);  // 1160.75451772
```

### 数组统计函数

#### `sum(numbers)` - 求和
```javascript
MathFix.sum([1.1, 2.2, 3.3, 4.4, 5.5]); // 16.5
```

#### `average(numbers)` - 平均值
```javascript
MathFix.average([1.1, 2.2, 3.3, 4.4, 5.5]); // 3.3
```

#### `max(numbers)` - 最大值
```javascript
MathFix.max([1.1, 2.2, 3.3, 4.4, 5.5]); // 5.5
```

#### `min(numbers)` - 最小值
```javascript
MathFix.min([1.1, 2.2, 3.3, 4.4, 5.5]); // 1.1
```

### 数学工具函数

#### `abs(num)` - 绝对值
```javascript
MathFix.abs(-3.14);           // 3.14
```

#### `ceil(num)` - 向上取整
```javascript
MathFix.ceil(3.14);           // 4
```

#### `floor(num)` - 向下取整
```javascript
MathFix.floor(3.14);          // 3
```

## 链式调用

MathFix 支持现代化的链式调用语法，让复杂的数学计算更加直观和简洁。

### 基础链式调用

```javascript
// 使用 chain() 函数
const result = MathFix.chain(10)
  .add(5)        // 15
  .multiply(2)   // 30
  .subtract(5)   // 25
  .divide(5)     // 5
  .valueOf();    // 获取最终结果

console.log(result); // 5
```

### 精度修复示例

```javascript
// 链式调用自动修复浮点数精度问题
const precise = MathFix.chain(0.1)
  .add(0.2)      // 0.3 (而不是 0.30000000000000004)
  .multiply(10)  // 3 (而不是 3.0000000000000004)
  .valueOf();

// 对比原生计算
const native = (0.1 + 0.2) * 10; // 3.0000000000000004

console.log('链式调用结果:', precise); // 3
console.log('原生计算结果:', native);   // 3.0000000000000004
```

### 高级数学函数链式调用

```javascript
// 复杂的数学计算
const result = MathFix.chain(4)
  .power(2)      // 16 (4的平方)
  .sqrt()        // 4 (16的平方根)
  .abs()         // 4 (绝对值)
  .round(2)      // 4 (保留2位小数)
  .valueOf();

console.log(result); // 4
```

### 格式化链式调用

```javascript
// 计算并格式化结果
const formatted = MathFix.chain(3.14159)
  .multiply(2)   // 6.28318
  .round(3)      // 6.283
  .format();     // "6.283"

console.log(formatted); // "6.283"
```

### 多种创建方式

```javascript
// 方式1: 使用 chain() 函数
const result1 = MathFix.chain(10).add(5).valueOf();

// 方式2: 使用 MathFixChain 类
const result2 = new MathFix.MathFixChain(10).add(5).valueOf();

// 方式3: 使用静态方法
const result3 = MathFix.MathFixChain.chain(10).add(5).valueOf();

// 所有方式结果相同
console.log(result1, result2, result3); // 15 15 15
```

### 支持的链式方法

- **基础运算**: `add()`, `subtract()`, `multiply()`, `divide()`
- **高级数学**: `power()`, `sqrt()`, `abs()`, `ceil()`, `floor()`
- **格式化**: `round()`, `format()`
- **结果获取**: `valueOf()`, `toString()`

## 工具函数

### `getDecimalPlaces(num)` - 获取小数位数
```javascript
MathFix.getDecimalPlaces(3.14159); // 5
MathFix.getDecimalPlaces(100);     // 0
MathFix.getDecimalPlaces(0.1);     // 1
```

## 浏览器使用

```html
<script src="path/to/mathfix.js"></script>
<script>
  console.log(MathFix.add(0.1, 0.2)); // 0.3
  
  // 链式调用
  const result = MathFix.chain(10)
    .add(5)
    .multiply(2)
    .valueOf();
  console.log(result); // 30
</script>
```

## TypeScript 支持

MathFix 提供完整的 TypeScript 类型定义：

```typescript
import MathFix from 'mathfix';

// 所有方法都有完整的类型提示
const result: number = MathFix.add(1.1, 2.2);

// 链式调用也有类型支持
const chainResult: number = MathFix.chain(10)
  .add(5)
  .multiply(2)
  .valueOf();
```

## 为什么选择 MathFix？

### JavaScript 浮点数问题

JavaScript 中的浮点数运算存在精度问题：

```javascript
console.log(0.1 + 0.2);   // 0.30000000000000004 ❌
console.log(0.3 - 0.1);   // 0.19999999999999998 ❌
console.log(0.1 * 0.2);   // 0.020000000000000004 ❌
console.log(0.3 / 0.1);   // 2.9999999999999996 ❌
```

### MathFix 解决方案

```javascript
console.log(MathFix.add(0.1, 0.2));      // 0.3 ✅
console.log(MathFix.subtract(0.3, 0.1)); // 0.2 ✅
console.log(MathFix.multiply(0.1, 0.2)); // 0.02 ✅
console.log(MathFix.divide(0.3, 0.1));   // 3 ✅
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！