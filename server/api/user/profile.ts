import { defineEventHandler, readBody, createError, getHeader, getQuery } from 'h3'
import { db } from '@/server/utils/db'
import { users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const method = event.node.req.method

    // 多重兼容获取 email（Header, Query 或 Body）
    const query = getQuery(event)
    const headerEmail = getHeader(event, 'x-user-email') || getHeader(event, 'X-User-Email')
    let email = headerEmail || (query.email as string)

    if (!email && method === 'PUT') {
        const body = await readBody(event).catch(() => ({}))
        email = body.email
    }

    if (!email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Unauthorized or missing email.'
        })
    }

    try {
        // 1. GET 请求：从数据库获取用户信息并返回给前端
        if (method === 'GET') {
            const [user] = await db.select().from(users).where(eq(users.email, email))
            if (!user) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found.'
                })
            }

            return {
                success: true,
                data: {
                    name: user.name || '',
                    email: user.email,
                    phone: user.phone || ''
                }
            }
        }

        // 2. PUT 请求：更新用户信息
        if (method === 'PUT') {
            const body = await readBody(event)
            const { name, phone } = body

            await db.update(users)
                .set({
                    name: name || '',
                    phone: phone || null
                })
                .where(eq(users.email, email))

            return {
                success: true,
                message: 'Profile updated successfully.'
            }
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})