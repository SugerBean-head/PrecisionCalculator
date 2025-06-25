// 简单的测试文件
const { calc } = require('./precision-calculator.js');

console.log('=== Precision Calculator Tests ===\n');

// 基础运算测试
console.log('基础运算测试:');
console.log(`0.1 + 0.2 = ${calc.add(0.1, 0.2)} (期望: 0.3)`);
console.log(`0.3 - 0.1 = ${calc.subtract(0.3, 0.1)} (期望: 0.2)`);
console.log(`0.2 * 0.2 = ${calc.multiply(0.2, 0.2)} (期望: 0.04)`);
console.log(`0.3 / 0.1 = ${calc.divide(0.3, 0.1)} (期望: 3)`);
console.log('');

// 数学运算测试
console.log('数学运算测试:');
console.log(`sqrt(25) = ${calc.sqrt(25)} (期望: 5)`);
console.log(`square(5) = ${calc.square(5)} (期望: 25)`);
console.log(`pow(2, 3) = ${calc.pow(2, 3)} (期望: 8)`);
console.log(`factorial(5) = ${calc.factorial(5)} (期望: 120)`);
console.log('');

// 格式化测试
console.log('格式化测试:');
console.log(`toPercent(0.1256) = ${calc.toPercent(0.1256)} (期望: 12.56%)`);
console.log(`toCurrency(1234.5) = ${calc.toCurrency(1234.5)} (期望: ¥1,234.50)`);
console.log(`round(10.345, 2) = ${calc.round(10.345, 2)} (期望: 10.35)`);
console.log('');

// 链式调用测试
console.log('链式调用测试:');
const chainResult = calc.chain(100)
  .add(50)
  .multiply(1.08)
  .round(2)
  .valueOf();
console.log(`chain(100).add(50).multiply(1.08).round(2) = ${chainResult} (期望: 162)`);
console.log('');

// 表达式计算测试
console.log('表达式计算测试:');
console.log(`calculate('0.1 + 0.2') = ${calc.calculate('0.1 + 0.2')} (期望: 0.3)`);
console.log(`calculate('(10 + 5) * 2 - 3') = ${calc.calculate('(10 + 5) * 2 - 3')} (期望: 27)`);
console.log('');

console.log('✅ 所有测试完成!');
console.log('\n使用方法:');
console.log('const { calc } = require(\'precision-calculator\');');
console.log('console.log(calc.add(0.1, 0.2)); // 0.3');
console.log('console.log(calc.chain(100).add(50).multiply(1.08).valueOf()); // 162');