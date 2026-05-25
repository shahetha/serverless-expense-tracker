import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { putExpense, getExpenses, getExpense, deleteExpense } from "../lib/dynamo";
import { ok, err, userSub } from "../lib/response";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const sub    = userSub(event);
    const method = event.requestContext.http.method;
    const id     = event.pathParameters?.id;
    const month  = event.queryStringParameters?.month;

    if (method === "GET" && !id) {
      const items = await getExpenses(sub, month);
      return ok(items);
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.amount || !body.date || !body.merchant || !body.category)
        return err("amount, date, merchant, category are required");
      const item = await putExpense(sub, body);
      return ok(item, 201);
    }

    if (method === "PUT" && id) {
      const body = JSON.parse(event.body || "{}");
      const existing = await getExpense(sub, id, body.date || body.existingDate);
      if (!existing) return err("Not found", 404);
      const updated = await putExpense(sub, { ...existing, ...body, id });
      return ok(updated);
    }

    if (method === "DELETE" && id) {
      const date = event.queryStringParameters?.date;
      if (!date) return err("date query param required for delete");
      await deleteExpense(sub, id, date);
      return ok({ deleted: true });
    }

    return err("Method not allowed", 405);
  } catch (e: any) {
    console.error(e);
    if (e.message === "Unauthorized") return err("Unauthorized", 401);
    return err(e.message || "Internal server error", 500);
  }
}
