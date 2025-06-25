/**
 * ES模块使用示例
 * 演示如何使用 import { xxx } from "precision-calculator" 语法
 */

// 方式1: 命名导入 - 导入特定功能
import { PrecisionCalculator, calc, EnhancedCalculator, ChainableCalculator } from '../precision-calculator.mjs';

console.log('=== ES模块导入示例 ===\n');

// 使用基础计算器
console.log('1. 基础计算器测试:');
const calculator = new PrecisionCalculator();
console.log('0.1 + 0.2 =', calculator.add(0.1, 0.2)); // 0.3
console.log('1.4 - 0.2 =', calculator.subtract(1.4, 0.2)); // 1.2
console.log('0.2 * 3 =', calculator.multiply(0.2, 3)); // 0.6
console.log('1.21 / 1.1 =', calculator.divide(1.21, 1.1)); // 1.1

// 使用便捷函数
console.log('\n2. 便捷函数测试:');
console.log('calc.add(0.1, 0.2) =', calc.add(0.1, 0.2)); // 0.3
console.log('calc.multiply(0.2, 3) =', calc.multiply(0.2, 3)); // 0.6

// 使用增强计算器
console.log('\n3. 增强计算器测试:');
const enhanced = new EnhancedCalculator();
console.log('增强计算器实例创建成功:', enhanced instanceof EnhancedCalculator);

// 演示链式调用
console.log('\n4. 链式调用测试:');
const chainCalc = new ChainableCalculator(0.1);
const result = chainCalc
  .add(0.2)
  .multiply(2)
  .subtract(0.1)
  .valueOf();
console.log('链式调用结果:', result);

console.log('\n=== ES模块导入测试完成 ===');

// 导出一些功能供其他模块使用
export { calculator, enhanced };
export const version = '1.1.0';
export const moduleType = 'ES Module';

/**
 * 其他导入方式示例:
 * 
 * // 方式2: 默认导入
 * import precisionCalc from '../precision-calculator.mjs';
 * const calc = new precisionCalc.PrecisionCalculator();
 * 
 * // 方式3: 混合导入
 * import precisionCalc, { calc, batch } from '../precision-calculator.mjs';
 * 
 * // 方式4: 全部导入
 * import * as PC from '../precision-calculator.mjs';
 * const calculator = new PC.PrecisionCalculator();
 * 
 * // 方式5: 动态导入
 * const { PrecisionCalculator } = await import('../precision-calculator.mjs');
 */