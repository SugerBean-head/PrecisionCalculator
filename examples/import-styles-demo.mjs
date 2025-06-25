/**
 * ES模块导入方式演示
 * 展示mathfix支持的各种import语法
 */

console.log('=== Mathfix ES模块导入方式演示 ===\n');

// 方式1: 命名导入 - 最常用的方式
console.log('1. 命名导入 (Named Imports):');
import { PrecisionCalculator, calc, batch } from '../mathfix.mjs';

const calculator1 = new PrecisionCalculator();
console.log('  calc.add(0.1, 0.2) =', calc.add(0.1, 0.2));
console.log('  batch(["1+2", "2*3", "4/2"]) =', batch(['1+2', '2*3', '4/2']));

// 方式2: 默认导入
console.log('\n2. 默认导入 (Default Import):');
import precisionCalc from '../mathfix.mjs';

const calculator2 = new precisionCalc.PrecisionCalculator();
console.log('  使用默认导入:', calculator2.multiply(0.2, 3));
console.log('  版本信息:', precisionCalc.version);

// 方式3: 混合导入
console.log('\n3. 混合导入 (Mixed Import):');
import defaultExport, { ChainableCalculator, getPerformanceMetrics } from '../mathfix.mjs';

const chainCalc = new ChainableCalculator(10);
const chainResult = chainCalc.add(5).multiply(2).subtract(3).valueOf();
console.log('  链式计算 (10+5)*2-3 =', chainResult);

// 方式4: 命名空间导入
console.log('\n4. 命名空间导入 (Namespace Import):');
import * as PC from '../mathfix.mjs';

const calculator4 = new PC.PrecisionCalculator();
console.log('  PC.calc.divide(1.21, 1.1) =', PC.calc.divide(1.21, 1.1));
console.log('  功能特性:', PC.features);

// 方式5: 重命名导入
console.log('\n5. 重命名导入 (Aliased Import):');
import { 
  PrecisionCalculator as Calculator, 
  calc as mathCalc,
  version as libVersion 
} from '../mathfix.mjs';

const calculator5 = new Calculator();
console.log('  重命名后使用:', mathCalc.subtract(1.4, 0.2));
console.log('  库版本:', libVersion);

// 实际使用场景示例
console.log('\n=== 实际使用场景 ===');

// 场景1: 简单计算
console.log('\n场景1 - 简单精度计算:');
const price1 = 19.99;
const price2 = 29.99;
const tax = 0.08;
const total = calc.multiply(calc.add(price1, price2), calc.add(1, tax));
console.log(`  商品总价: ${price1} + ${price2} = ${calc.add(price1, price2)}`);
console.log(`  含税总价: ${total}`);

// 场景2: 批量计算
console.log('\n场景2 - 批量数据处理:');
const prices = [19.99, 29.99, 39.99, 49.99];
const priceExpressions = prices.map((price, index) => 
  index === 0 ? price.toString() : `${prices.slice(0, index + 1).join(' + ')}`
);
const batchResults = batch([`${prices.join(' + ')}`]);
const totalPrice = batchResults[0];
const avgPrice = calc.divide(totalPrice, prices.length);
console.log(`  商品价格: [${prices.join(', ')}]`);
console.log(`  总价: ${totalPrice}`);
console.log(`  平均价格: ${avgPrice}`);

// 场景3: 链式计算
console.log('\n场景3 - 复杂链式计算:');
const investment = new ChainableCalculator(1000); // 初始投资1000元
const finalAmount = investment
  .multiply(1.05)  // 第一年5%收益
  .multiply(1.08)  // 第二年8%收益
  .multiply(1.03)  // 第三年3%收益
  .valueOf();
console.log(`  初始投资: 1000元`);
console.log(`  三年后金额: ${finalAmount}元`);
console.log(`  总收益率: ${calc.subtract(calc.divide(finalAmount, 1000), 1) * 100}%`);

console.log('\n=== 演示完成 ===');

// 导出一些计算结果供其他模块使用
export const demoResults = {
  simpleCalculation: total,
  batchCalculation: totalPrice,
  chainCalculation: finalAmount,
  timestamp: new Date().toISOString()
};

export { calculator1 as demoCalculator };
export default { version: libVersion, features: PC.features };