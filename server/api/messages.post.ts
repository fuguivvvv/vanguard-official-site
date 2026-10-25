// server/api/messages.post.ts
import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { db } from '@/server/utils/db' // 请根据您实际的 db 引入路径调整
import { customerMessages } from '@/server/database/schema'

export default defineEventHandler(async (event) => {
    // 1. 从前端请求头中获取用户信息（对应您的 localStorage 认证方案）
    const userEmail = getHeader(event, 'x-user-email')
    const authToken = getHeader(event, 'authorization')

    // 2. 校验是否登录
    if (!authToken || !userEmail) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: 请先登录后再提交留言',
        })
    }

    // 3. 读取前端提交的留言内容
    const body = await readBody(event)
    const { content } = body

    if (!content || !content.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: '留言内容不能为空',
        })
    }

    try {
        // 4. 使用 Drizzle ORM 写入 SQLite 数据库
        await db.insert(customerMessages).values({
            userEmail: userEmail.trim(),
            content: content.trim(),
            status: 'pending',
        })

        return {
            success: true,
            message: '留言提交成功！',
        }
    } catch (error) {
        console.error('Database insertion error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: '数据库写入失败，请稍后再试',
        })
    }
})