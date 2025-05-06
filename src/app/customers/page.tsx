import CustomerList from "../../components/customer-list"

export const metadata = {
  title: "Customers | B2B CRM",
  description: "Manage your customer relationships",
}

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <CustomerList />
    </div>
  )
}
