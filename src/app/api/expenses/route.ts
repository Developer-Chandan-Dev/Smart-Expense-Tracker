import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';
import Budget from '@/models/Budget';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const { amount, reason, category, date, trackingMode, budgetId } = await request.json();

    // Input validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }
    if (!reason || reason.trim() === '') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const expense = await Expense.create({
      userId: decoded.userId,
      amount,
      reason,
      category,
      date: date || new Date(),
      trackingMode: trackingMode || 'free',
      budgetId: trackingMode === 'budget' ? budgetId : undefined
    });

    // Update budget only if tracking mode is 'budget'
    if (trackingMode === 'budget' && budgetId) {
      const budget = await Budget.findById(budgetId);
      if (budget && budget.userId.toString() === decoded.userId) {
        budget.remainingAmount -= amount;
        await budget.save();
        
        // Send real-time budget update via Socket.IO
        if (global.io) {
          global.io.to(`user:${decoded.userId}`).emit('budget_updated', {
            budget: {
              _id: budget._id,
              totalAmount: budget.totalAmount,
              remainingAmount: budget.remainingAmount
            }
          });
        }
      }
    }

    // Send real-time expense notification via Socket.IO
    if (global.io) {
      global.io.to(`user:${decoded.userId}`).emit('expense_added', {
        expense: {
          _id: expense._id,
          amount: expense.amount,
          reason: expense.reason,
          category: expense.category,
          trackingMode: expense.trackingMode,
          date: expense.date
        }
      });
    } else {
      console.log('Socket.IO not available');
    }

    return NextResponse.json({ message: 'Expense added successfully', expense });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const trackingMode = searchParams.get('trackingMode');

    const query: Record<string, unknown> = { userId: decoded.userId };
    
    if (category) query.category = category;
    if (trackingMode) query.trackingMode = trackingMode;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    return NextResponse.json({ expenses });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}