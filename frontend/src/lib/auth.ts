import { signIn, signUp, signOut, fetchAuthSession } from "aws-amplify/auth";
import outputs from "../amplify_outputs.json";

const POOL_ID   = import.meta.env.VITE_COGNITO_USER_POOL_ID  as string | undefined;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID     as string | undefined;

const HAS_AMPLIFY_AUTH = Boolean(
  outputs?.auth?.user_pool_id &&
  outputs?.auth?.user_pool_client_id
);

const FORCE_DEV_AUTH = import.meta.env.VITE_USE_DEV_AUTH === "true";
const DEV_USER_KEY  = "devUserSub";
const DEV_TOKEN_KEY = "devToken";

export function usingDevAuth(): boolean {
  return FORCE_DEV_AUTH || ((!POOL_ID || !CLIENT_ID) && !HAS_AMPLIFY_AUTH);
}

 export function configureAuth(): void {
  if (usingDevAuth()) {
    console.info("[auth] DEV mode");
    return;
  }
}

export function getDevUserSub(): string | null { return localStorage.getItem(DEV_USER_KEY); }
export function setDevUserSub(sub: string): void {
  localStorage.setItem(DEV_USER_KEY, sub);
  localStorage.setItem(DEV_TOKEN_KEY, "dev-token");
}
export function clearDevUserSub(): void {
  localStorage.removeItem(DEV_USER_KEY);
  localStorage.removeItem(DEV_TOKEN_KEY);
}

export async function login(username: string, password: string): Promise<void> {
  if (!username.trim()) throw new Error("Username is required.");
  if (!password.trim()) throw new Error("Password is required.");
  if (usingDevAuth()) { await delay(400); setDevUserSub(username.trim()); return; }
  const res = await signIn({ username: username.trim(), password }).catch(e => { throw new Error(e?.message || "Login failed."); });
  if (!res.isSignedIn) throw new Error(`Next step required: ${res.nextStep?.signInStep}`);
}

export async function register(username: string, password: string): Promise<void> {
  if (!username.trim()) throw new Error("Username is required.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (usingDevAuth()) { await delay(400); setDevUserSub(username.trim()); return; }
  await signUp({ username: username.trim(), password, options: { userAttributes: { email: username.includes("@") ? username.trim() : undefined } } })
    .catch(e => { throw new Error(e?.message || "Registration failed."); });
}

export async function logout(): Promise<void> {
  if (usingDevAuth()) { clearDevUserSub(); return; }
  await signOut().catch(() => {});
}

export async function getAccessToken(): Promise<string | null> {
  if (usingDevAuth()) return localStorage.getItem(DEV_TOKEN_KEY);
  try { const s = await fetchAuthSession(); return s.tokens?.accessToken?.toString() ?? null; }
  catch { return null; }
}

export async function isAuthed(): Promise<boolean> { return Boolean(await getAccessToken()); }

function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }
