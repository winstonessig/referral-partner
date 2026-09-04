import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name").notNull(),
  brokerage: text("brokerage").notNull(),
  logoUrl: text("logo_url"),
  headshotUrl: text("headshot_url"),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const referrals = sqliteTable("referrals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  moveDate: text("move_date"),
  message: text("message"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});
