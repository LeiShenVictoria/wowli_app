# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WowliBird is an AI-powered family communication app designed for mother-daughter relationships. It uses AI (Claude) to translate emotional subtext in messages and photos, helping both parties understand each other better. The project consists of three main parts:

1. **wowli/** - Main application (React Native iOS app + Node.js backend)
2. **wowliUI/** - Separate web UI project (Vite + React)
3. Root Python files - Minimal setup files

## Architecture

### Backend: Hybrid AI System (Pipeline + Agent)

The server uses a **routing-based hybrid architecture** that dynamically selects between two processing modes:

- **Pipeline Mode** (90% of requests): Fast, single API call for simple scenarios
  - File: `wowli/server/ai/pipeline.js`
  - Low latency, low cost
  - Handles routine photo sharing and simple emotions

- **Agent Mode** (10% of requests): Multi-turn reasoning for complex scenarios
  - File: `wowli/server/ai/agent.js`
  - Tool calling capabilities for deep analysis
  - Triggered by sensitive topics, conflicts, or negative feedback

- **Router**: `wowli/server/ai/router.js`
  - Analyzes sensitivity score, message type, conversation depth
  - Checks for recent conflicts or negative feedback in database
  - Decision logic uses pattern matching and database queries

### AI Personality: Wowli

The AI character "Wowli" is a gentle emotional translator with specific principles defined in `wowli/server/ai/prompts.js`:

- **Intent Translation**: Translates surface-level messages into underlying emotions
- **Boundary Respect**: Never suggests either party "should change"
- **Curiosity-Driven**: Uses questions rather than directives
- **Non-Corrective**: Avoids making either party feel wrong

### Database Schema

SQLite database (`wowli/server/db/database.js`) with tables:
- `users`: User profiles (daughter/mother roles)
- `families`: Family groups
- `messages`: Photo/text messages with AI responses
- `feedback`: User ratings for AI responses (used by router)
- `wowli_status`: Virtual pet status (happiness, hunger)

### Real-time Communication

- Socket.IO for real-time messaging between family members
- Events: `join_family`, `new_message`, `wowli_update`
- Broadcasts messages to all family members in the same room

### iOS Widget

SwiftUI widget displays latest family messages on iOS home screen:
- Uses App Groups (`group.com.wowli.shared`) for data sharing
- React Native bridge: `react-native-shared-group-preferences`
- Detailed setup in `wowli/WIDGET_GUIDE.md`

## Development Commands

### Server (wowli/server)

```bash
cd wowli/server

# Install dependencies
npm install

# Start server (Mock mode - no API key needed)
npm start

# Development with auto-reload
npm run dev
```

The server displays local IP address on startup for mobile device connection.

### React Native App (wowli/app)

```bash
cd wowli/app

# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS (or use Xcode)
npm run ios

# Run tests
npm test

# Lint
npm run lint
```

**Important**: Edit `app/src/services/api.ts` to set your Mac's local IP address for API_BASE in development mode.

### Running in Xcode

```bash
# Open workspace (not .xcodeproj)
open wowli/app/ios/Wowli.xcworkspace
```

In Xcode:
1. Select Scheme: **Wowli** (for main app) or **WowliWidgetExtension** (for widget)
2. Select your connected iPhone as target
3. Click Run ▶️

### wowliUI (Separate Web Project)

```bash
cd wowliUI

npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

Note: This appears to be a separate Gemini-based web UI project (not integrated with main Wowli app).

## Configuration

### Mock Mode vs Production Mode

Toggle in `wowli/server/config.js`:

```javascript
export const USE_MOCK = true;  // false to use real Claude API
```

When using production mode:
- Set environment variable: `CLAUDE_API_KEY=your-key`
- Model used: `claude-sonnet-4-20250514`
- Max tokens: 500

### API Configuration

- Server port: 3000 (configurable in `config.js`)
- Database: `./db/wowli.sqlite` (auto-created)
- Uploads: `./uploads/` (auto-created)

## Key File Locations

### Customization Points

| What to Customize | File Location |
|------------------|---------------|
| Wowli personality & prompts | `wowli/server/ai/prompts.js` |
| AI routing logic | `wowli/server/ai/router.js` |
| Theme colors | `wowli/app/src/theme/colors.ts` |
| API endpoints | `wowli/app/src/services/api.ts` |
| Widget appearance | `wowli/app/ios/WowliWidget/WowliWidget.swift` |
| Server config | `wowli/server/config.js` |

### API Routes

Located in `wowli/server/routes/`:
- `/api/messages` - Message CRUD and AI processing
- `/api/users` - User management
- `/api/wowli` - Wowli pet status (feeding, mood)
- `/api/widget` - Widget data endpoints
- `/api/weekly` - Weekly question prompts
- `/api/health` - Health check endpoint

## Important Patterns

### Adding a New AI Tool (Agent Mode)

When adding tools to `wowli/server/ai/agent.js`:
1. Add tool definition to `TOOLS` array with input schema
2. Implement handler in `executeTool()` function
3. Tool can access database via `dbOperations` and context params

### Modifying AI Routing Logic

In `wowli/server/ai/router.js`:
- Adjust sensitivity patterns and weights in `calculateSensitivity()`
- Modify trigger conditions in `selectPath()` main function
- Add new database queries to `dbOperations` if needed

### Database Operations

All prepared statements are in `dbOperations` object. Always use these instead of raw queries:

```javascript
import { dbOperations } from './db/database.js';

// Get family messages
const messages = dbOperations.getMessages.all(familyId, limit);

// Create new message
dbOperations.createMessage.run(id, familyId, senderId, imagePath, caption, aiResponse, mode);
```

## Testing with Two Devices

1. Both phones connect to same WiFi
2. Start server (displays LAN IP address)
3. Device A creates family, gets family ID
4. Device B enters family ID to join
5. Messages sync in real-time via Socket.IO

## Technology Stack

- **Frontend**: React Native 0.73.4, TypeScript, React Navigation
- **Backend**: Node.js, Express, Socket.IO
- **Database**: SQLite (better-sqlite3)
- **AI**: Anthropic Claude API (Pipeline + Agent hybrid)
- **iOS Widget**: WidgetKit, SwiftUI, App Groups
- **Real-time**: Socket.IO for bidirectional communication

## Special Considerations

### Wowli's Communication Principles

When modifying AI prompts or behavior, maintain these core principles:
- Never use "you should" language toward either party
- Always translate intent rather than correct behavior
- Respect generational differences without judgment
- Keep responses under 50 characters
- Use soft, warm tone (呀、呢、啦 in Chinese)

### Sensitive Topics

The router automatically detects these and switches to Agent mode:
- Health/medical issues
- Money/financial topics
- Relationships/marriage
- Work stress/career changes
- Body image/weight

When handling sensitive topics, Wowli should empathize without giving advice.

### Environment Variables

Required for production mode:
- `CLAUDE_API_KEY` - Anthropic API key

Optional:
- `SERVER_PORT` - Override default port 3000

## wowliUI Project

This is a separate Vite-based web application using Google Gemini API (not Claude). It appears to be an independent AI Studio export. To work with it:
- Set `GEMINI_API_KEY` in `.env.local`
- Run with `npm run dev` in wowliUI directory
- Note: This is separate from the main Wowli React Native app
