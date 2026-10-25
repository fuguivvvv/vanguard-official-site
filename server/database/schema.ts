import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(), // 用户名设为唯一
    email: text('email').notNull().unique(), // 邮箱设为唯一
    password: text('password').notNull(),
    phone: text('phone'),
    create_time: text('create_time').$defaultFn(() => {
        const now = new Date();
        return now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    }),
});

export const customerMessages = sqliteTable('customer_messages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userEmail: text('user_email').notNull(),
    content: text('content').notNull(),
    status: text('status').default('pending'),
    create_time: text('create_time').$defaultFn(() => {
        const now = new Date();
        return now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    }),
});