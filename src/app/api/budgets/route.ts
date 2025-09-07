import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';
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
    const { totalAmount, endDate } = await request.json();

    // Input validation
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: 'Budget amount must be a positive number' }, { status: 400 });
    }

    // Calculate spent amount
    const expenses = await Expense.find({ userId: decoded.userId });
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const budget = await Budget.create({
      userId: decoded.userId,
      totalAmount,
      remainingAmount: totalAmount - totalSpent,
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    });

    return NextResponse.json({ message: 'Budget created successfully', budget });
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
    const budget = await Budget.findOne({ userId: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ budget });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}