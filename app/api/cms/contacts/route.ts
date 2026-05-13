import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Get all contact submissions
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Contact submissions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// Create new contact submission (from public form)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, company, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO contact_submissions (
        name,
        email,
        phone,
        company,
        subject,
        message
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [name, email, phone || null, company || null, subject || null, message]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}

// Update submission (mark as read)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, is_read } = data;

    const result = await query(
      `UPDATE contact_submissions SET
        is_read = $1
      WHERE id = $2
      RETURNING *`,
      [is_read, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// Delete submission
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    await query(
      'DELETE FROM contact_submissions WHERE id = $1',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
