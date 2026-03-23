import { pgTable, text, timestamp, real, varchar, integer } from "drizzle-orm/pg-core";

export const authUsers = pgTable("auth_users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const authAccounts = pgTable("auth_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const authSessions = pgTable("auth_sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const authVerificationTokens = pgTable("auth_verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const supporters = pgTable("supporters", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => authUsers.id)
    .unique()
    .notNull(),
  kofiLink: text("kofi_link"),
  tier: text("tier").default("coffee"),
  totalDonated: real("total_donated").default(0),
  isVerified: text("is_verified").default("false"),
  verifiedAt: timestamp("verified_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => authUsers.id)
    .notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  clientId: text("client_id").references(() => clients.id),
  userId: text("user_id")
    .references(() => authUsers.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("potential"),
  budget: real("budget"),
  deadline: timestamp("deadline", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const timeEntries = pgTable("time_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => authUsers.id)
    .notNull(),
  projectId: text("project_id").references(() => projects.id),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }),
  duration: text("duration"),
  description: text("description"),
  billable: text("billable").default("true"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => authUsers.id)
    .notNull(),
  projectId: text("project_id").references(() => projects.id),
  invoiceNumber: text("invoice_number").unique().notNull(),
  status: text("status").default("draft"),
  amount: real("amount").notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  paidDate: timestamp("paid_date", { mode: "date" }),
  items: text("items"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type AuthUser = typeof authUsers.$inferSelect;
export type NewAuthUser = typeof authUsers.$inferInsert;
export type Supporter = typeof supporters.$inferSelect;
export type NewSupporter = typeof supporters.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
