"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleSeed = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seed")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({ error: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>Populate your CRM with sample customer data to get started quickly.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              This will add 5 sample customers to your database. This is useful for testing and development.
            </p>
            {result && (
              <div
                className={`p-3 rounded-md mb-4 ${
                  result.error
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {result.message || result.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSeed}
              disabled={loading || result?.success || result?.alreadySeeded}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                "Seed Database"
              )}
            </Button>
            <Link href="/customers" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Go to Customers
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
