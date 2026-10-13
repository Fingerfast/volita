import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const posts = sqliteTable("posts", {
 id: text("id").primaryKey(), author: text("author").notNull(), body: text("body").notNull(),
 category: text("category").notNull(), status: text("status").notNull().default("new"), created: integer("created").notNull(),
 title:text("title").notNull().default(""), priority:text("priority").notNull().default("medium"),
 effort:text("effort").notNull().default("unknown"), url:text("url").notNull().default(""),
 format:text("format").notNull().default("plain"), attachments:text("attachments").notNull().default("[]")
}, table => [index("idx_posts_created").on(table.created)]);
