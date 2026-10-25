import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { db } from '@/server/utils/db'
import { users } from '@/server/database/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { oldPassword, newPassword } = body

    // 获取当前用户的邮箱（从请求头或请求体中获取）
    let email = getHeader(event, 'x-user-email') || getHeader(event, 'X-User-Email')
    if (!email && body.email) {
        email = body.email
    }

    if (!email || !oldPassword || !newPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields or unauthorized.'
        })
    }

    try {
        // 1. 查找用户
        const [user] = await db.select().from(users).where(eq(users.email, email))
        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found.'
            })
        }

        // 2. 校验旧密码是否正确
        const isValidPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isValidPassword) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Current password is incorrect.'
            })
        }

        // 3. 对新密码进行加密
        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        // 4. 更新数据库中的密码
        await db.update(users)
            .set({ password: hashedNewPassword })
            .where(eq(users.email, email))

        return {
            success: true,
            message: 'Password updated successfully.'
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