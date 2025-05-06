import CustomerForm from "../../../components/customer-form"

export const metadata = {
  title: "Add New Customer | B2B CRM",
  description: "Add a new customer to your CRM",
}

export default function NewCustomerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      <div className="max-w-3xl mx-auto">
        <CustomerForm />
      </div>
    </div>
  )
}
