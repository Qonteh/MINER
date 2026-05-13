import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    return NextResponse.json({
      status: isConnected ? 'connected' : 'disconnected',
      message: isConnected ? 'Database connection successful' : 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 500 }
    );
  }
}
