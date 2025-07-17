# 更新日志

## [1.2.0] - 2024-12-19

### 新增功能
- ✨ **单位格式化功能**：支持为数字添加单位（如货币符号、单位等）
  - 新增 `unit` 和 `unitPosition` 配置选项
  - 支持前缀和后缀两种单位位置
- ✨ **中文数字转换功能**：支持将阿拉伯数字转换为中文数字
  - 新增 `toChineseNumber()` 函数
  - 在 `format()` 函数中添加 `chineseNumber` 选项
- ✨ **人民币大写转换功能**：支持将数字转换为人民币大写格式
  - 新增 `toChineseCapital()` 函数
  - 在 `format()` 函数中添加 `chineseCapital` 选项
  - 支持整数和小数部分的完整转换
- ✨ **大写转换功能**：支持字符串大写转换
  - 在 `format()` 函数中添加 `uppercase` 选项
- ✨ **复合格式化功能**：新增 `addUnitAndFormat()` 函数
  - 支持中文数字、单位、大写等多种格式化选项的组合使用

### 功能增强
- 🚀 **format 函数增强**：支持更多格式化选项
  - 添加 `unit`、`unitPosition`、`uppercase`、`chineseNumber`、`chineseCapital` 选项
  - 优化格式化逻辑，支持多种选项组合
- 🚀 **全局配置增强**：扩展全局配置选项
  - 添加单位、大写、中文数字等全局配置支持
  - 支持通过 `setConfig()` 设置默认格式化行为

### TypeScript 支持
- 📝 **类型定义更新**：完善 TypeScript 类型定义
  - 更新 `FormatOptions` 接口，添加新的格式化选项
  - 更新 `MathFixConfig` 接口，添加新的全局配置选项
  - 添加 `toChineseCapital` 函数的类型定义

### 文档更新
- 📚 **README 文档完善**：添加新功能的详细说明和示例
  - 添加单位格式化功能说明
  - 添加中文数字转换功能说明
  - 添加人民币大写转换功能说明
  - 添加复合格式化功能说明
- 📚 **API 文档更新**：完善函数文档和使用示例

### 测试和示例
- 🧪 **测试覆盖**：为新功能添加测试用例
- 🎯 **Vue 示例更新**：在 Vue 测试项目中添加新功能的演示

## [1.0.0] - 2024-12-18

### 初始版本
- 🎉 **基础数学运算**：add、subtract、multiply、divide
- 🎉 **高级数学函数**：power、sqrt、percentage、percentageChange、compoundInterest
- 🎉 **数组统计函数**：sum、average、max、min
- 🎉 **数学工具函数**：abs、ceil、floor、round、format
- 🎉 **全局配置**：支持精度、千分位分隔符配置
- 🎉 **链式调用**：支持现代化的链式调用语法
- 🎉 **TypeScript 支持**：完整的类型定义
- 🎉 **多模块格式**：支持 CommonJS 和 ES Module
- 🎉 **浏览器兼容**：可直接在浏览器中使用