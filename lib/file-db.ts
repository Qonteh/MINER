import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'admin_users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Admin User Types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

// Read users from file
export function getUsers(): AdminUser[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save users to file
export function saveUsers(users: AdminUser[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Read sessions from file
export function getSessions(): Session[] {
  ensureDataDir();
  if (!fs.existsSync(SESSIONS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save sessions to file
export function saveSessions(sessions: Session[]) {
  ensureDataDir();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

// Initialize default admin users
export async function initializeAdminUsers() {
  const existingUsers = getUsers();
  
  // Hash passwords
  const eugenePassword = await bcrypt.hash('eugene051@', 10);
  const abdulPassword = await bcrypt.hash('Qontetina051@', 10);
  
  const defaultUsers: AdminUser[] = [
    {
      id: 1,
      username: 'eugene',
      email: 'eugene@gmail.com',
      password: eugenePassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      username: 'abdulyusuph',
      email: 'abdulyusuph051@gmail.com',
      password: abdulPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  
  // Only initialize if no users exist
  if (existingUsers.length === 0) {
    saveUsers(defaultUsers);
    return { created: true, users: defaultUsers.map(u => ({ id: u.id, username: u.username, email: u.email })) };
  }
  
  return { created: false, users: existingUsers.map(u => ({ id: u.id, username: u.username, email: u.email })) };
}

// Find user by username or email
export function findUser(usernameOrEmail: string): AdminUser | undefined {
  const users = getUsers();
  return users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
}

// Find user by ID
export function findUserById(id: number): AdminUser | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

// Update user
export function updateUser(id: number, updates: Partial<AdminUser>) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
  saveUsers(users);
  return users[index];
}

// Check if username or email exists (excluding a specific user)
export function userExists(username: string, email: string, excludeId?: number): boolean {
  const users = getUsers();
  return users.some(u => (u.username === username || u.email === email) && u.id !== excludeId);
}

// Create session
export function createSession(userId: number, token: string, expiresAt: Date): Session {
  const sessions = getSessions();
  const newSession: Session = {
    id: sessions.length + 1,
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  };
  sessions.push(newSession);
  saveSessions(sessions);
  return newSession;
}

// Find valid session by token
export function findValidSession(token: string): (Session & { user: AdminUser }) | null {
  const sessions = getSessions();
  const session = sessions.find(s => s.token === token && new Date(s.expires_at) > new Date());
  
  if (!session) return null;
  
  const user = findUserById(session.user_id);
  if (!user) return null;
  
  return { ...session, user };
}

// Delete sessions for user (except current)
export function deleteOtherSessions(userId: number, currentToken: string) {
  const sessions = getSessions();
  const filtered = sessions.filter(s => !(s.user_id === userId && s.token !== currentToken));
  saveSessions(filtered);
}

// Delete session by token (logout)
export function deleteSession(token: string) {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.token !== token);
  saveSessions(filtered);
}

// Clean expired sessions
export function cleanExpiredSessions() {
  const sessions = getSessions();
  const now = new Date();
  const valid = sessions.filter(s => new Date(s.expires_at) > now);
  saveSessions(valid);
}
