import { UserRole } from '@/types';

const ACCOUNTS_STORAGE_KEY = 'accounts-storage';

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  company?: string;
  gstNumber?: string;
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  company?: string;
  gstNumber?: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  return digits || undefined;
}

function readAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function registerAccount(payload: RegisterPayload): Omit<StoredAccount, 'password'> {
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const accounts = readAccounts();

  const emailExists = accounts.some((account) => account.email === email);
  if (emailExists) {
    throw new Error('An account with this email already exists');
  }

  const account: StoredAccount = {
    id: `acct-${Date.now()}`,
    name: payload.name.trim(),
    email,
    password: payload.password,
    role: payload.role,
    phone,
    company: payload.company?.trim() || undefined,
    gstNumber: payload.gstNumber?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  saveAccounts([...accounts, account]);

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    phone: account.phone,
    company: account.company,
    gstNumber: account.gstNumber,
    createdAt: account.createdAt,
  };
}

export function authenticateAccount(email: string, password: string): Omit<StoredAccount, 'password'> {
  const normalizedEmail = normalizeEmail(email);
  const accounts = readAccounts();

  const account = accounts.find(
    (candidate) => candidate.email === normalizedEmail && candidate.password === password
  );

  if (!account) {
    throw new Error('Invalid email or password');
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    phone: account.phone,
    company: account.company,
    gstNumber: account.gstNumber,
    createdAt: account.createdAt,
  };
}