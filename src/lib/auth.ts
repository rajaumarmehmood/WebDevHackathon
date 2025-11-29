import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// In-memory user store (replace with database in production)
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function createUser(email: string, name: string, password: string): Promise<User | null> {
  if (users.has(email)) {
    return null;
  }
  
  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
    createdAt: new Date(),
  };
  
  users.set(email, user);
  return user;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.get(email);
  if (!user) return null;
  
  const isValid = await verifyPassword(password, user.password);
  return isValid ? user : null;
}

export function getUserByEmail(email: string): Omit<User, 'password'> | null {
  const user = users.get(email);
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
