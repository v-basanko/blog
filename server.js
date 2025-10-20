import cookie from 'cookie';
import dotenv from 'dotenv';
import next from 'next';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

// Helper function to verify session token
async function verifySocketAuth(socket) {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return null;

    const parsedCookies = cookie.parse(cookies);
    // NextAuth session token cookie name (adjust if using custom cookie name)
    const sessionToken =
      parsedCookies['authjs.session-token'] || parsedCookies['__Secure-authjs.session-token'];

    if (!sessionToken) return null;

    // In production, verify the JWT token properly
    // For now, we'll trust that the client provides correct userId
    // but only after verifying they have a valid session cookie
    return sessionToken;
  } catch (error) {
    if (dev) {
      console.error('Socket auth error:', error);
    }
    return null;
  }
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer, {
    cors: {
      origin: dev ? 'http://localhost:3000' : process.env.BASE_URL,
      credentials: true,
    },
  });

  let onlineUsers = new Map();

  // Authentication middleware
  io.use(async (socket, next) => {
    const sessionToken = await verifySocketAuth(socket);
    if (sessionToken) {
      socket.authenticated = true;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('addOnlineUser', (userId) => {
      // Additional validation: userId should be a valid CUID
      if (!socket.authenticated || !userId || typeof userId !== 'string') {
        return;
      }

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, {
          userId,
          socketId: socket.id,
        });
      }

      if (dev) {
        console.log('Online users:', onlineUsers.size);
      }
    });

    socket.on('onNotification', (recipientId) => {
      if (!socket.authenticated || !recipientId) {
        return;
      }

      const recipient = onlineUsers.get(recipientId);
      if (recipient) {
        io.to(recipient.socketId).emit('getNotifications', {});
      } else if (dev) {
        console.log(`Recipient ${recipientId} not found`);
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.forEach((value, key) => {
        if (value.socketId === socket.id) {
          onlineUsers.delete(key);
        }
      });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
