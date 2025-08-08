import express from 'express'; 
import { Server } from 'socket.io';
import http from 'http';

const app = express();

const server = http.createServer(app);

export { app, server };