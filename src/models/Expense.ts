import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0 },
  reason: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Food & Drinks", "Shopping", "Transport", "Bills & Utilities",
      "Rent", "Healthcare", "Entertainment", "Travel", "Education",
      "Investments", "Savings", "Other"
    ],
    default: "Other"
  },
  trackingMode: {
    type: String,
    enum: ["free", "budget"],
    default: "free"
  },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema);