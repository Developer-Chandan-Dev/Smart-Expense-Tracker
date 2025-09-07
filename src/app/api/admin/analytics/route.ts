import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Expense from '@/models/Expense';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await dbConnect();

    const totalUsers = await User.countDocuments();
    const totalExpenses = await Expense.countDocuments();
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activeUsers7Days = await User.countDocuments({ 
      lastLogin: { $gte: sevenDaysAgo } 
    });
    
    const activeUsers30Days = await User.countDocuments({ 
      lastLogin: { $gte: thirtyDaysAgo } 
    });

    const totalExpenseAmount = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return NextResponse.json({
      totalUsers,
      totalExpenses,
      activeUsers7Days,
      activeUsers30Days,
      totalExpenseAmount: totalExpenseAmount[0]?.total || 0
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}