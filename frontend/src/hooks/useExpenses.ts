import { useState, useEffect, useCallback } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense, getMonthlySummary } from "../lib/api";
import type { Expense, ExpenseInput, MonthlySummary } from "../types";

export function useExpenses(month?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setExpenses(await getExpenses(month)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const add = async (input: ExpenseInput) => {
    const e = await createExpense(input);
    setExpenses(prev => [e, ...prev]);
    return e;
  };

  const update = async (id: string, input: Partial<ExpenseInput>) => {
    const e = await updateExpense(id, input);
    setExpenses(prev => prev.map(x => x.id === id ? e : x));
    return e;
  };

  const remove = async (id: string) => {
    await deleteExpense(id);
    setExpenses(prev => prev.filter(x => x.id !== id));
  };

  return { expenses, loading, error, refresh: load, add, update, remove };
}

export function useSummary(month: string) {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMonthlySummary(month)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [month]);

  return { summary, loading };
}
