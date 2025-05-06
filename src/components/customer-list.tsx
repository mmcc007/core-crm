"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import type { Customer } from "../lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Alert, AlertDescription } from "../components/ui/alert"

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [companyFilter, setCompanyFilter] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching customers...")
        const response = await fetch("/api/customers")

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error response:", response.status, errorData)
          throw new Error(errorData.error || `Failed to fetch customers: ${response.status}`)
        }

        const data = await response.json()
        console.log("Customers data:", data)

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", typeof data, data)
          throw new Error("Invalid response format")
        }

        setCustomers(data)
      } catch (err) {
        console.error("Error in fetchCustomers:", err)
        setError(err instanceof Error ? err.message : "Error loading customers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = statusFilter ? customer.status === statusFilter : true
    const matchesCompany = companyFilter ? customer.company.toLowerCase().includes(companyFilter.toLowerCase()) : true
    return matchesStatus && matchesCompany
  })

  const handleViewDetails = (id: string) => {
    router.push(`/customers/${id}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Lead":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
      case "Active":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      case "Inactive":
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto flex-1">
          <Input
            placeholder="Search by company name"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button className="w-full sm:w-auto ml-auto" onClick={() => router.push("/customers/new")}>
          Add Customer
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No customers found. Try adjusting your filters or add a new customer.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    {customer.lastContactDate ? new Date(customer.lastContactDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(customer.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-lg">
            No customers found. Try adjusting your filters or add a new customer.
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  {customer.name}
                  {getStatusBadge(customer.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm font-medium text-gray-500">Email:</div>
                  <div className="text-sm">{customer.email}</div>

                  <div className="text-sm font-medium text-gray-500">Company:</div>
                  <div className="text-sm">{customer.company}</div>

                  <div className="text-sm font-medium text-gray-500">Last Contact:</div>
                  <div className="text-sm">
                    {customer.lastContactDate ? new Date(customer.lastContactDate).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleViewDetails(customer.id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
