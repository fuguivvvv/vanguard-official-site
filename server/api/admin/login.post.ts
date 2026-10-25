import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '@/server/utils/db'
import { users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body // 前端传过来的字段对应表单中的 account/email

    if (!email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Username and password are required.' })
    }

    // 严格限制：只有当用户名（name）是 'admin' 时才允许登录，并从数据库真实查询
    if (email !== 'admin') {
        throw createError({ statusCode: 401, statusMessage: 'Access denied. Invalid admin username.' })
    }

    // 在数据库的 users 表中查找 name 为 'admin' 的用户
    const [adminUser] = await db.select().from(users).where(eq(users.name, 'admin'))

    if (!adminUser) {
        throw createError({ statusCode: 401, statusMessage: 'Admin account not found in database.' })
    }

    // 使用 bcrypt 校验密码
    const isValidPassword = await bcrypt.compare(password, adminUser.password)
    if (!isValidPassword) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid admin password.' })
    }

    return {
        success: true,
        token: 'admin_token_' + Date.now() + '_' + adminUser.id,
        name: adminUser.name
    }
})