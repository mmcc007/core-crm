import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">B2B Customer Relationship Management</h1>
        <p className="text-xl text-gray-600">Manage your business customers with our simplified CRM solution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>View and manage all your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/customers" passHref>
              <Button className="w-full">View Customers</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Customer</CardTitle>
            <CardDescription>Create a new customer record</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/customers/new" passHref>
              <Button className="w-full">Add New Customer</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>Populate with sample data</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/seed" passHref>
              <Button variant="outline" className="w-full">
                Seed Database
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
