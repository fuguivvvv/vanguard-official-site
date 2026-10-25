import { defineEventHandler } from 'h3'
import { db } from '@/server/utils/db'
import { users } from '@/server/database/schema'

export default defineEventHandler(async () => {
    try {
        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            created_time: users.create_time
        }).from(users)

        return { success: true, data: allUsers }
    } catch (error) {
        return { success: false, data: [] }
    }
})