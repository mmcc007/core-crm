import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    console.log("API: Fetching customers...")

    const customers = await executeQuery<any[]>(
      `SELECT 
        id, 
        name, 
        email, 
        company, 
        phone, 
        status, 
        notes, 
        last_contact_date as "lastContactDate",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM customers
      ORDER BY name ASC`,
      [],
    )

    console.log(`API: Found ${customers?.length || 0} customers`)

    // Ensure we always return an array
    const formattedCustomers = Array.isArray(customers)
      ? customers.map((customer) => ({
          ...customer,
          id: customer.id.toString(), // Convert ID to string to match existing frontend
        }))
      : []

    return NextResponse.json(formattedCustomers)
  } catch (error) {
    console.error("API Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.company || !data.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingCustomer = await executeQuery<any[]>("SELECT id FROM customers WHERE email = $1", [data.email])

    if (existingCustomer.length > 0) {
      return NextResponse.json({ error: "A customer with this email already exists" }, { status: 409 })
    }

    // Create new customer
    const result = await executeQuery<any[]>(
      `INSERT INTO customers (name, email, company, phone, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING 
        id, 
        name, 
        email, 
        company, 
        phone, 
        status, 
        notes, 
        last_contact_date as "lastContactDate",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [data.name, data.email, data.company, data.phone || null, data.status, data.notes || null],
    )

    const newCustomer = result[0]

    return NextResponse.json(
      {
        ...newCustomer,
        id: newCustomer.id.toString(), // Convert ID to string to match existing frontend
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()

    // Find customer by email
    const existingCustomer = await executeQuery<any[]>("SELECT id FROM customers WHERE email = $1", [data.email])

    if (existingCustomer.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customerId = existingCustomer[0].id

    // Update customer data
    const result = await executeQuery<any[]>(
      `UPDATE customers
       SET 
        name = $1,
        company = $2,
        phone = $3,
        status = $4,
        notes = $5,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING 
        id, 
        name, 
        email, 
        company, 
        phone, 
        status, 
        notes, 
        last_contact_date as "lastContactDate",
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [data.name, data.company, data.phone || null, data.status, data.notes || null, customerId],
    )

    const updatedCustomer = result[0]

    return NextResponse.json({
      ...updatedCustomer,
      id: updatedCustomer.id.toString(), // Convert ID to string to match existing frontend
    })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}
