import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM page_sections ORDER BY order_index ASC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Sections fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      section_name,
      section_key,
      title,
      subtitle,
      description,
      image_url,
      button_text,
      button_url,
      content,
      is_visible,
      order_index,
    } = data;

    const result = await query(
      `INSERT INTO page_sections (
        section_name,
        section_key,
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_url,
        content,
        is_visible,
        order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        section_name,
        section_key,
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_url,
        JSON.stringify(content || {}),
        is_visible !== false,
        order_index || 0,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Section creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      id,
      section_name,
      title,
      subtitle,
      description,
      image_url,
      button_text,
      button_url,
      content,
      is_visible,
      order_index,
    } = data;

    const result = await query(
      `UPDATE page_sections SET
        section_name = $1,
        title = $2,
        subtitle = $3,
        description = $4,
        image_url = $5,
        button_text = $6,
        button_url = $7,
        content = $8,
        is_visible = $9,
        order_index = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *`,
      [
        section_name,
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_url,
        JSON.stringify(content || {}),
        is_visible !== false,
        order_index,
        id,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Section update error:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}
