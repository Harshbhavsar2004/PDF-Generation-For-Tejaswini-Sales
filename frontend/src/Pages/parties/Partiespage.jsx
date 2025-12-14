import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  User,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PartiesPage() {
  const [transactions, setTransactions] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const API_BASE = import.meta.env.VITE_API_BASE;

    fetch(`${API_BASE}/api/expenses`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load transactions");
        return res.json();
      })
      .then((data) => {
        if (!data.transactions) return;
        setTransactions(
          data.transactions.map((t) => ({
            id: t._id || t.id,
            type: t.type,
            amount: typeof t.amount === "string" ? Number(t.amount) : t.amount,
            person: t.person,
            purpose: t.purpose || "",
            timestamp: new Date(t.timestamp),
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const partyStats = Object.values(
    transactions.reduce((acc, t) => {
      if (!acc[t.person]) {
        acc[t.person] = {
          name: t.person,
          totalCredits: 0,
          totalDebits: 0,
          netContribution: 0,
          transactionCount: 0,
        };
      }

      if (t.type === "credit") {
        acc[t.person].totalCredits += t.amount;
        acc[t.person].netContribution += t.amount;
      } else {
        acc[t.person].totalDebits += t.amount;
        acc[t.person].netContribution -= t.amount;
      }

      acc[t.person].transactionCount++;
      return acc;
    }, {})
  ).sort((a, b) => b.netContribution - a.netContribution);

  if (!mounted) return null;

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

            <Link
              to="/expense-tracker/transactions"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Transactions
            </Link>

            <Link to="/expense-tracker/parties" className="text-sm font-medium">
              Parties
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Parties</h1>
          <p className="text-muted-foreground">
            See contributions and activity for each party
          </p>
        </div>

        {partyStats.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium mb-2">No parties yet</h4>
            <p className="text-muted-foreground">
              Add transactions to see party statistics
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partyStats.map((party, index) => (
              <Card
                key={party.name}
                className="p-6 hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{party.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {party.transactionCount} transaction
                      {party.transactionCount !== 1 && "s"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Credits</span>
                    </div>
                    <span className="font-semibold text-green-500">
                      ₹{party.totalCredits.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Debits</span>
                    </div>
                    <span className="font-semibold text-red-500">
                      ₹{party.totalDebits.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Net Contribution</span>
                      <span
                        className={`text-lg font-bold ${
                          party.netContribution >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {party.netContribution >= 0 ? "+" : ""}₹
                        {party.netContribution.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
