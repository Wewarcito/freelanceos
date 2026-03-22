import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/drizzle/schema";

type D1Database = {
  prepare: (sql: string) => {
    bind: (...args: unknown[]) => {
      first: <T>() => Promise<T | null>;
      all: <T>() => Promise<{ results: T[] }>;
      run: () => Promise<void>;
    };
  };
  exec: (sql: string) => Promise<void>;
};

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
