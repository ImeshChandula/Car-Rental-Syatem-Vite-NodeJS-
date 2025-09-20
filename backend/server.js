import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import  initializeFirebase from "./src/config/firebase.js";
import { initializeDefaultSuperAdmin } from "./src/initializations/defaultSuperAccount.js";

import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import passwordRoutes from "./src/routes/passwordRoutes.js";
import myProfileRoutes from "./src/routes/commonUserRoutes.js";
import googleAuthRoutes from "./src/routes/googleAuthRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// connect to firebase
initializeFirebase();

const initializeDefaults = async () => {
  try {
    await initializeDefaultSuperAdmin();
    console.log('✅ Server initialization completed.....\n');
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
  }
};

initializeDefaults();

const allowedOrigins = [
  process.env.PRODUCTION_WEB_URL,
  process.env.DEVELOPMENT_WEB_URL
].filter(Boolean);

const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/myProfile", myProfileRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/user", userRoutes);

//  Route handler for the root path
app.get('/', (req, res) => {
  res.send('Its Working...!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));