import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

export function RecentSales() {
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("partner_company, material, quantity_moved, created_at")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching recent transactions:", error)
      } else {
        setRecentTransactions(data || [])
      }
    }

    fetchRecentTransactions()
  }, [supabase])

  return (
    <div className="space-y-8">
      {recentTransactions.map((transaction, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.partner_company}</p>
            <p className="text-sm text-muted-foreground">{transaction.material}</p>
          </div>
          <div className="ml-auto font-medium">{transaction.quantity_moved.toLocaleString()} units</div>
        </div>
      ))}
    </div>
  )
}

