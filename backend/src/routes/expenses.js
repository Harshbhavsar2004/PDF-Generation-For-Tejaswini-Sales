const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET /api/expenses - list transactions and computed balance
router.get('/', async (req, res, next) => {
  try {
    const transactions = await Expense.find({}).sort({ timestamp: -1 });
    // compute balance: credits add, debits subtract
    const balance = transactions.reduce((acc, t) => {
      return t.type === 'credit' ? acc + t.amount : acc - t.amount;
    }, 0);
    res.json({ transactions, balance });
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses - add transaction
router.post('/', async (req, res, next) => {
  try {
    const { type, amount, person, purpose, timestamp } = req.body;
    if (!type || !amount || !person) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tx = new Expense({
      type,
      amount: Number(amount),
      person,
      purpose: purpose || '',
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    const saved = await tx.save();

    // return updated list and balance
    const transactions = await Expense.find({}).sort({ timestamp: -1 });
    const balance = transactions.reduce((acc, t) => (t.type === 'credit' ? acc + t.amount : acc - t.amount), 0);

    res.status(201).json({ transaction: saved, balance, transactions });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/expenses/:id - remove transaction
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    const transactions = await Expense.find({}).sort({ timestamp: -1 });
    const balance = transactions.reduce((acc, t) => (t.type === 'credit' ? acc + t.amount : acc - t.amount), 0);

    res.json({ deleted, balance, transactions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
