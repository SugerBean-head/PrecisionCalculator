/**
 * MathFix 使用示例
 * 演示如何解决JavaScript浮点数计算精度问题
 */

const MathFix = require('./mathfix.js');

console.log('=== JavaScript浮点数精度问题演示 ===');
console.log('原生计算结果:');
console.log('0.1 + 0.2 =', 0.1 + 0.2); // 0.30000000000000004
console.log('0.3 - 0.1 =', 0.3 - 0.1); // 0.19999999999999998
console.log('0.1 * 0.2 =', 0.1 * 0.2); // 0.020000000000000004
console.log('0.3 / 0.1 =', 0.3 / 0.1); // 2.9999999999999996

console.log('\n=== 使用MathFix修复后的结果 ===');
console.log('精确计算结果:');
console.log('MathFix.add(0.1, 0.2) =', MathFix.add(0.1, 0.2)); // 0.3
console.log('MathFix.subtract(0.3, 0.1) =', MathFix.subtract(0.3, 0.1)); // 0.2
console.log('MathFix.multiply(0.1, 0.2) =', MathFix.multiply(0.1, 0.2)); // 0.02
console.log('MathFix.divide(0.3, 0.1) =', MathFix.divide(0.3, 0.1)); // 3

console.log('\n=== 更多示例 ===');
console.log('复杂计算:');
console.log('MathFix.add(1.1, 2.2) =', MathFix.add(1.1, 2.2)); // 3.3
console.log('MathFix.multiply(1.23, 4.56) =', MathFix.multiply(1.23, 4.56)); // 5.6088
console.log('MathFix.round(3.14159, 2) =', MathFix.round(3.14159, 2)); // 3.14
console.log('MathFix.round(3.14159, 4) =', MathFix.round(3.14159, 4)); // 3.1416

console.log('\n=== 格式化示例 ===');
const result = 0.1 + 0.2;
console.log('原始结果:', result);
console.log('格式化后:', MathFix.format(result));

console.log('\n=== 小数位数检测 ===');
console.log('getDecimalPlaces(3.14159) =', MathFix.getDecimalPlaces(3.14159)); // 5
console.log('getDecimalPlaces(100) =', MathFix.getDecimalPlaces(100)); // 0
console.log('getDecimalPlaces(0.1) =', MathFix.getDecimalPlaces(0.1)); // 1

console.log('\n=== 高级数学函数 ===');
console.log('幂运算:');
console.log('MathFix.power(2, 3) =', MathFix.power(2, 3)); // 8
console.log('MathFix.power(1.1, 2) =', MathFix.power(1.1, 2)); // 1.21
console.log('MathFix.power(4, 0.5) =', MathFix.power(4, 0.5)); // 2

console.log('\n开方运算:');
console.log('MathFix.sqrt(9) =', MathFix.sqrt(9)); // 3
console.log('MathFix.sqrt(8, 3) =', MathFix.sqrt(8, 3)); // 2
console.log('MathFix.sqrt(16) =', MathFix.sqrt(16)); // 4

console.log('\n百分比计算:');
console.log('MathFix.percentage(200, 15) =', MathFix.percentage(200, 15)); // 30
console.log('MathFix.percentageChange(100, 120) =', MathFix.percentageChange(100, 120)); // 20
console.log('MathFix.percentageChange(120, 100) =', MathFix.percentageChange(120, 100)); // -16.666...

console.log('\n数组统计函数:');
const numbers = [1.1, 2.2, 3.3, 4.4, 5.5];
console.log('数组:', numbers);
console.log('MathFix.sum(numbers) =', MathFix.sum(numbers)); // 16.5
console.log('MathFix.average(numbers) =', MathFix.average(numbers)); // 3.3
console.log('MathFix.max(numbers) =', MathFix.max(numbers)); // 5.5
console.log('MathFix.min(numbers) =', MathFix.min(numbers)); // 1.1

console.log('\n数学工具函数:');
console.log('MathFix.abs(-3.14) =', MathFix.abs(-3.14)); // 3.14
console.log('MathFix.ceil(3.14) =', MathFix.ceil(3.14)); // 4
console.log('MathFix.floor(3.14) =', MathFix.floor(3.14)); // 3

console.log('\n复利计算:');
console.log('本金1000，年利率5%，3年:');
console.log('MathFix.compoundInterest(1000, 0.05, 3) =', MathFix.compoundInterest(1000, 0.05, 3)); // 1157.625
console.log('本金1000，年利率5%，3年，每年复利4次:');
console.log('MathFix.compoundInterest(1000, 0.05, 3, 4) =', MathFix.compoundInterest(1000, 0.05, 3, 4)); // 1161.62...

console.log('\n=== 链式调用示例 ===');
console.log('链式调用解决复杂计算:');
const chainResult1 = MathFix.chain(10)
  .add(5)        // 10 + 5 = 15
  .multiply(2)   // 15 * 2 = 30
  .subtract(5)   // 30 - 5 = 25
  .divide(5)     // 25 / 5 = 5
  .valueOf();
console.log('MathFix.chain(10).add(5).multiply(2).subtract(5).divide(5) =', chainResult1);

console.log('\n链式调用修复浮点数精度:');
const chainResult2 = MathFix.chain(0.1)
  .add(0.2)      // 精确计算 0.1 + 0.2 = 0.3
  .multiply(10)  // 0.3 * 10 = 3
  .valueOf();
console.log('MathFix.chain(0.1).add(0.2).multiply(10) =', chainResult2);
console.log('对比原生: (0.1 + 0.2) * 10 =', (0.1 + 0.2) * 10);

console.log('\n链式调用高级数学函数:');
const chainResult3 = MathFix.chain(4)
  .power(2)      // 4^2 = 16
  .sqrt()        // √16 = 4
  .abs()         // |4| = 4
  .round(2)      // 保留2位小数
  .valueOf();
console.log('MathFix.chain(4).power(2).sqrt().abs().round(2) =', chainResult3);

console.log('\n链式调用与格式化:');
const chainResult4 = MathFix.chain(3.14159)
  .multiply(2)   // 3.14159 * 2 = 6.28318
  .round(3)      // 保留3位小数 = 6.283
  .format()      // 格式化
  .valueOf();
console.log('MathFix.chain(3.14159).multiply(2).round(3).format() =', chainResult4);