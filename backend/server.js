import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import  initializeFirebase from "./src/config/firebase.js";
import { initializeDefaultSuperAdmin } from "./src/initializations/defaultSuperAccount.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

// connect to firebase
initializeFirebase();

initializeDefaultSuperAdmin().then(() => {
  console.log('✅ Server initialization completed.....\n');
});

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));