// Round-trip check: list tables and count profiles. `node scripts/db-check.mjs`
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL)
const tables = await sql`select table_name from information_schema.tables where table_schema='public' order by 1`
const [{ count }] = await sql`select count(*)::int as count from profiles`
console.log('tables:', tables.map((t) => t.table_name).join(', '))
console.log('profiles:', count)
