import "dotenv/config";
import express, { type Request, type Response, NextFunction } from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import { connectDB, prisma } from "./config/prisma.js";

import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import admin from "./middleware/admin.js";

const app = express();

const port = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/admin", adminRouter);

app.use("/api/inngest", serve({ client: inngest, functions }));

// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: error.message });
});

const startServer = async () => {
  try {
    await connectDB();

    console.log("Neon PostgreSQL connection established...");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    await prisma.$disconnect().catch(() => {});

    process.exit(1);
  }
};

startServer();
