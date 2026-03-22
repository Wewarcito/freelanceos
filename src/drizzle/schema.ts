import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export const supporters = pgTable("supporters", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .unique()
    .notNull(),
  kofiLink: text("kofi_link"),
  tier: text("tier").default("coffee"),
  totalDonated: real("total_donated").default(0),
  isVerified: text("is_verified").default("false"),
  verifiedAt: timestamp("verified_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  clientId: text("client_id").references(() => clients.id),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("potential"),
  budget: real("budget"),
  deadline: timestamp("deadline", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export const timeEntries = pgTable("time_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  projectId: text("project_id").references(() => projects.id),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }),
  duration: text("duration"),
  description: text("description"),
  billable: text("billable").default("true"),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  projectId: text("project_id").references(() => projects.id),
  invoiceNumber: text("invoice_number").unique().notNull(),
  status: text("status").default("draft"),
  amount: real("amount").notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  paidDate: timestamp("paid_date", { mode: "date" }),
  items: text("items"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
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
