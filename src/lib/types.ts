export interface Customer {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  status: "Lead" | "Active" | "Inactive"
  notes?: string
  lastContactDate: string
  createdAt?: string
  updatedAt?: string
}

export type CustomerFormData = Omit<Customer, "id" | "lastContactDate" | "createdAt" | "updatedAt">
