export type Category = "Food & Dining"|"Travel"|"Shopping"|"Entertainment"|"Health"|"Utilities"|"Housing"|"Transport"|"Education"|"Other";
export type PaymentMethod = "Credit Card"|"Debit Card"|"Cash"|"Bank Transfer"|"Other";
export interface Expense {
  id:string; amount:number; date:string; merchant:string;
  category:Category; paymentMethod:PaymentMethod;
  notes?:string; receiptKey?:string; receiptUrl?:string;
  createdAt:string; updatedAt:string;
}
export type ExpenseInput = Omit<Expense,"id"|"createdAt"|"updatedAt"|"receiptUrl">;
export interface CategoryBreakdown { category:Category; total:number; count:number; percentage:number; }
export interface MonthlySummary {
  month:string; totalSpend:number; expenseCount:number; dailyAverage:number;
  topCategory:Category|null; categoryBreakdown:CategoryBreakdown[];
  weeklyTotals:{week:string;total:number}[];
}
export interface PresignResponse { uploadUrl:string; key:string; }
export const CATEGORIES:Category[] = ["Food & Dining","Travel","Shopping","Entertainment","Health","Utilities","Housing","Transport","Education","Other"];
export const PAYMENT_METHODS:PaymentMethod[] = ["Credit Card","Debit Card","Cash","Bank Transfer","Other"];
export const CATEGORY_COLORS:Record<Category,string> = {
  "Food & Dining":"#1ab9a0","Travel":"#2196c9","Shopping":"#8b5cf6",
  "Entertainment":"#f59e0b","Health":"#ef4444","Utilities":"#6366f1",
  "Housing":"#ec4899","Transport":"#14b8a6","Education":"#f97316","Other":"#94a3b8",
};