import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      // Delete session from database
      await query('DELETE FROM sessions WHERE token = $1', [token]);
    }

    const response = NextResponse.json(
      { status: 'success', message: 'Logout successful' },
      { status: 200 }
    );

    // Clear cookie
    response.cookies.delete('admin_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
