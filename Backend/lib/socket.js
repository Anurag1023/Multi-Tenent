import express from 'express'; 
import { Server } from 'socket.io';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://multi-tenent-omega.vercel.app/"],
  },
});

export { io, app, server };