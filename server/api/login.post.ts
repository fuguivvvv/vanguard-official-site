import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '@/server/utils/db'
import { users } from '@/server/database/schema'
import { eq, or } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { account, password } = body // 这里的 account 可以是用户名或邮箱

    if (!account || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Account and password are required.' })
    }

    // 同时匹配 name 或 email
    const [user] = await db.select().from(users).where(
        or(eq(users.name, account), eq(users.email, account))
    )

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid username/email or password.' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid username/email or password.' })
    }

    return {
        success: true,
        token: 'token_' + Date.now() + '_' + user.id,
        email: user.email,
        name: user.name,
        phone: user.phone
    }
})