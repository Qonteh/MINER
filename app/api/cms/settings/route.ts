import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM website_settings ORDER BY id DESC LIMIT 1'
    );
    
    const settings = result.rows[0] || {};
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      site_title,
      site_description,
      primary_color,
      secondary_color,
      accent_color,
      logo_url,
      favicon_url,
      font_family,
      company_email,
      company_phone,
      company_address,
    } = data;
    
    // Get existing settings
    const existing = await query('SELECT id FROM website_settings LIMIT 1');
    
    if (existing.rows.length > 0) {
      // Update existing
      const result = await query(
        `UPDATE website_settings SET
          site_title = $1,
          site_description = $2,
          primary_color = $3,
          secondary_color = $4,
          accent_color = $5,
          logo_url = $6,
          favicon_url = $7,
          font_family = $8,
          company_email = $9,
          company_phone = $10,
          company_address = $11,
          updated_at = NOW()
        WHERE id = $12
        RETURNING *`,
        [
          site_title,
          site_description,
          primary_color,
          secondary_color,
          accent_color,
          logo_url,
          favicon_url,
          font_family,
          company_email,
          company_phone,
          company_address,
          existing.rows[0].id,
        ]
      );
      return NextResponse.json(result.rows[0]);
    } else {
      // Create new
      const result = await query(
        `INSERT INTO website_settings (
          site_title,
          site_description,
          primary_color,
          secondary_color,
          accent_color,
          logo_url,
          favicon_url,
          font_family,
          company_email,
          company_phone,
          company_address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          site_title,
          site_description,
          primary_color,
          secondary_color,
          accent_color,
          logo_url,
          favicon_url,
          font_family,
          company_email,
          company_phone,
          company_address,
        ]
      );
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
