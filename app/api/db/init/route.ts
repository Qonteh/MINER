import { NextResponse } from 'next/server';
import { initializeAdminUsers, getUsers } from '@/lib/file-db';

export async function POST() {
  try {
    // Initialize admin users with file-based storage
    const result = await initializeAdminUsers();

    return NextResponse.json(
      { 
        status: 'success', 
        message: result.created 
          ? 'Admin users created successfully' 
          : 'Admin users already exist',
        users: result.users
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Initialize if needed and return status
    await initializeAdminUsers();
    const users = getUsers();
    
    return NextResponse.json({
      status: 'success',
      initialized: users.length > 0,
      userCount: users.length,
      users: users.map(u => ({ id: u.id, username: u.username, email: u.email }))
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 500 }
    );
  }
}
