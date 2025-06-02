"use client"

import React, { useState } from "react"
import WorkCompletionForm from "./Pages/work_completion"
import MultiPurposeForm from "./Pages/multi_purpose_form"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

// Home component
const Home = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Solar PDF Generator</h1>
        <p className="mb-8 text-gray-600">Generate and manage PDF reports efficiently</p>
        <div className="space-y-4">
          <div>
            <Link 
              to="/generate-report" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              Work Completion Report
            </Link>
          </div>
          <div>
            <Link 
              to="/multi-purpose" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              All Document Types
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// About component
const About = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-gray-600">
        We specialize in providing efficient solutions for generating work completion reports
        for solar installations. Our system makes it easy to create professional reports
        with proper formatting and necessary details.
      </p>
    </div>
  )
}

// Navigation component
const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-purple-600">
            Solar PDF Generator
          </Link>
          <div className="space-x-6">
            <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/generate-report" className="text-gray-600 hover:text-purple-600">Work Completion</Link>
            <Link to="/multi-purpose" className="text-gray-600 hover:text-purple-600">All Documents</Link>
            <Link to="/about" className="text-gray-600 hover:text-purple-600">About</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate-report" element={<WorkCompletionForm />} />
          <Route path="/multi-purpose" element={<MultiPurposeForm/>} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

