import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get customer ID from params
    const id = params.id

    // Find customer by ID
    const result = await executeQuery<any[]>(
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
      WHERE id = $1`,
      [id],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = result[0]

    return NextResponse.json({
      ...customer,
      id: customer.id.toString(), // Convert ID to string to match existing frontend
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get customer ID from params
    const id = params.id

    // Check if customer exists
    const existingCustomer = await executeQuery<any[]>("SELECT id FROM customers WHERE id = $1", [id])

    if (existingCustomer.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Delete customer
    await executeQuery("DELETE FROM customers WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
