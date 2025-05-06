import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

const seedCustomers = [
  {
    name: "Jane Smith",
    email: "jane@techcorp.com",
    company: "TechCorp",
    phone: "+1 (555) 123-4567",
    status: "Active",
    notes: "Key decision maker for enterprise accounts.",
  },
  {
    name: "John Doe",
    email: "john@innovatech.com",
    company: "InnovaTech",
    phone: "+1 (555) 987-6543",
    status: "Lead",
    notes: "Interested in our premium plan.",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@globalinc.com",
    company: "Global Inc",
    phone: "+1 (555) 456-7890",
    status: "Inactive",
    notes: "Previous contract ended in 2022.",
  },
  {
    name: "Michael Brown",
    email: "michael@nexusgroup.com",
    company: "Nexus Group",
    phone: "+1 (555) 234-5678",
    status: "Active",
    notes: "Recently upgraded to enterprise plan.",
  },
  {
    name: "Emily Wilson",
    email: "emily@apexsolutions.com",
    company: "Apex Solutions",
    phone: "+1 (555) 876-5432",
    status: "Lead",
    notes: "Scheduled demo for next week.",
  },
]

export async function GET() {
  try {
    // Check if we already have customers
    const existingCustomers = await executeQuery<any[]>("SELECT COUNT(*) as count FROM customers", [])

    const count = Number.parseInt(existingCustomers[0].count)

    if (count > 0) {
      return NextResponse.json({
        message: `Database already seeded with ${count} customers.`,
        alreadySeeded: true,
      })
    }

    // Insert seed data
    for (const customer of seedCustomers) {
      await executeQuery(
        `INSERT INTO customers (name, email, company, phone, status, notes) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [customer.name, customer.email, customer.company, customer.phone, customer.status, customer.notes],
      )
    }

    return NextResponse.json({
      message: `Successfully seeded database with ${seedCustomers.length} customers.`,
      success: true,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
