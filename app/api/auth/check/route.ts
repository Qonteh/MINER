import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No session token' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT s.id, u.id as uid, u.username, u.email, s.expires_at
       FROM sessions s 
       JOIN admin_users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.uid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
