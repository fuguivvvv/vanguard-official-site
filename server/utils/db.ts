import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../database/schema';

// 使用 libsql 客户端连接本地文件，完美支持 Windows / Mac / Linux，零编译错误！
const client = createClient({
    url: 'file:sqlite.db',
});


export const db = drizzle(client, { schema });

