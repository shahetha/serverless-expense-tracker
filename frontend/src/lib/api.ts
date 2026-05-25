import { getAccessToken, usingDevAuth } from "./auth";
import type { Expense, ExpenseInput, MonthlySummary, PresignResponse } from "../types";
import { CATEGORIES, CATEGORY_COLORS } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL || "";

// ── Mock data for DEV mode ───────────────────────────────────────────────────
let MOCK: Expense[] = [
  { id:"1", amount:84.50,  date:"2024-01-15", merchant:"Whole Foods",    category:"Food & Dining",  paymentMethod:"Credit Card",  notes:"Weekly groceries", createdAt:"", updatedAt:"" },
  { id:"2", amount:1200,   date:"2024-01-10", merchant:"United Airlines", category:"Travel",         paymentMethod:"Credit Card",  notes:"NYC trip",         createdAt:"", updatedAt:"" },
  { id:"3", amount:45.99,  date:"2024-01-18", merchant:"Netflix",         category:"Entertainment",  paymentMethod:"Debit Card",   notes:"Monthly sub",      createdAt:"", updatedAt:"" },
  { id:"4", amount:320,    date:"2024-01-05", merchant:"Amazon",          category:"Shopping",       paymentMethod:"Credit Card",  notes:"Electronics",      createdAt:"", updatedAt:"" },
  { id:"5", amount:65,     date:"2024-01-20", merchant:"CVS Pharmacy",    category:"Health",         paymentMethod:"Cash",         notes:"",                 createdAt:"", updatedAt:"" },
  { id:"6", amount:150,    date:"2024-01-12", merchant:"WeWork",          category:"Utilities",      paymentMethod:"Bank Transfer",notes:"Office space",     createdAt:"", updatedAt:"" },
  { id:"7", amount:220,    date:"2024-01-08", merchant:"Uber",            category:"Transport",      paymentMethod:"Credit Card",  notes:"Airport rides",    createdAt:"", updatedAt:"" },
  { id:"8", amount:35.80,  date:"2024-01-22", merchant:"Starbucks",       category:"Food & Dining",  paymentMethod:"Debit Card",   notes:"Team coffees",     createdAt:"", updatedAt:"" },
  { id:"9", amount:499,    date:"2024-01-03", merchant:"Coursera",        category:"Education",      paymentMethod:"Credit Card",  notes:"Annual plan",      createdAt:"", updatedAt:"" },
  { id:"10",amount:95,     date:"2024-01-25", merchant:"Gym",             category:"Health",         paymentMethod:"Credit Card",  notes:"Monthly membership",createdAt:"",updatedAt:"" },
];

async function headers(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method, headers: await headers(), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || res.statusText); }
  return res.json();
}

// ── Expenses ─────────────────────────────────────────────────────────────────
export async function getExpenses(month?: string): Promise<Expense[]> {
  if (usingDevAuth()) {
    if (!month) return [...MOCK];
    return MOCK.filter(e => e.date.startsWith(month));
  }
  return request<Expense[]>("GET", `/api/expenses${month ? `?month=${month}` : ""}`);
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  if (usingDevAuth()) {
    const e: Expense = { ...input, id: String(Date.now()), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    MOCK.unshift(e); return e;
  }
  return request<Expense>("POST", "/api/expenses", input);
}

export async function updateExpense(id: string, input: Partial<ExpenseInput>): Promise<Expense> {
  if (usingDevAuth()) {
    const idx = MOCK.findIndex(e => e.id === id);
    if (idx === -1) throw new Error("Not found");
    MOCK[idx] = { ...MOCK[idx], ...input, updatedAt: new Date().toISOString() };
    return MOCK[idx];
  }
  return request<Expense>("PUT", `/api/expenses/${id}`, input);
}

export async function deleteExpense(id: string): Promise<void> {
  if (usingDevAuth()) { MOCK = MOCK.filter(e => e.id !== id); return; }
  await request<void>("DELETE", `/api/expenses/${id}`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
export async function getMonthlySummary(month: string): Promise<MonthlySummary> {
  if (usingDevAuth()) {
    const expenses = MOCK.filter(e => e.date.startsWith(month));
    const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
    const days = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0).getDate();
    const catMap = new Map<string, number>();
    expenses.forEach(e => catMap.set(e.category, (catMap.get(e.category) || 0) + e.amount));
    const categoryBreakdown = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category, total]) => ({
        category: category as any, total,
        count: expenses.filter(e => e.category === category).length,
        percentage: totalSpend > 0 ? Math.round((total / totalSpend) * 100) : 0,
      }));
    const topCategory = categoryBreakdown[0]?.category ?? null;
    const weeklyTotals = [1,2,3,4].map(w => ({
      week: `W${w}`,
      total: expenses.filter(e => {
        const d = new Date(e.date).getDate();
        return d >= (w-1)*7+1 && d <= w*7;
      }).reduce((s,e) => s+e.amount, 0),
    }));
    return { month, totalSpend, expenseCount: expenses.length, dailyAverage: totalSpend/days, topCategory, categoryBreakdown, weeklyTotals };
  }
  return request<MonthlySummary>("GET", `/api/summary/monthly?month=${month}`);
}

// ── Receipts ──────────────────────────────────────────────────────────────────
export async function getPresignedUrl(filename: string, contentType: string): Promise<PresignResponse> {
  if (usingDevAuth()) return { uploadUrl: "", key: `mock/${filename}` };
  return request<PresignResponse>("POST", "/api/receipts/presign", { filename, contentType });
}

export async function uploadReceipt(file: File): Promise<string> {
  const { uploadUrl, key } = await getPresignedUrl(file.name, file.type);
  if (usingDevAuth()) return key;
  await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  return key;
}
