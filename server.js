// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Configure CORS
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Connect routes
app.use("/api/auth", authRoutes);

// ✅ Test route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Node backend!" });
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
