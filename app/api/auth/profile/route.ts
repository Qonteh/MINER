import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionResult = await query(
      `SELECT u.id, u.username, u.email, u.created_at
       FROM sessions s 
       JOIN admin_users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const user = sessionResult.rows[0];
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update user profile (username, email)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionResult = await query(
      `SELECT u.id FROM sessions s 
       JOIN admin_users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const userId = sessionResult.rows[0].id;
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
    }

    // Check if username or email already exists for another user
    const existingUser = await query(
      'SELECT id FROM admin_users WHERE (username = $1 OR email = $2) AND id != $3',
      [username, email, userId]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Username or email already in use' }, { status: 409 });
    }

    await query(
      'UPDATE admin_users SET username = $1, email = $2, updated_at = NOW() WHERE id = $3',
      [username, email, userId]
    );

    return NextResponse.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Change password
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionResult = await query(
      `SELECT u.id, u.password FROM sessions s 
       JOIN admin_users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const userId = sessionResult.rows[0].id;
    const currentHashedPassword = sessionResult.rows[0].password;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, currentHashedPassword);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      'UPDATE admin_users SET password = $1, updated_at = NOW() WHERE id = $2',
      [newHashedPassword, userId]
    );

    // Invalidate all other sessions for this user (security measure)
    await query(
      'DELETE FROM sessions WHERE user_id = $1 AND token != $2',
      [userId, token]
    );

    return NextResponse.json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
