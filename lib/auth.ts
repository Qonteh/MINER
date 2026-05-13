import { cookies } from 'next/headers';
import { query } from './db';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return null;
    }

    const result = await query(
      `SELECT s.id, s.user_id, s.expires_at, u.id as uid, u.username, u.email 
       FROM sessions s 
       JOIN admin_users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      user: {
        id: result.rows[0].uid,
        username: result.rows[0].username,
        email: result.rows[0].email,
      },
      sessionId: result.rows[0].id,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
