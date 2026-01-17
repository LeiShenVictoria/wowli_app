/**
 * Wowli iOS Widget - 支持每周一问
 * 将此文件内容复制到 Xcode 中的 WowliWidget.swift
 */

import WidgetKit
import SwiftUI

// MARK: - 数据模型

struct WowliEntry: TimelineEntry {
    let date: Date

    // 最新消息
    let senderName: String
    let caption: String
    let hasNewMessage: Bool

    // 每周一问
    let weeklyQuestion: String?
    let weeklyTitle: String?
    let weeklyEmoji: String?
    let weeklyHint: String?
    let hasAnswered: Bool
    let partnerHasAnswered: Bool

    // Wowli 状态
    let wowliMessage: String
    let wowliMood: String
}

// MARK: - 数据提供者

struct WowliProvider: TimelineProvider {

    func placeholder(in context: Context) -> WowliEntry {
        WowliEntry(
            date: Date(),
            senderName: "妈妈",
            caption: "今天做了你爱吃的菜",
            hasNewMessage: true,
            weeklyQuestion: "拍下一样你今天吃过最开心的东西",
            weeklyTitle: "日常味道",
            weeklyEmoji: "🍜",
            weeklyHint: "美食总能唤起回忆",
            hasAnswered: false,
            partnerHasAnswered: false,
            wowliMessage: "本周话题等你来答~",
            wowliMood: "happy"
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (WowliEntry) -> Void) {
        let entry = loadData() ?? placeholder(in: context)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WowliEntry>) -> Void) {
        let entry = loadData() ?? placeholder(in: context)

        // 每 30 分钟刷新
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }

    private func loadData() -> WowliEntry? {
        let sharedDefaults = UserDefaults(suiteName: "group.com.wowli.shared")

        guard let data = sharedDefaults?.dictionary(forKey: "widgetData") else {
            return nil
        }

        return WowliEntry(
            date: Date(),
            senderName: data["senderName"] as? String ?? "家人",
            caption: data["caption"] as? String ?? "",
            hasNewMessage: data["hasNewMessage"] as? Bool ?? false,
            weeklyQuestion: data["weeklyQuestion"] as? String,
            weeklyTitle: data["weeklyTitle"] as? String,
            weeklyEmoji: data["weeklyEmoji"] as? String,
            weeklyHint: data["weeklyHint"] as? String,
            hasAnswered: data["hasAnswered"] as? Bool ?? false,
            partnerHasAnswered: data["partnerHasAnswered"] as? Bool ?? false,
            wowliMessage: data["wowliMessage"] as? String ?? "Wowli 在等你~",
            wowliMood: data["wowliMood"] as? String ?? "happy"
        )
    }
}

// MARK: - 小尺寸 Widget 视图

struct WowliWidgetSmallView: View {
    var entry: WowliEntry

    var body: some View {
        ZStack {
            // 背景
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 1, green: 0.96, blue: 0.94),
                    Color(red: 1, green: 0.94, blue: 0.96)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 8) {
                // 顶部
                HStack {
                    if let emoji = entry.weeklyEmoji {
                        Text(emoji)
                            .font(.system(size: 20))
                    }
                    Spacer()
                    if entry.hasNewMessage || !entry.hasAnswered {
                        Circle()
                            .fill(Color(red: 1, green: 0.55, blue: 0.26))
                            .frame(width: 8, height: 8)
                    }
                }

                Spacer()

                // 每周一问内容
                if let question = entry.weeklyQuestion {
                    VStack(alignment: .leading, spacing: 4) {
                        if let title = entry.weeklyTitle {
                            Text("本周：\(title)")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(red: 0.91, green: 0.55, blue: 0.55))
                        }
                        Text(question)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.primary)
                            .lineLimit(3)
                    }
                } else {
                    // 普通消息
                    Text(entry.caption)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.primary)
                        .lineLimit(3)
                }

                // 状态提示
                HStack(spacing: 4) {
                    Circle()
                        .fill(entry.hasAnswered ? Color.green : Color.gray.opacity(0.3))
                        .frame(width: 6, height: 6)
                    Circle()
                        .fill(entry.partnerHasAnswered ? Color.green : Color.gray.opacity(0.3))
                        .frame(width: 6, height: 6)
                    Text(statusText)
                        .font(.system(size: 9, weight: .medium))
                        .foregroundColor(Color.gray)
                }
            }
            .padding(14)
        }
    }

    var statusText: String {
        if entry.hasAnswered && entry.partnerHasAnswered {
            return "双方已答 💕"
        } else if entry.hasAnswered {
            return "等待对方"
        } else {
            return "等你回答"
        }
    }
}

// MARK: - 中尺寸 Widget 视图

struct WowliWidgetMediumView: View {
    var entry: WowliEntry

    var body: some View {
        ZStack {
            // 背景
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 1, green: 0.96, blue: 0.94),
                    Color(red: 1, green: 0.94, blue: 0.96)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            HStack(spacing: 16) {
                // 左侧：每周一问
                VStack(alignment: .leading, spacing: 8) {
                    // 标签
                    HStack {
                        Text("每周一问")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color(red: 1, green: 0.55, blue: 0.26))
                            .cornerRadius(8)

                        Spacer()
                    }

                    // Emoji 和标题
                    HStack(spacing: 8) {
                        if let emoji = entry.weeklyEmoji {
                            Text(emoji)
                                .font(.system(size: 28))
                        }
                        if let title = entry.weeklyTitle {
                            Text(title)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.primary)
                        }
                    }

                    // 问题
                    if let question = entry.weeklyQuestion {
                        Text(question)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.primary)
                            .lineLimit(2)
                    }

                    Spacer()

                    // 状态
                    HStack(spacing: 12) {
                        StatusBubble(label: "我", completed: entry.hasAnswered)
                        StatusBubble(label: "Ta", completed: entry.partnerHasAnswered)
                    }
                }
                .frame(maxWidth: .infinity)

                // 右侧分隔线
                Rectangle()
                    .fill(Color.black.opacity(0.05))
                    .frame(width: 1)

                // 右侧：Wowli 状态
                VStack(spacing: 8) {
                    Text(wowliEmoji)
                        .font(.system(size: 36))

                    Text(entry.wowliMessage)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(red: 0.91, green: 0.55, blue: 0.55))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
                .frame(width: 80)
            }
            .padding(16)
        }
    }

    var wowliEmoji: String {
        switch entry.wowliMood {
        case "very_happy": return "🥰"
        case "happy": return "😊"
        case "hungry": return "😋"
        case "sad": return "🥺"
        case "thinking": return "🤔"
        default: return "😊"
        }
    }
}

// 状态气泡组件
struct StatusBubble: View {
    let label: String
    let completed: Bool

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(completed ? Color.green : Color.gray.opacity(0.3))
                .frame(width: 8, height: 8)
            Text(label)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(completed ? .primary : .gray)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color.white.opacity(0.8))
        .cornerRadius(12)
    }
}

// MARK: - Widget 入口视图

struct WowliWidgetEntryView: View {
    var entry: WowliEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            WowliWidgetSmallView(entry: entry)
        case .systemMedium:
            WowliWidgetMediumView(entry: entry)
        default:
            WowliWidgetSmallView(entry: entry)
        }
    }
}

// MARK: - 注册 Widget

@main
struct WowliWidget: Widget {
    let kind: String = "WowliWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WowliProvider()) { entry in
            WowliWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Wowli")
        .description("每周一问 · 连接你和家人的心")
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
                caption: "今天的阳光很好",
                hasNewMessage: true,
                weeklyQuestion: "拍下一样你今天吃过最开心的东西，这让你想起了什么？",
                weeklyTitle: "日常味道",
                weeklyEmoji: "🍜",
                weeklyHint: "美食总能唤起回忆",
                hasAnswered: true,
                partnerHasAnswered: false,
                wowliMessage: "等待妈妈的回答~",
                wowliMood: "happy"
            ))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
            .previewDisplayName("小尺寸")

            WowliWidgetEntryView(entry: WowliEntry(
                date: Date(),
                senderName: "妈妈",
                caption: "今天的阳光很好",
                hasNewMessage: true,
                weeklyQuestion: "拍下一样你今天吃过最开心的东西，这让你想起了什么？",
                weeklyTitle: "日常味道",
                weeklyEmoji: "🍜",
                weeklyHint: "美食总能唤起回忆",
                hasAnswered: true,
                partnerHasAnswered: true,
                wowliMessage: "双方都回答啦！",
                wowliMood: "very_happy"
            ))
            .previewContext(WidgetPreviewContext(family: .systemMedium))
            .previewDisplayName("中尺寸")
        }
    }
}
