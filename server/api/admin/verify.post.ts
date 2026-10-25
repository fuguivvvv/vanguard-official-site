import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { token } = body

    // 校验规则：必须包含有效的前缀且存在
    if (token && typeof token === 'string' && token.startsWith('admin_token_')) {
        return { success: true }
    }

    return { success: false }
})