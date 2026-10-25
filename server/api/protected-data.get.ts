import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your_jwt_secret_key_here'

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({ statusCode: 401, statusMessage: 'Missing or malformed token' })
    }

    const token = authHeader.split(' ')[1]

    try {
        // 验证 JWT 是否合法及是否过期
        const decoded = jwt.verify(token, JWT_SECRET)
        return { success: true, data: 'Here is your protected testing data', user: decoded }
    } catch (err) {
        throw createError({ statusCode: 403, statusMessage: 'Invalid or expired token' })
    }
})