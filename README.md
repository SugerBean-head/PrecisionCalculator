# MathFix

一个专门解决 JavaScript 浮点数精度问题的数学计算库，提供精确的数学运算和丰富的高级数学函数。

## 目录

- [特性](#特性)
- [安装](#安装)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
  - [基础运算](#基础运算)
  - [高级数学函数](#高级数学函数)
  - [数组统计函数](#数组统计函数)
  - [数学工具函数](#数学工具函数)
- [全局配置](#全局配置)
  - [单位和格式化功能](#单位和格式化功能)
  - [中文数字转换功能](#中文数字转换功能)
  - [人民币大写转换功能](#人民币大写转换功能)
  - [单位和格式化工具函数](#单位和格式化工具函数)
  - [全局单位配置](#全局单位配置)
- [链式调用](#链式调用)
- [工具函数](#工具函数)
- [浏览器使用](#浏览器使用)
- [TypeScript 支持](#typescript-支持)
- [为什么选择 MathFix](#为什么选择-mathfix)
- [许可证](#许可证)
- [贡献](#贡献)

## 特性

- ✅ **精确计算**：完全解决 JavaScript 浮点数精度问题
- ✅ **丰富功能**：提供基础运算、高级数学函数、统计函数等
- ✅ **单位格式化**：支持货币、单位等格式化功能
- ✅ **中文数字转换**：支持阿拉伯数字转中文数字
- ✅ **人民币大写转换**：支持数字转人民币大写格式
- ✅ **大写转换**：支持字符串大写转换功能
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

### 单位和格式化功能

```javascript
// 单位格式化
MathFix.format(1234.56, { unit: "元", unitPosition: "suffix" });   // "1234.56元"
MathFix.format(1234.56, { unit: "$", unitPosition: "prefix" });    // "$1234.56"

// 中文数字转换
MathFix.toChineseNumber(1234);                                     // "一千二百三十四"
MathFix.format(1234, { chineseNumber: true, unit: "元" });         // "一千二百三十四元"

// 人民币大写转换
MathFix.toChineseCapital(1234.56);                                 // "壹仟贰佰叁拾肆元伍角陆分"
MathFix.format(1234.56, { chineseCapital: true });                 // "壹仟贰佰叁拾肆元伍角陆分"

// 大写转换
MathFix.format(1234.56, { uppercase: true, unit: "usd" });         // "1234.56USD"
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

#### `toChineseNumber(num)` - 中文数字转换
```javascript
MathFix.toChineseNumber(1234);                                     // "一千二百三十四"
MathFix.toChineseNumber(10203);                                    // "一万零二百零三"
MathFix.toChineseNumber(50607);                                    // "五万零六百零七"
```

#### `toChineseCapital(num)` - 人民币大写转换
```javascript
MathFix.toChineseCapital(1234.56);                                 // "壹仟贰佰叁拾肆元伍角陆分"
MathFix.toChineseCapital(10203.07);                                // "壹万零贰佰零叁元零角柒分"
MathFix.toChineseCapital(0.05);                                    // "零元零角伍分"
MathFix.toChineseCapital(1000000);                                 // "壹佰万元整"
```

#### `addUnitAndFormat(num, options)` - 单位和格式化
```javascript
// 复杂的格式化需求
MathFix.addUnitAndFormat(1234, { 
  chineseNumber: true, 
  unit: "元", 
  unitPosition: "suffix" 
});                                                                 // "一千二百三十四元"

MathFix.addUnitAndFormat(5678, { 
  chineseNumber: true, 
  uppercase: true, 
  unit: "圆", 
  unitPosition: "suffix" 
});                                                                 // "五千六百七十八圆"
```

## 全局配置

MathFix 支持全局配置，可以设置默认的小数位数和千分位分隔符。

### 配置选项

```javascript
// 获取当前配置
const config = MathFix.getConfig();
console.log(config);
// {
//   defaultPrecision: 2,           // 默认小数位数
//   thousandsSeparator: false,     // 是否启用千分位分隔符
//   thousandsSeparatorChar: ',',   // 千分位分隔符字符
//   decimalSeparator: '.',         // 小数点字符
//   unit: '',                      // 单位
//   unitPosition: 'suffix',        // 单位位置 ('prefix' | 'suffix')
//   uppercase: false,              // 是否转换为大写
//   chineseNumber: false           // 是否转换为中文数字
// }

// 设置配置
MathFix.setConfig({
  defaultPrecision: 4,           // 设置默认保留4位小数
  thousandsSeparator: true,      // 启用千分位分隔符
  thousandsSeparatorChar: ',',   // 使用逗号作为千分位分隔符
  decimalSeparator: '.',         // 使用点作为小数点
  unit: '元',                    // 设置单位
  unitPosition: 'suffix',        // 单位位置（后缀）
  uppercase: false,              // 不转换为大写
  chineseNumber: false           // 不转换为中文数字
});
```

### 默认精度配置

```javascript
// 设置默认精度为3位小数
MathFix.setConfig({ defaultPrecision: 3 });

// round函数会使用默认精度
MathFix.round(3.14159);        // 3.142 (使用默认精度3)
MathFix.round(3.14159, 2);     // 3.14 (显式指定精度2)
```

### 千分位分隔符配置

```javascript
// 启用千分位分隔符
MathFix.setConfig({ 
  thousandsSeparator: true,
  defaultPrecision: 2 
});

// format函数会使用全局配置
MathFix.format(1234567.89);    // "1,234,567.89"

// 可以通过options参数覆盖全局配置
MathFix.format(1234567.89, { 
  precision: 4,                 // 覆盖默认精度
  thousandsSeparator: false     // 覆盖千分位设置
}); // "1234567.89"
```

### 自定义分隔符

```javascript
// 使用空格作为千分位分隔符，逗号作为小数点
MathFix.setConfig({
  thousandsSeparator: true,
  thousandsSeparatorChar: ' ',   // 空格分隔
  decimalSeparator: ','          // 逗号小数点
});

MathFix.format(1234567.89);     // "1 234 567,89"
```

### 千分位分隔符工具函数

```javascript
// 直接为数字字符串添加千分位分隔符
MathFix.addThousandsSeparator("1234567.89");  // "1,234,567.89"
MathFix.addThousandsSeparator("1000000");     // "1,000,000"
```

### 单位和格式化功能

```javascript
// 基础单位功能
MathFix.format(1234.56, { unit: "元", unitPosition: "suffix" });   // "1234.56元"
MathFix.format(1234.56, { unit: "$", unitPosition: "prefix" });    // "$1234.56"

// 大写转换功能
MathFix.format(1234.56, { uppercase: true });                      // "1234.56"
MathFix.format(1234.56, { 
  uppercase: true, 
  unit: "usd", 
  unitPosition: "suffix" 
});                                                                 // "1234.56USD"

// 组合功能
MathFix.format(1234.56, { 
  thousandsSeparator: true, 
  unit: "元", 
  unitPosition: "suffix" 
});                                                                 // "1,234.56元"

MathFix.format(1234.56, { 
  thousandsSeparator: true, 
  uppercase: true, 
  unit: "usd", 
  unitPosition: "prefix" 
});                                                                 // "USD1,234.56"
```

### 中文数字转换功能

```javascript
// 中文数字转换
MathFix.toChineseNumber(1234);                                     // "一千二百三十四"
MathFix.toChineseNumber(10203);                                    // "一万零二百零三"
MathFix.toChineseNumber(50607);                                    // "五万零六百零七"

// 在format函数中使用中文数字
MathFix.format(1234, { chineseNumber: true });                     // "一千二百三十四"
MathFix.format(1234, { 
  chineseNumber: true, 
  unit: "元", 
  unitPosition: "suffix" 
});                                                                 // "一千二百三十四元"

// 中文数字与大写组合
MathFix.format(1234, { 
  chineseNumber: true, 
  uppercase: true, 
  unit: "元", 
  unitPosition: "suffix" 
});                                                                 // "一千二百三十四元"
```

### 人民币大写转换功能

```javascript
// 人民币大写转换
MathFix.toChineseCapital(1234.56);                                 // "壹仟贰佰叁拾肆元伍角陆分"
MathFix.toChineseCapital(10203.07);                                // "壹万零贰佰零叁元零角柒分"
MathFix.toChineseCapital(0.05);                                    // "零元零角伍分"
MathFix.toChineseCapital(1000000);                                 // "壹佰万元整"

// 在format函数中使用人民币大写
MathFix.format(1234.56, { chineseCapital: true });                 // "壹仟贰佰叁拾肆元伍角陆分"
MathFix.format(10203.07, { chineseCapital: true });                // "壹万零贰佰零叁元零角柒分"

// 特殊情况处理
MathFix.toChineseCapital(0);                                       // "零元整"
MathFix.toChineseCapital(0.1);                                     // "零元壹角"
MathFix.toChineseCapital(0.01);                                    // "零元零角壹分"
```

### 单位和格式化工具函数

```javascript
// addUnitAndFormat 函数用于复杂的格式化需求
MathFix.addUnitAndFormat(1234, { 
  chineseNumber: true, 
  unit: "元", 
  unitPosition: "suffix" 
});                                                                 // "一千二百三十四元"

MathFix.addUnitAndFormat(5678, { 
  chineseNumber: true, 
  uppercase: true, 
  unit: "圆", 
  unitPosition: "suffix" 
});                                                                 // "五千六百七十八圆"
```

### 全局单位配置

```javascript
// 设置全局单位配置
MathFix.setConfig({
  unit: "¥",
  unitPosition: "prefix",
  uppercase: true,
  thousandsSeparator: true
});

// 使用全局配置
MathFix.format(1234.56);                                           // "¥1,234.56"

// 覆盖全局配置
MathFix.format(9876.54, { 
  unit: "€", 
  unitPosition: "suffix", 
  uppercase: false 
});                                                                 // "9,876.54€"
```

### 在链式调用中使用配置

```javascript
// 设置全局配置
MathFix.setConfig({ 
  thousandsSeparator: true,
  defaultPrecision: 2 
});

// 链式调用会使用全局配置
const result = MathFix.chain(1000)
  .multiply(1234.567)
  .add(89.123)
  .round()                      // 使用默认精度2
  .valueOf();                   // 1234656.12

// 在链式调用中格式化
const formatted = MathFix.chain(1000)
  .multiply(1234.567)
  .add(89.123)
  .format({ precision: 3, thousandsSeparator: true })
  .toString();                  // "1,234,656.123"
```

### ES Module 中的配置

```javascript
import { setConfig, getConfig, format } from './mathfix.mjs';

// 设置配置
setConfig({ defaultPrecision: 4, thousandsSeparator: true });

// 使用配置
const result = format(1234567.89);  // "1,234,567.89"
```

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