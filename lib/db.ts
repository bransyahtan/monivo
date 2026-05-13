import postgres from 'postgres'

const connectionString = process.env.DIRECT_URL || ''

if (!connectionString) {
  console.warn('⚠️ DIRECT_URL is missing in .env')
}

// Global connection to prevent multiple connections in development (Next.js hot reload)
const globalForSql = global as unknown as { sql: ReturnType<typeof postgres> }

export const sql = globalForSql.sql || postgres(connectionString, {
  prepare: false // Required for Supabase session pooler if you switch later
})

if (process.env.NODE_ENV !== 'production') globalForSql.sql = sql

export default sql
