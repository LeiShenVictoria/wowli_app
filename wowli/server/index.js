/**
 * Wowli 本地服务器
 * 支持双设备实时通信
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { mkdirSync } from 'fs';

import { SERVER_PORT, UPLOAD_PATH, USE_MOCK } from './config.js';
import messagesRouter from './routes/messages.js';
import usersRouter from './routes/users.js';
import wowliRouter from './routes/wowli.js';
import widgetRouter from './routes/widget.js';
import weeklyRouter from './routes/weekly.js';

// 确保上传目录存在
mkdirSync(UPLOAD_PATH, { recursive: true });
mkdirSync('./db', { recursive: true });

const app = express();
const server = createServer(app);

// Socket.IO 用于实时通信
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件（上传的图片）
app.use('/uploads', express.static(UPLOAD_PATH));

// API 路由
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);
app.use('/api/wowli', wowliRouter);
app.use('/api/widget', widgetRouter);
app.use('/api/weekly', weeklyRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: USE_MOCK ? 'mock' : 'production',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO 实时通信
io.on('connection', (socket) => {
  console.log('📱 设备已连接:', socket.id);

  // 加入家庭房间
  socket.on('join_family', (familyId) => {
    socket.join(familyId);
    console.log(`👨‍👩‍👧 设备加入家庭: ${familyId}`);
  });

  // 新消息通知
  socket.on('new_message', (data) => {
    const { familyId, message } = data;
    // 广播给家庭其他成员
    socket.to(familyId).emit('message_received', message);
    console.log(`💌 新消息广播到家庭: ${familyId}`);
  });

  // Wowli 状态变化通知
  socket.on('wowli_update', (data) => {
    const { familyId, status } = data;
    socket.to(familyId).emit('wowli_changed', status);
  });

  socket.on('disconnect', () => {
    console.log('📴 设备已断开:', socket.id);
  });
});

// 将 io 挂载到 app 上，供路由使用
app.set('io', io);

// 启动服务器
const getLocalIP = () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

server.listen(SERVER_PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🐾 Wowli 服务器已启动！                                  ║
║                                                           ║
║   本机访问: http://localhost:${SERVER_PORT}                    ║
║   手机访问: http://${localIP}:${SERVER_PORT}                  ║
║                                                           ║
║   模式: ${USE_MOCK ? '🎭 Mock（模拟数据）' : '🤖 Production（真实 API）'}              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
