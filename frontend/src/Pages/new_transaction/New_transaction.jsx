import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function NewTransactionPage() {
  const navigate = useNavigate()

  const [type, setType] = useState("credit")
  const [amount, setAmount] = useState("")
  const [person, setPerson] = useState("")
  const [purpose, setPurpose] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 👥 You can later load this from localStorage or backend
  const people = ["Harshal Bhavsar", "Ankita Bhavsar", "Dikshant Bhavsar", "Other"]

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation for Select
    if (!person) {
      alert("Please select a person")
      return
    }

    setIsSubmitting(true)

    const value = parseFloat(amount)

    const API_BASE = import.meta.env.VITE_API_BASE

    fetch(`${API_BASE}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: value, person, purpose, timestamp: new Date() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add transaction')
        return res.json()
      })
      .then(() => {
        navigate('/expense-tracker')
      })
      .catch((err) => {
        console.error(err)
        alert('Could not save transaction. Check console for details.')
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            to="/expense-tracker"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            New Transaction
          </h1>
          <p className="text-muted-foreground">
            Add a credit or debit to the shared balance
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div className="space-y-3">
              <Label>Transaction Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType("credit")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    type === "credit"
                      ? "border-green-500 bg-green-500/10"
                      : "border-border hover:border-green-500/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Credit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add funds
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setType("debit")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    type === "debit"
                      ? "border-red-500 bg-red-500/10"
                      : "border-border hover:border-red-500/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">Debit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remove funds
                  </p>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="pl-8 text-lg"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Person (shadcn Select) */}
            <div className="space-y-2">
              <Label>Person</Label>
              <Select value={person} onValueChange={setPerson}>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>

                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                placeholder="What is this transaction for?"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link to="/expense-tracker" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Transaction"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
