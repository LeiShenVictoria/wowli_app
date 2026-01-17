# Wowli - AI情绪翻译鸟

专为母女设计，用AI+照片，让妈妈和女儿看到更多的彼此。

## 项目结构

```
wowli/
├── server/                 # 本地后端服务器
│   ├── ai/                # AI 处理（Pipeline + Agent 混合架构）
│   │   ├── pipeline.js    # 快速处理模式
│   │   ├── agent.js       # 复杂推理模式
│   │   ├── router.js      # 路由选择器
│   │   └── prompts.js     # Wowli 人设和提示词
│   ├── routes/            # API 路由
│   ├── db/                # SQLite 数据库
│   └── index.js           # 服务器入口
│
├── app/                    # React Native iOS 应用
│   ├── src/
│   │   ├── screens/       # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── services/      # API 和 Widget 桥接
│   │   ├── theme/         # 主题配色
│   │   └── App.tsx        # 应用入口
│   └── ios/               # iOS 原生代码（Xcode）
│
├── WIDGET_GUIDE.md        # iOS 小组件搭建指南
└── README.md
```

## 快速开始

### 1. 启动本地服务器

```bash
cd wowli/server

# 安装依赖
npm install

# 启动服务器（Mock 模式，不需要 Claude API）
npm start
```

服务器启动后会显示：
- 本机访问: http://localhost:3000
- 手机访问: http://192.168.x.x:3000

### 2. 配置 App 连接地址

编辑 `app/src/services/api.ts`，将 IP 地址改为你 Mac 的局域网 IP：

```typescript
const API_BASE = __DEV__
  ? 'http://192.168.1.100:3000'  // ← 改成你的 Mac IP
  : 'https://api.wowli.app';
```

### 3. 初始化 React Native 项目

```bash
cd wowli/app

# 安装依赖
npm install

# 安装 iOS 依赖
cd ios
pod install
cd ..
```

### 4. 在 Xcode 中运行

```bash
# 打开 Xcode 项目
open ios/Wowli.xcworkspace
```

在 Xcode 中：
1. 选择你的 iPhone（需连接 Mac）
2. 选择 Scheme: **Wowli**
3. 点击 **Run ▶️**

### 5. 添加小组件（可选）

参考 [WIDGET_GUIDE.md](./WIDGET_GUIDE.md) 在 Xcode 中添加 Widget Extension。

## 两台手机测试

1. 两台手机连接同一 WiFi
2. 启动服务器后，用 Mac 的局域网 IP
3. 手机 A 创建家庭，获得家庭 ID
4. 手机 B 输入家庭 ID 加入
5. 即可实时互发消息

## AI 模式说明

项目采用 **Pipeline + Agent 混合架构**：

| 模式 | 触发条件 | 特点 |
|------|---------|------|
| **Pipeline** | 90% 普通场景 | 快速、低成本、单次调用 |
| **Agent** | 敏感话题、冲突、复杂情绪 | 多轮推理、工具调用、更智能 |

当前默认使用 **Mock 模式**（不调用真实 API）。

要启用真实 Claude API：
1. 在 `server/config.js` 中设置 `USE_MOCK = false`
2. 设置环境变量 `CLAUDE_API_KEY=your-key`

## 可自定义内容

| 内容 | 文件位置 | 说明 |
|------|---------|------|
| Wowli 说话风格 | `server/ai/prompts.js` | 修改人设和回复模板 |
| 主题颜色 | `app/src/theme/colors.ts` | 修改配色方案 |
| Wowli 形象 | `app/src/components/WowliPet.tsx` | 修改宠物外观 |
| 小组件样式 | `ios/WowliWidget/WowliWidget.swift` | 修改桌面小组件 |

## 技术栈

- **前端**: React Native + TypeScript
- **后端**: Node.js + Express + Socket.IO
- **数据库**: SQLite（本地）
- **AI**: Claude API（Pipeline + Agent 混合）
- **小组件**: iOS WidgetKit + SwiftUI

## License

MIT
