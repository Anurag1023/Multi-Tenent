import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';


import { app, server } from './lib/socket.js';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import inviteRoutes from './routes/invite.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import organizationRoutes from './routes/organization.routes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: "*"
};
app.use(cors(corsOptions));


app.use("/api/auth", authRoutes);
app.use('/api/org', inviteRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server!');
});

server.listen(PORT, () => {
  console.log("server is running on PORT:" + "http://localhost:" + PORT);
  connectDB();
});
