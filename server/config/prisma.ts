import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATA_BASE_URL;

if (!connectionString) {
  throw new Error("DATA_BASE_URL is missing from .env file");
}

const adapter = new PrismaNeon({
  connectionString,
});

export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  await prisma.$connect();

  // Verify that the database is actually reachable.
  await prisma.$queryRaw`SELECT 1`;
};
