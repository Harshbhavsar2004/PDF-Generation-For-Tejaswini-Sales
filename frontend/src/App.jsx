"use client"

import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom"

import WorkCompletionForm from "./Pages/work_completion"
import MultiPurposeForm from "./Pages/multi_purpose_form"
import ExpenseTracker from "./Pages/expense_tracker"
import NewTransactionPage from "./Pages/new_transaction/New_transaction"
import TransactionsPage from "./Pages/transactions/transactions"
import PartiesPage from "./Pages/parties/Partiespage"
import SolarGSTBill from "./Pages/Solarbillformat"

// -------------------- HOME --------------------
const Home = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      
      {/* HERO */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Manage Solar Reports & Expenses  
          <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Smartly & Professionally
          </span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
          Generate work completion PDFs, manage solar documentation,
          and track shared expenses — all in one simple platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/generate-report"
            className="px-8 py-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Generate Report
          </Link>

          <Link
            to="/expense-tracker"
            className="px-8 py-4 rounded-xl border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition"
          >
            Track Expenses
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          
          <FeatureCard
            title="Work Completion PDFs"
            desc="Generate professional solar work completion reports ready for MSEDCL & clients."
          />

          <FeatureCard
            title="All Solar Documents"
            desc="Centralized place for installation, commissioning & multi-purpose PDFs."
          />

          <FeatureCard
            title="Shared Expense Tracker"
            desc="Track credits & debits with parties, purposes & real-time balance."
          />

        </div>
      </section>
    </div>
  )
}


// -------------------- FEATURE CARD --------------------
const FeatureCard = ({ title, desc }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
      <h3 className="text-xl font-bold mb-3 text-purple-600">
        {title}
      </h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  )
}


// -------------------- NAVIGATION --------------------
const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Solar PDF
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/generate-report" className="nav-link">Work Completion</Link>
          <Link to="/billing-page" className="nav-link">Billing Page</Link>
          <Link to="/multi-purpose" className="nav-link">Documents</Link>
        </div>

        {/* CTA */}
        <Link
          to="/expense-tracker"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition"
        >
          Expense Tracker
        </Link>
      </div>
    </nav>
  )
}



// -------------------- LAYOUT (HIDES NAV) --------------------
const Layout = ({ children }) => {
  const location = useLocation()

  // Hide navbar on expense-tracker and sub routes
  const hideNav = location.pathname.startsWith("/expense-tracker")

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNav && <Navigation />}
      {children}
    </div>
  )
}


// -------------------- APP --------------------
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate-report" element={<WorkCompletionForm />} />
          <Route path="/multi-purpose" element={<MultiPurposeForm />} />
          <Route path="/billing-page" element={<SolarGSTBill />} />
          {/* Expense Tracker (NO NAVBAR) */}
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route
            path="/expense-tracker/new-transaction"
            element={<NewTransactionPage />}
          />
          <Route
            path="/expense-tracker/transactions"
            element={<TransactionsPage />}
          />
          <Route
            path="/expense-tracker/parties"
            element={<PartiesPage />}
          />
        </Routes>
      </Layout>
    </Router>
  )
}
