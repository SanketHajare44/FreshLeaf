import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";

const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",")
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      : [];

    if (!adminEmails.includes(user.email.toLowerCase())) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    if (req.user) {
      req.user.isAdmin = true;
    }

    return next();
  } catch (err: unknown) {
    console.error("Admin middleware error:", err);

    return res.status(500).json({
      message: "Admin verification failed",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export default admin;
