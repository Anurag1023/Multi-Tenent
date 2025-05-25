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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use('/api/org', inviteRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);

server.listen(PORT, () => {
  console.log("server is running on PORT:" + "http://localhost:" + PORT);
  connectDB();
});
