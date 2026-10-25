import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '@/server/utils/db'
import { users } from '@/server/database/schema'
import { eq, or } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, phone, password } = body

    if (!name || !email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Username, email, and password are required.' })
    }

    // 检查用户名或邮箱是否已被占用
    const existingUser = await db.select().from(users).where(
        or(eq(users.name, name), eq(users.email, email))
    )

    if (existingUser.length > 0) {
        const matched = existingUser[0]
        if (matched.name === name) {
            throw createError({ statusCode: 400, statusMessage: 'Username already exists. Please choose another.' })
        }
        if (matched.email === email) {
            throw createError({ statusCode: 400, statusMessage: 'Email address is already registered.' })
        }
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await db.insert(users).values({
            name,
            email,
            phone: phone || null,
            password: hashedPassword
        })

        return { success: true, message: 'Registration successful!' }
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Internal server error during registration.' })
    }
})