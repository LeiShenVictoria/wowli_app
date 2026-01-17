import WidgetKit
  import SwiftUI

  struct WowliEntry: TimelineEntry {
      let date: Date
      let senderName: String
      let caption: String
      let wowliMessage: String
      let wowliMood: String
      let hasNewMessage: Bool
  }

  struct WowliProvider: TimelineProvider {
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

      func getSnapshot(in context: Context, completion: @escaping (WowliEntry) -> Void) {
          completion(placeholder(in: context))
      }

      func getTimeline(in context: Context, completion: @escaping (Timeline<WowliEntry>) -> Void) {
          let entry = loadLatestData() ?? placeholder(in: context)
          let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
          let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
          completion(timeline)
      }

      private func loadLatestData() -> WowliEntry? {
          let sharedDefaults = UserDefaults(suiteName: "group.com.wowli.shared")
          guard let data = sharedDefaults?.dictionary(forKey: "widgetData"),
                let senderName = data["senderName"] as? String,
                let caption = data["caption"] as? String
          else { return nil }

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

  struct WowliWidgetEntryView: View {
      var entry: WowliEntry
      @Environment(\.widgetFamily) var family

      var body: some View {
          ZStack {
              LinearGradient(
                  gradient: Gradient(colors: [
                      Color(red: 1, green: 0.96, blue: 0.96),
                      Color(red: 1, green: 0.92, blue: 0.92)
                  ]),
                  startPoint: .topLeading,
                  endPoint: .bottomTrailing
              )

              VStack(alignment: .leading, spacing: 8) {
                  HStack {
                      Text(entry.senderName)
                          .font(.system(size: 14, weight: .semibold))
                          .foregroundColor(Color(red: 0.91, green: 0.55, blue: 0.55))
                      Spacer()
                      if entry.hasNewMessage {
                          Circle()
                              .fill(Color.orange)
                              .frame(width: 8, height: 8)
                      }
                      Text(wowliEmoji).font(.system(size: 20))
                  }

                  Spacer()

                  Text(entry.caption)
                      .font(.system(size: family == .systemSmall ? 13 : 15, weight: .medium))
                      .foregroundColor(.primary)
                      .lineLimit(family == .systemSmall ? 2 : 3)

                  if family != .systemSmall {
                      HStack(spacing: 4) {
                          Image(systemName: "sparkles").font(.system(size: 10))
                          Text(entry.wowliMessage).font(.system(size: 11, weight: .medium))
                      }
                      .foregroundColor(Color(red: 0.91, green: 0.55, blue: 0.55))
                  }
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
          default: return "😊"
          }
      }
  }

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
