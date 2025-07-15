/**
 * MathFix.js 测试文件
 * 用于验证重构后的功能是否正常工作
 */

// 导入MathFix库
const MathFix = require('./mathfix.js');

// 测试基本计算功能
console.log('===== 基本计算功能测试 =====');
console.log('0.1 + 0.2 =', MathFix.calc.add(0.1, 0.2)); // 应该输出 0.3 而不是 0.30000000000000004
console.log('0.3 - 0.1 =', MathFix.calc.subtract(0.3, 0.1)); // 应该输出 0.2 而不是 0.19999999999999998
console.log('0.1 * 0.2 =', MathFix.calc.multiply(0.1, 0.2)); // 应该输出 0.02 而不是 0.020000000000000004
console.log('0.3 / 0.1 =', MathFix.calc.divide(0.3, 0.1)); // 应该输出 3 而不是 2.9999999999999996

// 测试链式调用
console.log('\n===== 链式调用测试 =====');
const chainResult = MathFix.calc.chain(10)
  .add(5)
  .multiply(2)
  .subtract(3)
  .divide(4)
  .valueOf();
console.log('10 + 5 * 2 - 3 / 4 =', chainResult); // 应该输出 8.25

// 测试配置管理
console.log('\n===== 配置管理测试 =====');
console.log('当前精度:', MathFix.getConfig('precision.default'));
MathFix.setConfig({ precision: { default: 4 } });
console.log('修改后精度:', MathFix.getConfig('precision.default'));
console.log('使用新精度计算 1/3 =', MathFix.calc.divide(1, 3)); // 应该根据新精度输出

// 测试工厂模式
console.log('\n===== 工厂模式测试 =====');
const customCalculator = MathFix.createCalculator('basic', { precision: 2 });
console.log('自定义计算器 (精度2) 计算 1/3 =', customCalculator.divide(1, 3));

const chainCalculator = MathFix.createChainCalculator(5, { precision: 3 });
console.log('自定义链式计算器 (初始值5, 精度3) 计算 5*2+1 =', 
  chainCalculator.multiply(2).add(1).valueOf());

// 测试批量计算
console.log('\n===== 批量计算测试 =====');
const batchResults = MathFix.batch([1, 4, 9, 16], 'sqrt');
console.log('批量计算平方根 [1, 4, 9, 16]:', batchResults);

// 显示版本和特性信息
console.log('\n===== 版本和特性信息 =====');
console.log('版本:', MathFix.version);
console.log('特性:', MathFix.features);

console.log('\n测试完成!');