# Stablecoin Yield Dashboard

## 📖 项目简介 (Project Overview)

Stablecoin Yield Dashboard 是一个基于 Next.js 构建的现代化 Web 应用，旨在为用户提供去中心化金融 (DeFi) 生态系统中稳定币理财产品的实时收益率数据。项目采用极简且高端的金融系统美学设计，通过整合权威数据源，帮助用户发现高收益、低风险的理财机会。

## ✨ 核心功能 (Features)

### 1. 实时数据看板 (Live Dashboard)
- **数据聚合**: 自动从 DeFiLlama 获取全网最新的流动性池数据。
- **智能筛选**:
  - 仅展示稳定币相关池 (USDT, USDC, DAI, FRAX 等)。
  - 过滤低流动性池 (TVL < $100k) 以确保安全性。
  - 过滤异常 APY (排除 < 0% 或 > 500% 的极端数据)。
- **排序机制**: 默认按 TVL (总锁仓量) 降序排列，优先展示头部安全协议。

### 2. 交互体验 (User Experience)
- **即时搜索**: 支持通过协议名称 (Protocol)、链 (Chain) 或代币符号 (Symbol) 进行实时过滤。
- **分页浏览**: 客户端分页处理，每页展示 10 条数据，保证页面流畅度。
- **一键刷新**: 提供手动刷新按钮，实时同步最新链上数据。
- **响应式设计**: 完美适配桌面端与移动端，采用 Glassmorphism (毛玻璃) 风格 UI。

## 🛠 技术栈 (Tech Stack)

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Vanilla CSS (Custom Variables)
- **图标**: Lucide React
- **动画**: Framer Motion (用于微交互)
- **数据源**: DeFiLlama API

## 🔌 API 文档 (API Reference)

项目包含一个内部 API 路由，作为前端与外部数据源之间的代理层。

### `GET /api/yields`

获取经过处理的稳定币收益率数据。

- **请求方式**: `GET`
- **缓存策略**: `revalidate = 300` (5分钟服务端缓存)
- **响应格式**:

```json
{
  "data": [
    {
      "chain": "Ethereum",
      "project": "Aave V3",
      "symbol": "USDC",
      "tvlUsd": 150000000,
      "apy": 4.5,
      "pool": "uuid-string",
      "stablecoin": true
    },
    // ... 更多数据 (Top 100)
  ],
  "timestamp": "2023-10-27T10:00:00.000Z"
}
```

- **处理逻辑**:
  1. 请求 `https://yields.llama.fi/pools`。
  2. 过滤非稳定币资产。
  3. 过滤 TVL < $100,000 的池子。
  4. 过滤 APY > 500% 的异常数据。
  5. 按 TVL 降序排序。
  6. 截取前 100 条数据返回。

## 🗺️ 未来计划 (Roadmap)

基于 `prd.md` 的规划，项目将向工业级数据平台演进：

### Phase 1: 数据源增强 (Data Accuracy)
- [ ] **多源验证**: 引入 Aave, Compound, Curve 等协议的官方 API 或链上合约直接读取，与 DeFiLlama 数据交叉验证。
- [ ] **异常检测**: 实现基于统计学的异常值剔除算法，提高数据可信度。

### Phase 2: 实时性与性能 (Real-time & Performance)
- [ ] **WebSocket 支持**: 接入链上节点 WebSocket，实现关键事件（如区块更新）毫秒级推送。
- [ ] **流式处理**: 引入 Kafka/Flink 架构处理大规模实时数据流（针对未来多链扩展）。

### Phase 3: 高级功能 (Advanced Features)
- [ ] **历史回测**: 展示 APY 历史走势图，帮助用户分析收益稳定性。
- [ ] **风险评分**: 综合协议审计状态、TVL 波动、历史攻击记录，为每个池子计算风险分。
- [ ] **多链扩展**: 覆盖更多 Layer 2 (Arbitrum, Optimism, Base) 及非 EVM 链。

## 🚀 快速开始 (Getting Started)

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **构建生产版本**:
   ```bash
   npm run build
   npm start
   ```
