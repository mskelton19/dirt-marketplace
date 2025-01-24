import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/Overview"
import { RecentSales } from "@/components/RecentSales"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { Listing } from "@/types/listing"

interface AnalyticsDashboardProps {
  listings: Listing[]
  currentUser: any
}

export function AnalyticsDashboard({ listings, currentUser }: AnalyticsDashboardProps) {
  const totalListings = listings.length
  const activeListings = listings.filter((listing) => listing.status === "active").length
  const completedListings = listings.filter((listing) => listing.status === "completed").length

  const topPartners = useMemo(() => {
    const partnerCounts = listings.reduce(
      (acc, listing) => {
        if (listing.partner_company) {
          acc[listing.partner_company] = (acc[listing.partner_company] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(partnerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([partner, count]) => ({ partner, count }))
  }, [listings])

  const partnerChartData = topPartners.map(({ partner, count }) => ({
    partner: partner.slice(0, 10) + (partner.length > 10 ? "..." : ""), // Truncate long names
    transactions: count,
  }))

  const monthlyMaterialMoved = useMemo(() => {
    const monthlyData: Record<string, Record<string, number>> = {}
    listings.forEach((listing) => {
      if (listing.status === "completed") {
        const date = new Date(listing.created_at)
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {}
        }
        monthlyData[monthYear][listing.material] =
          (monthlyData[monthYear][listing.material] || 0) + (listing.quantity_moved || 0)
      }
    })

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([date, materials]) => ({
        date,
        ...materials,
        total: Object.values(materials).reduce((sum, quantity) => sum + quantity, 0),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12) // Get the last 12 months
  }, [listings])

  const totalMaterialMoved = useMemo(() => {
    return listings.reduce((total, listing) => total + (listing.quantity_moved || 0), 0)
  }, [listings])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalListings}</div>
                <p className="text-xs text-muted-foreground">All listings created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeListings}</div>
                <p className="text-xs text-muted-foreground">Currently active listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Listings</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedListings}</div>
                <p className="text-xs text-muted-foreground">Successfully completed listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Material Moved</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMaterialMoved.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total quantity of material moved</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={monthlyMaterialMoved} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your 5 most recent completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Top Transaction Partners</CardTitle>
              <CardDescription>Your most frequent transaction partners based on completed listings</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={partnerChartData}>
                  <XAxis dataKey="partner" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar dataKey="transactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

