import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Helper function for direct SQL queries using tagged template literals
export async function executeQuery<T = any>(queryText: string, values: any[] = []): Promise<T> {
  try {
    console.log(`Executing query: ${queryText.slice(0, 100)}...`)

    // Use sql.query for parameterized queries
    const result = await sql.query(queryText, values)

    console.log(`Query result: ${result?.rows?.length || 0} rows`)

    // Return the rows directly
    return (result?.rows || []) as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
