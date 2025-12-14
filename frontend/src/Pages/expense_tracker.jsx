"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Users,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
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
        // data should be { transactions, balance }
        if (data.transactions) {
          setTransactions(
            data.transactions.map((t) => ({
              id: t._id || t.id,
              ...t,
              timestamp: new Date(t.timestamp),
            }))
          );
        }
        if (typeof data.balance === "number") setBalance(data.balance);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const recentTransactions = transactions.slice(0, 5);
  const totalCredits = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  if (!mounted) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();

    // ---------- TITLE ----------
    doc.setFontSize(18);
    doc.text("Shared Expense Report", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // ---------- TABLE DATA ----------
    const tableColumn = ["Date", "Person", "Purpose", "Type", "Amount"];

    const tableRows = transactions.map((t) => [
      t.timestamp.toLocaleDateString(),
      t.person,
      t.purpose,
      t.type.toUpperCase(),
      `${t.type === "credit" ? "+" : "-"}$${t.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [99, 102, 241], // Indigo
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // ---------- SUMMARY PAGE ----------
    doc.addPage();

    doc.setFontSize(18);
    doc.text("Final Summary", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(0);

    doc.text(`Total Credits : $${totalCredits.toFixed(2)}`, 14, 40);
    doc.text(`Total Debits  : $${totalDebits.toFixed(2)}`, 14, 55);

    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0);
    doc.text(`Final Balance : $${balance.toFixed(2)}`, 14, 75);

    doc.save("expense-report.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
            <Link href="/" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link
              to="/expense-tracker/transactions"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
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

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-balance">
            Shared Balance Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Track shared expenses effortlessly. Every transaction is
            transparent, showing who contributed, how much, and for what
            purpose.
          </p>
        </div>

        {/* Balance Card */}
        <Card className="max-w-2xl mx-auto p-8 mb-8 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-lg animate-slide-up">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Current Balance
            </p>
            <p className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              ${balance.toFixed(2)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/expense-tracker/new-transaction">
                <Button
                  size="lg"
                  className="gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  New Transaction
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                onClick={downloadPDF}
                className="gap-2"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card
            className="p-6 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  ${totalCredits.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  ${totalDebits.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-semibold">{transactions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Recent Activity</h3>
            <Link to="/expense-tracker/transactions">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">No transactions yet</h4>
              <p className="text-muted-foreground mb-6">
                Get started by adding your first transaction
              </p>
              <Link href="/new-transaction">
                <Button>Add Transaction</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <Card
                  key={transaction.id}
                  className="p-4 hover:shadow-md transition-all cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "credit"
                            ? "bg-green-500/10"
                            : "bg-red-500/10"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.purpose}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.person} •{" "}
                          {transaction.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
