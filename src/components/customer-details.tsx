"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Loader2, Edit, ArrowLeft, Trash2 } from "lucide-react"
import type { Customer, CustomerFormData } from "../lib/types"
import CustomerForm from "./customer-form"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"

interface CustomerDetailsProps {
  customerId: string
}

export default function CustomerDetails({ customerId }: CustomerDetailsProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/customers/${customerId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch customer details")
        }

        const data = await response.json()
        setCustomer(data)
      } catch (err) {
        setError("Error loading customer details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      fetchCustomer()
    }
  }, [customerId])

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    // Refetch customer data to show updated information
    setLoading(true)
    fetch(`/api/customers/${customerId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to refresh customer data")
        return response.json()
      })
      .then((data) => {
        setCustomer(data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete customer")
      }

      // Redirect to customers list
      router.push("/customers")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError("Error deleting customer. Please try again.")
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
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

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/customers")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          {error || "Customer not found"}
        </div>
      </div>
    )
  }

  const customerFormData: CustomerFormData = {
    name: customer.name,
    email: customer.email,
    company: customer.company,
    phone: customer.phone,
    status: customer.status,
    notes: customer.notes,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/customers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditModalOpen(true)} className="sm:ml-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-xl">{customer.name}</CardTitle>
            {getStatusBadge(customer.status)}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-base">{customer.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
              <p className="text-base">{customer.company}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
              <p className="text-base">{customer.phone || "—"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Contact Date</h3>
              <p className="text-base">{new Date(customer.lastContactDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <p className="text-base whitespace-pre-line">{customer.notes || "No notes available."}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm initialData={customerFormData} onSuccess={handleEditSuccess} isEditing={true} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Customer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
