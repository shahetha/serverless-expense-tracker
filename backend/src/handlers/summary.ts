import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { getExpenses } from "../lib/dynamo";
import { ok, err, userSub } from "../lib/response";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const sub   = userSub(event);
    const month = event.queryStringParameters?.month;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) return err("month param required (YYYY-MM)");

    const expenses = await getExpenses(sub, month) as any[];
    const totalSpend = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);
    const [year, mon] = month.split("-").map(Number);
    const days = new Date(year, mon, 0).getDate();

    const catMap = new Map<string, { total: number; count: number }>();
    expenses.forEach((e: any) => {
      const c = catMap.get(e.category) || { total: 0, count: 0 };
      catMap.set(e.category, { total: c.total + Number(e.amount), count: c.count + 1 });
    });

    const categoryBreakdown = Array.from(catMap.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([category, { total, count }]) => ({
        category, total, count,
        percentage: totalSpend > 0 ? Math.round((total / totalSpend) * 100) : 0,
      }));

    const weeklyTotals = [1,2,3,4].map(w => ({
      week: `W${w}`,
      total: expenses
        .filter((e: any) => { const d = new Date(e.date).getDate(); return d >= (w-1)*7+1 && d <= w*7; })
        .reduce((s: number, e: any) => s + Number(e.amount), 0),
    }));

    return ok({
      month, totalSpend, expenseCount: expenses.length,
      dailyAverage: days > 0 ? totalSpend / days : 0,
      topCategory: categoryBreakdown[0]?.category ?? null,
      categoryBreakdown, weeklyTotals,
    });
  } catch (e: any) {
    console.error(e);
    if (e.message === "Unauthorized") return err("Unauthorized", 401);
    return err(e.message || "Internal error", 500);
  }
}
