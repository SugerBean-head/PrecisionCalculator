#!/usr/bin/env node
/**
 * ES模块导入测试脚本
 * 验证所有导入方式都能正常工作
 */

console.log('🧪 测试 ES 模块导入功能\n');

let testsPassed = 0;
let testsTotal = 0;

async function test(description, testFn) {
  testsTotal++;
  try {
    await testFn();
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
  }
}

// 所有测试都放在异步函数中执行
(async () => {
  // 测试1: 命名导入
  await test('命名导入', async () => {
    const { PrecisionCalculator, calc } = await import('./mathfix.mjs');
    const calculator = new PrecisionCalculator();
    const result = calc.add(0.1, 0.2);
    if (result !== 0.3) throw new Error(`期望 0.3，得到 ${result}`);
  });

  // 测试2: 默认导入
  await test('默认导入', async () => {
    const precisionCalc = (await import('./mathfix.mjs')).default;
    const calculator = new precisionCalc.PrecisionCalculator();
    const result = calculator.multiply(0.2, 3);
    if (result !== 0.6) throw new Error(`期望 0.6，得到 ${result}`);
  });

  // 测试3: 命名空间导入
  await test('命名空间导入', async () => {
    const PC = await import('./mathfix.mjs');
    const result = PC.calc.divide(1.21, 1.1);
    if (result !== 1.1) throw new Error(`期望 1.1，得到 ${result}`);
  });

  // 测试4: 链式调用
  await test('链式调用', async () => {
    const { ChainableCalculator } = await import('./mathfix.mjs');
    const chainCalc = new ChainableCalculator(10);
    const result = chainCalc.add(5).multiply(2).subtract(3).valueOf();
    if (result !== 27) throw new Error(`期望 27，得到 ${result}`);
  });

  // 测试5: 批量计算
  await test('批量计算', async () => {
    const { batch } = await import('./mathfix.mjs');
    const results = batch(['1+2', '2*3', '4/2']);
    if (JSON.stringify(results) !== JSON.stringify([3, 6, 2])) {
      throw new Error(`期望 [3, 6, 2]，得到 ${JSON.stringify(results)}`);
    }
  });

  // 测试6: 版本信息
  await test('版本信息', async () => {
    const { version } = await import('./mathfix.mjs');
    if (typeof version !== 'string' || !version.match(/\d+\.\d+\.\d+/)) {
      throw new Error(`期望版本号格式，得到 ${version}`);
    }
  });

  // 测试7: 功能特性
  await test('功能特性', async () => {
    const { features } = await import('./mathfix.mjs');
    if (typeof features !== 'object' || typeof features.enhanced !== 'boolean') {
      throw new Error(`期望功能特性对象，得到 ${JSON.stringify(features)}`);
    }
  });
  
  // 测试8: 动态导入
  await test('动态导入', async () => {
    const { calc } = await import('./mathfix.mjs');
    const result = calc.subtract(1.4, 0.2);
    if (result !== 1.2) throw new Error(`期望 1.2，得到 ${result}`);
  });
  
  // 输出测试结果
  console.log(`\n📊 测试结果: ${testsPassed}/${testsTotal} 通过`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有 ES 模块导入测试通过！');
    console.log('\n✨ 支持的导入方式:');
    console.log('   • import { calc } from "mathfix"');
    console.log('   • import precisionCalc from "mathfix"');
    console.log('   • import * as PC from "mathfix"');
    console.log('   • import { PrecisionCalculator as Calc } from "mathfix"');
    process.exit(0);
  } else {
    console.log('❌ 部分测试失败');
    process.exit(1);
  }
})();

console.log('\n⏳ 运行异步测试...');