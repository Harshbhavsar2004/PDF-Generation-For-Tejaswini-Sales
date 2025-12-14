import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  TrendingUp,
  ArrowLeft
} from "lucide-react"
import { Link } from "react-router-dom"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const API_BASE = import.meta.env.VITE_API_BASE

    fetch(`${API_BASE}/api/expenses`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load transactions')
        return res.json()
      })
      .then((data) => {
        if (!data.transactions) return
        setTransactions(
          data.transactions.map((t) => ({
            id: t._id || t.id,
            type: t.type,
            amount: typeof t.amount === 'string' ? Number(t.amount) : t.amount,
            person: t.person,
            purpose: t.purpose || '',
            timestamp: new Date(t.timestamp),
          }))
        )
      })
      .catch((err) => console.error(err))
  }, [])

  const filteredTransactions = transactions.filter(
    (t) =>
      t.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home Page
              </Link>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              to="/expense-tracker"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>

            <Link to="/expense-tracker/transactions" className="text-sm font-medium">
              Transactions
            </Link>

            <Link
              to="/expense-tracker/parties"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Parties
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            All Transactions
          </h1>
          <p className="text-muted-foreground">
            Complete history of all credits and debits
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by person or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Transactions */}
        {filteredTransactions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>

            <h4 className="text-lg font-medium mb-2">
              {searchQuery
                ? "No transactions found"
                : "No transactions yet"}
            </h4>

            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by adding your first transaction"}
            </p>

            {!searchQuery && (
              <Link to="/expense-tracker/new-transaction">
                <Button>Add Transaction</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <Card
                key={transaction.id}
                className="p-6 hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-green-500/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowUpRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-6 h-6 text-red-500" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-lg mb-1">
                        {transaction.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {transaction.person}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.timestamp.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" at "}
                        {transaction.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p
                      className={`text-2xl font-bold ${
                        transaction.type === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
