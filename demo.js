/**
 * 精度计算器演示
 * 展示核心功能和增强特性
 */

const {
  PrecisionCalculator,
  EnhancedCalculator,
  ChainCalculator,
  batch,
  setConfig,
  getConfig,
  setLocale
} = require('./mathfix.js');

console.log('🚀 精度计算器演示开始...');
console.log('=' .repeat(50));

// 1. 基础计算器测试
console.log('\n📊 基础计算器测试:');
const basicCalc = new PrecisionCalculator();
console.log('0.1 + 0.2 =', basicCalc.add(0.1, 0.2));
console.log('0.3 - 0.1 =', basicCalc.subtract(0.3, 0.1));
console.log('0.1 * 3 =', basicCalc.multiply(0.1, 3));
console.log('1 / 3 =', basicCalc.divide(1, 3));

// 2. 增强计算器测试
console.log('\n⚡ 增强计算器测试:');
try {
  const enhancedCalc = new EnhancedCalculator();
  console.log('增强计算器创建成功');
  console.log('0.1 + 0.2 =', enhancedCalc.add(0.1, 0.2));
  console.log('2 * 3 =', enhancedCalc.multiply(2, 3));
  
  // 测试是否有增强方法
  if (typeof enhancedCalc.power === 'function') {
    console.log('2^3 =', enhancedCalc.power(2, 3));
  } else {
    console.log('power方法不可用');
  }
  
  if (typeof enhancedCalc.formatCurrency === 'function') {
    console.log('货币格式:', enhancedCalc.formatCurrency(123.456));
  } else {
    console.log('formatCurrency方法不可用');
  }
} catch (error) {
  console.log('增强计算器创建失败:', error.message);
}

// 3. 链式调用测试
console.log('\n🔗 链式调用测试:');
try {
  const chainCalc = new ChainCalculator(basicCalc, 10);
  const result = chainCalc
    .add(5)
    .multiply(2)
    .subtract(3)
    .valueOf();
  console.log('链式计算结果:', result);
} catch (error) {
  console.log('链式调用失败:', error.message);
}

// 4. 批量计算测试
console.log('\n📦 批量计算测试:');
try {
  const expressions = [
    '0.1 + 0.2',
    '1 / 3',
    '2 * 3'
  ];
  const results = batch(expressions);
  console.log('批量计算结果:', results);
} catch (error) {
  console.log('批量计算失败:', error.message);
}

// 5. 配置管理测试
console.log('\n⚙️ 配置管理测试:');
try {
  const currentConfig = getConfig();
  console.log('当前配置可用:', typeof currentConfig === 'object');
  
  setConfig({ precision: { defaultPrecision: 4 } });
  console.log('配置设置成功');
} catch (error) {
  console.log('配置管理失败:', error.message);
}

// 6. 国际化测试
console.log('\n🌍 国际化测试:');
try {
  setLocale('zh-CN');
  console.log('中文语言设置成功');
  
  setLocale('en-US');
  console.log('英文语言设置成功');
} catch (error) {
  console.log('国际化设置失败:', error.message);
}

console.log('\n✅ 演示完成!');
console.log('=' .repeat(50));