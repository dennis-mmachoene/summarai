"use server";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Use a cached instance to avoid redundant initialization
const sql = neon(process.env.DATABASE_URL);

export async function getDbConnection() {
  return sql;
}
