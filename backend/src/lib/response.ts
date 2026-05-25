const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export const ok  = (body: unknown, status=200) => ({ statusCode:status, headers:{...CORS,"Content-Type":"application/json"}, body:JSON.stringify(body) });
export const err = (message: string, status=400) => ({ statusCode:status, headers:{...CORS,"Content-Type":"application/json"}, body:JSON.stringify({error:message}) });

export function userSub(event: any): string {
  const sub = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (!sub) throw new Error("Unauthorized");
  return sub;
}
