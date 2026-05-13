import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { 
  findValidSession, 
  findUserById, 
  updateUser, 
  userExists, 
  deleteOtherSessions,
  initializeAdminUsers
} from '@/lib/file-db';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize admin users if not exists
    await initializeAdminUsers();

    const session = findValidSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    return NextResponse.json({
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
      createdAt: session.user.created_at,
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

    const session = findValidSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const userId = session.user.id;
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
    }

    // Check if username or email already exists for another user
    if (userExists(username, email, userId)) {
      return NextResponse.json({ error: 'Username or email already in use' }, { status: 409 });
    }

    updateUser(userId, { username, email });

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

    const session = findValidSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const userId = session.user.id;
    const currentHashedPassword = session.user.password;
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

    updateUser(userId, { password: newHashedPassword });

    // Invalidate all other sessions for this user (security measure)
    deleteOtherSessions(userId, token);

    return NextResponse.json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
