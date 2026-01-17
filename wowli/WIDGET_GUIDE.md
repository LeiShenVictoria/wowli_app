# Wowli iOS 小组件搭建指南

## 概述

本指南帮助你在 Xcode 中为 Wowli App 添加 iOS 桌面小组件（Widget）。

## 前置条件

- 已安装 Xcode 15+
- 已完成 React Native 项目初始化
- Apple Developer 账号（免费账号可本地测试）

---

## 第一步：初始化 React Native iOS 项目

```bash
# 在 wowli/app 目录下
cd /Users/rosielyu/VSCODEProject/momtietie/wowli/app

# 安装依赖
npm install

# 安装 iOS 依赖
cd ios
pod install
cd ..
```

---

## 第二步：在 Xcode 中添加 Widget Extension

### 2.1 打开 Xcode 项目

```bash
open ios/Wowli.xcworkspace
```

### 2.2 添加 Widget Target

1. 在 Xcode 菜单栏：**File → New → Target**
2. 搜索 **"Widget Extension"**
3. 点击 **Next**
4. 配置：
   - **Product Name**: `WowliWidget`
   - **Team**: 选择你的开发者账号
   - **Bundle Identifier**: 自动填充
   - **Include Configuration Intent**: 可选（用于可配置小组件）
5. 点击 **Finish**
6. 弹出 "Activate scheme?" 对话框 → 点击 **Activate**

---

## 第三步：配置 App Group（数据共享）

让主 App 和 Widget 能共享数据。

### 3.1 配置主 App

1. 在 Xcode 左侧选择主项目 **Wowli**
2. 选择 **TARGETS → Wowli**
3. 点击 **Signing & Capabilities** 标签
4. 点击 **+ Capability**
5. 搜索并添加 **App Groups**
6. 点击 **+** 添加新的 Group：`group.com.wowli.shared`

### 3.2 配置 Widget

1. 选择 **TARGETS → WowliWidgetExtension**
2. 同样添加 **App Groups**
3. 勾选刚才创建的 `group.com.wowli.shared`

---

## 第四步：编写 Widget 代码

用以下代码替换 `WowliWidget/WowliWidget.swift`：

```swift
import WidgetKit
import SwiftUI

// MARK: - 数据模型

struct WowliEntry: TimelineEntry {
    let date: Date
    let senderName: String
    let caption: String
    let wowliMessage: String
    let wowliMood: String
    let hasNewMessage: Bool
}

// MARK: - 数据提供者

struct WowliProvider: TimelineProvider {

    // 占位视图数据
    func placeholder(in context: Context) -> WowliEntry {
        WowliEntry(
            date: Date(),
            senderName: "妈妈",
            caption: "今天做了你爱吃的菜",
            wowliMessage: "💕 妈妈在想你呢",
            wowliMood: "happy",
            hasNewMessage: true
        )
    }

    // 快照（用于小组件库预览）
    func getSnapshot(in context: Context, completion: @escaping (WowliEntry) -> Void) {
        let entry = loadLatestData() ?? placeholder(in: context)
        completion(entry)
    }

    // 时间线（定时刷新）
    func getTimeline(in context: Context, completion: @escaping (Timeline<WowliEntry>) -> Void) {
        let entry = loadLatestData() ?? placeholder(in: context)

        // 每 30 分钟刷新一次
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    // 从 App Group 读取共享数据
    private func loadLatestData() -> WowliEntry? {
        let sharedDefaults = UserDefaults(suiteName: "group.com.wowli.shared")

        guard let data = sharedDefaults?.dictionary(forKey: "widgetData"),
              let senderName = data["senderName"] as? String,
              let caption = data["caption"] as? String
        else {
            return nil
        }

        return WowliEntry(
            date: Date(),
            senderName: senderName,
            caption: caption,
            wowliMessage: data["wowliMessage"] as? String ?? "Wowli 在等你呢~",
            wowliMood: data["wowliMood"] as? String ?? "happy",
            hasNewMessage: data["hasNewMessage"] as? Bool ?? false
        )
    }
}

// MARK: - 小组件视图

struct WowliWidgetEntryView: View {
    var entry: WowliEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            // 渐变背景
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 1, green: 0.96, blue: 0.96),
                    Color(red: 1, green: 0.92, blue: 0.92)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 8) {
                // 顶部：发送者 + Wowli
                HStack {
                    Text(entry.senderName)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(red: 0.91, green: 0.55, blue: 0.55))

                    Spacer()

                    // 新消息提示
                    if entry.hasNewMessage {
                        Circle()
                            .fill(Color(red: 1, green: 0.55, blue: 0.26))
                            .frame(width: 8, height: 8)
                    }

                    // Wowli 表情
                    Text(wowliEmoji)
                        .font(.system(size: 20))
                }

                Spacer()

                // 消息内容
                Text(entry.caption)
                    .font(.system(size: family == .systemSmall ? 13 : 15, weight: .medium))
                    .foregroundColor(.primary)
                    .lineLimit(family == .systemSmall ? 2 : 3)

                // Wowli 提示（中/大尺寸显示）
                if family != .systemSmall {
                    HStack(spacing: 4) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 10))
                        Text(entry.wowliMessage)
                            .font(.system(size: 11, weight: .medium))
                    }
                    .foregroundColor(Color(red: 0.91, green: 0.55, blue: 0.55))
                }
            }
            .padding(16)
        }
    }

    // Wowli 表情
    var wowliEmoji: String {
        switch entry.wowliMood {
        case "very_happy": return "🥰"
        case "happy": return "😊"
        case "hungry": return "😋"
        case "sad": return "🥺"
        default: return "😊"
        }
    }
}

// MARK: - 注册小组件

@main
struct WowliWidget: Widget {
    let kind: String = "WowliWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WowliProvider()) { entry in
            WowliWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Wowli")
        .description("来自家人的最新消息")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - 预览

struct WowliWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            WowliWidgetEntryView(entry: WowliEntry(
                date: Date(),
                senderName: "妈妈",
                caption: "今天的阳光很好，想和你一起散步 ☀️",
                wowliMessage: "妈妈好像在想你呢~",
                wowliMood: "happy",
                hasNewMessage: true
            ))
            .previewContext(WidgetPreviewContext(family: .systemSmall))

            WowliWidgetEntryView(entry: WowliEntry(
                date: Date(),
                senderName: "妈妈",
                caption: "今天的阳光很好，想和你一起散步 ☀️",
                wowliMessage: "妈妈好像在想你呢~",
                wowliMood: "happy",
                hasNewMessage: true
            ))
            .previewContext(WidgetPreviewContext(family: .systemMedium))
        }
    }
}
```

---

## 第五步：React Native 写入 Widget 数据

### 5.1 安装桥接库

```bash
cd /Users/rosielyu/VSCODEProject/momtietie/wowli/app
npm install react-native-shared-group-preferences
cd ios && pod install && cd ..
```

### 5.2 在 App 中更新 Widget 数据

在 `src/services/widgetBridge.ts` 创建：

```typescript
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import { WidgetKit } from 'react-native'; // iOS 14+

const APP_GROUP = 'group.com.wowli.shared';

export async function updateWidgetData(data: {
  senderName: string;
  caption: string;
  wowliMessage: string;
  wowliMood: string;
  hasNewMessage: boolean;
}) {
  try {
    await SharedGroupPreferences.setItem('widgetData', data, APP_GROUP);

    // 通知系统刷新小组件
    // iOS 14+ 可用 WidgetKit.reloadAllTimelines()
    console.log('✅ Widget 数据已更新');
  } catch (error) {
    console.error('❌ Widget 更新失败:', error);
  }
}
```

### 5.3 在收到新消息时调用

```typescript
// 在 App.tsx 或消息处理逻辑中
import { updateWidgetData } from './services/widgetBridge';

// 收到新消息时
const handleNewMessage = async (message) => {
  // ... 更新本地状态 ...

  // 更新 Widget
  await updateWidgetData({
    senderName: message.senderName,
    caption: message.caption,
    wowliMessage: '有新消息啦~',
    wowliMood: 'happy',
    hasNewMessage: true,
  });
};
```

---

## 第六步：运行和测试

### 6.1 运行 App

```bash
# 在 Xcode 中
1. 选择你的 iPhone（连接 Mac）
2. 选择 Scheme: Wowli（不是 WowliWidgetExtension）
3. 点击 Run ▶️
```

### 6.2 添加小组件

1. 在 iPhone 上长按桌面空白处
2. 点击左上角 **+**
3. 搜索 **Wowli**
4. 选择尺寸（小/中）
5. 点击 **添加小组件**

---

## 常见问题

### Q: Widget 不显示数据？

1. 确保 App Group 名称完全一致
2. 确保主 App 和 Widget 都添加了同一个 App Group
3. 重新运行 App，触发数据写入

### Q: Widget 不刷新？

Widget 有系统级的刷新限制。可以：
- 使用 `WidgetKit.reloadAllTimelines()` 强制刷新
- 等待时间线自动刷新（30分钟）

### Q: 本地调试时签名错误？

1. 确保在 Signing & Capabilities 中选择了正确的 Team
2. 免费账号需要每 7 天重新签名

---

## 项目结构

完成后的 iOS 项目结构：

```
ios/
├── Wowli/                      # 主 App
│   ├── AppDelegate.mm
│   ├── Info.plist
│   └── Wowli.entitlements     # App Group 配置
│
├── WowliWidget/               # 小组件
│   ├── WowliWidget.swift      # Widget 代码
│   ├── Info.plist
│   └── WowliWidget.entitlements
│
├── Wowli.xcworkspace          # 打开这个！
└── Podfile
```

---

## 下一步

- [ ] 自定义 Widget 颜色和样式
- [ ] 添加 Wowli 宠物图片到 Widget
- [ ] 实现点击 Widget 跳转到特定页面
- [ ] 添加大尺寸 Widget（systemLarge）
