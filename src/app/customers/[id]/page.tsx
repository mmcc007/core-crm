import type { Metadata } from "next"
import CustomerDetails from "../../../components/customer-details"

interface CustomerPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CustomerPageProps): Promise<Metadata> {
  return {
    title: "Customer Details | B2B CRM",
    description: "View and manage customer details",
  }
}

export default function CustomerPage({ params }: CustomerPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <CustomerDetails customerId={params.id} />
      </div>
    </div>
  )
}
