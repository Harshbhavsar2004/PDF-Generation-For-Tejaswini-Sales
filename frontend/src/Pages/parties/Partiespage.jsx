import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  ArrowUpRight,
  ArrowDownRight,
  User,
  ArrowLeft,
  Download,
} from "lucide-react"
import { Link } from "react-router-dom"

// PDF
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function PartiesPage() {
  const [transactions, setTransactions] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const API_BASE = import.meta.env.VITE_API_BASE

    fetch(`${API_BASE}/api/expenses`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load transactions")
        return res.json()
      })
      .then((data) => {
        if (!data.transactions) return
        setTransactions(
          data.transactions.map((t) => ({
            id: t._id || t.id,
            type: t.type,
            amount: Number(t.amount),
            person: t.person,
            purpose: t.purpose || "",
            timestamp: new Date(t.timestamp),
          }))
        )
      })
      .catch(console.error)
  }, [])

  if (!mounted) return null

  // -------- PARTY STATS --------
  const partyStats = Object.values(
    transactions.reduce((acc, t) => {
      if (!acc[t.person]) {
        acc[t.person] = {
          name: t.person,
          totalCredits: 0,
          totalDebits: 0,
          netContribution: 0,
          transactionCount: 0,
        }
      }

      if (t.type === "credit") {
        acc[t.person].totalCredits += t.amount
        acc[t.person].netContribution += t.amount
      } else {
        acc[t.person].totalDebits += t.amount
        acc[t.person].netContribution -= t.amount
      }

      acc[t.person].transactionCount++
      return acc
    }, {})
  ).sort((a, b) => b.netContribution - a.netContribution)

  // -------- PARTY PDF --------
  const downloadPartyPDF = (partyName) => {
    const partyTransactions = transactions.filter(
      (t) => t.person === partyName
    )

    const totalCredits = partyTransactions
      .filter((t) => t.type === "credit")
      .reduce((s, t) => s + t.amount, 0)

    const totalDebits = partyTransactions
      .filter((t) => t.type === "debit")
      .reduce((s, t) => s + t.amount, 0)

    const net = totalCredits - totalDebits

    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text(`Party Expense Report`, 14, 20)

    doc.setFontSize(12)
    doc.text(`Party Name: ${partyName}`, 14, 30)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38)

    // Table
    const columns = ["Date", "Purpose", "Type", "Amount"]
    const rows = partyTransactions.map((t) => [
      t.timestamp.toLocaleDateString(),
      t.purpose,
      t.type.toUpperCase(),
      `${t.type === "credit" ? "+" : "-"}Rs. ${t.amount.toFixed(2)}`,
    ])

    autoTable(doc, {
      startY: 45,
      head: [columns],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] },
    })

    // Summary page
    doc.addPage()
    doc.setFontSize(18)
    doc.text("Final Summary", 14, 20)

    doc.setFontSize(13)
    doc.text(`Total Credits : Rs. ${totalCredits.toFixed(2)}`, 14, 45)
    doc.text(`Total Debits  : Rs. ${totalDebits.toFixed(2)}`, 14, 60)

    doc.setFontSize(15)
    doc.setTextColor(net >= 0 ? 0 : 180, net >= 0 ? 128 : 0, 0)
    doc.text(`Net Contribution : Rs. ${net.toFixed(2)}`, 14, 80)

    doc.save(`${partyName}-expense-report.pdf`)
  }

  // -------- UI --------
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b backdrop-blur sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <nav className="flex gap-6">
            <Link
              to="/expense-tracker"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/expense-tracker/transactions"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Transactions
            </Link>
            <Link to="/expense-tracker/parties" className="text-sm font-medium">
              Parties
            </Link>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Parties</h1>
        <p className="text-muted-foreground mb-8">
          Party-wise contribution summary and reports
        </p>

        {partyStats.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="mx-auto mb-4 text-muted-foreground" />
            <p>No parties yet</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {partyStats.map((party) => (
              <Card key={party.name} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{party.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {party.transactionCount} transactions
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadPartyPDF(party.name)}
                    className="flex items-center gap-2 text-sm px-3 py-2 border rounded-md hover:bg-muted transition"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Credits</span>
                    <span className="text-green-500 font-semibold">
                      ₹{party.totalCredits.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debits</span>
                    <span className="text-red-500 font-semibold">
                      ₹{party.totalDebits.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t flex justify-between">
                    <span className="font-medium">Net</span>
                    <span
                      className={`font-bold ${
                        party.netContribution >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      ₹{party.netContribution.toFixed(2)}
                    </span>
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
