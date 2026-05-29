import { generateClient } from "aws-amplify/data";
import type { Expense, ExpenseInput, MonthlySummary } from "../types";
import { usingDevAuth } from "./auth";

// ── Amplify GraphQL client (typed via amplify_outputs.json) ───────────────────
const client = generateClient();

// ── Mock data (DEV mode only) ─────────────────────────────────────────────────
let MOCK: Expense[] = [
  { id:"1",  amount:84.50,  date:"2024-01-15", merchant:"Whole Foods",     category:"Food & Dining",  paymentMethod:"Credit Card",   notes:"Weekly groceries",   createdAt:"", updatedAt:"" },
  { id:"2",  amount:1200,   date:"2024-01-10", merchant:"United Airlines", category:"Travel",          paymentMethod:"Credit Card",   notes:"NYC trip",           createdAt:"", updatedAt:"" },
  { id:"3",  amount:45.99,  date:"2024-01-18", merchant:"Netflix",         category:"Entertainment",   paymentMethod:"Debit Card",    notes:"Monthly sub",        createdAt:"", updatedAt:"" },
  { id:"4",  amount:320,    date:"2024-01-05", merchant:"Amazon",          category:"Shopping",        paymentMethod:"Credit Card",   notes:"Electronics",        createdAt:"", updatedAt:"" },
  { id:"5",  amount:65,     date:"2024-01-20", merchant:"CVS Pharmacy",    category:"Health",          paymentMethod:"Cash",          notes:"",                   createdAt:"", updatedAt:"" },
  { id:"6",  amount:150,    date:"2024-01-12", merchant:"WeWork",          category:"Utilities",       paymentMethod:"Bank Transfer", notes:"Office space",       createdAt:"", updatedAt:"" },
  { id:"7",  amount:220,    date:"2024-01-08", merchant:"Uber",            category:"Transport",       paymentMethod:"Credit Card",   notes:"Airport rides",      createdAt:"", updatedAt:"" },
  { id:"8",  amount:35.80,  date:"2024-01-22", merchant:"Starbucks",       category:"Food & Dining",   paymentMethod:"Debit Card",    notes:"Team coffees",       createdAt:"", updatedAt:"" },
  { id:"9",  amount:499,    date:"2024-01-03", merchant:"Coursera",        category:"Education",       paymentMethod:"Credit Card",   notes:"Annual plan",        createdAt:"", updatedAt:"" },
  { id:"10", amount:95,     date:"2024-01-25", merchant:"Gym",             category:"Health",          paymentMethod:"Credit Card",   notes:"Monthly membership", createdAt:"", updatedAt:"" },
];

// ── Enum helpers ──────────────────────────────────────────────────────────────
function toEnum(val: string): string {
  return val.replace(/ & /g, "_and_").replace(/ /g, "_");
}
function fromEnum(val: string | null | undefined): string {
  if (!val) return "Other";
  return val.replace(/_and_/g, " & ").replace(/_/g, " ");
}

function mapItem(item: Record<string, any>): Expense {
  return {
    id:            item.id ?? String(Date.now()),
    amount:        Number(item.amount) || 0,
    date:          item.date ?? "",
    merchant:      item.merchant ?? "",
    category:      fromEnum(item.category) as Expense["category"],
    paymentMethod: fromEnum(item.paymentMethod) as Expense["paymentMethod"],
    notes:         item.notes ?? "",
    receiptKey:    item.receiptKey ?? "",
    createdAt:     item.createdAt ?? "",
    updatedAt:     item.updatedAt ?? "",
  };
}

// ── Expenses ──────────────────────────────────────────────────────────────────
export async function getExpenses(month?: string): Promise<Expense[]> {
  if (usingDevAuth()) {
    return month ? MOCK.filter(e => e.date.startsWith(month)) : [...MOCK];
  }
  const { data: items, errors } = await (client as any).models.Expense.list();
  if (errors?.length) throw new Error(errors[0].message);
  const all = (items || []).map(mapItem);
  return month ? all.filter((e: Expense) => e.date.startsWith(month)) : all;
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  if (usingDevAuth()) {
    const e: Expense = {
      ...input,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK.unshift(e);
    return e;
  }
  const { data: item, errors } = await (client as any).models.Expense.create({
    amount:        input.amount,
    date:          input.date,
    merchant:      input.merchant,
    category:      toEnum(input.category),
    paymentMethod: toEnum(input.paymentMethod),
    notes:         input.notes ?? "",
    receiptKey:    input.receiptKey ?? "",
  });
  if (errors?.length) throw new Error(errors[0].message);
  return mapItem(item);
}

export async function updateExpense(id: string, input: Partial<ExpenseInput>): Promise<Expense> {
  if (usingDevAuth()) {
    const idx = MOCK.findIndex(e => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    MOCK[idx] = { ...MOCK[idx], ...input, updatedAt: new Date().toISOString() };
    return MOCK[idx];
  }
  const payload: Record<string, unknown> = { id };
  if (input.amount        !== undefined) payload.amount        = input.amount;
  if (input.date          !== undefined) payload.date          = input.date;
  if (input.merchant      !== undefined) payload.merchant      = input.merchant;
  if (input.category      !== undefined) payload.category      = toEnum(input.category);
  if (input.paymentMethod !== undefined) payload.paymentMethod = toEnum(input.paymentMethod);
  if (input.notes         !== undefined) payload.notes         = input.notes;
  if (input.receiptKey    !== undefined) payload.receiptKey    = input.receiptKey;

  const { data: item, errors } = await (client as any).models.Expense.update(payload);
  if (errors?.length) throw new Error(errors[0].message);
  return mapItem(item);
}

export async function deleteExpense(id: string): Promise<void> {
  if (usingDevAuth()) { MOCK = MOCK.filter(e => e.id !== id); return; }
  const { errors } = await (client as any).models.Expense.delete({ id });
  if (errors?.length) throw new Error(errors[0].message);
}

// ── Summary ───────────────────────────────────────────────────────────────────
export async function getMonthlySummary(month: string): Promise<MonthlySummary> {
  const expenses = await getExpenses(month);
  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
  const [year, mon] = month.split("-").map(Number);
  const days = new Date(year, mon, 0).getDate();

  const catMap = new Map<string, { total: number; count: number }>();
  expenses.forEach(e => {
    const c = catMap.get(e.category) || { total: 0, count: 0 };
    catMap.set(e.category, { total: c.total + e.amount, count: c.count + 1 });
  });

  const categoryBreakdown = Array.from(catMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .map(([category, { total, count }]) => ({
      category: category as Expense["category"],
      total, count,
      percentage: totalSpend > 0 ? Math.round((total / totalSpend) * 100) : 0,
    }));

  const weeklyTotals = [1,2,3,4].map(w => ({
    week: `W${w}`,
    total: expenses
      .filter(e => {
        const d = new Date(e.date).getDate();
        return d >= (w-1)*7+1 && d <= w*7;
      })
      .reduce((s, e) => s + e.amount, 0),
  }));

  return {
    month, totalSpend,
    expenseCount: expenses.length,
    dailyAverage: days > 0 ? totalSpend / days : 0,
    topCategory:  categoryBreakdown[0]?.category ?? null,
    categoryBreakdown,
    weeklyTotals,
  };
}

// ── Receipts ──────────────────────────────────────────────────────────────────
export async function uploadReceipt(file: File): Promise<string> {
  return `receipts/${Date.now()}-${file.name}`;
}
