import { defineEventHandler, getQuery, createError } from 'h3'
import { db } from '@/server/utils/db'
import { customerMessages } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const email = query.email as string

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'User email is required.' })
    }

    try {
        // 使用 schema.ts 中导出的 customerMessages
        const userMessages = await db.select().from(customerMessages).where(eq(customerMessages.userEmail, email))
        return { success: true, data: userMessages }
    } catch (error) {
        return { success: false, data: [] }
    }
})