import React, { useState, useEffect } from "react";
import { login, register, usingDevAuth, setDevUserSub } from "../lib/auth";

const IS_DEV = usingDevAuth();

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

.auth-root {
  min-height: 100vh;
  display: flex;
  font-family: 'Manrope', system-ui, sans-serif;
  background: linear-gradient(145deg, #dff6f2 0%, #e8faf7 20%, #eefcff 50%, #f4f8fd 100%);
  position: relative;
  overflow: hidden;
}

.auth-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 64px;
  position: relative;
  z-index: 1;
}

.auth-right {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 48px;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-left: 1px solid rgba(255,255,255,0.85);
  position: relative;
  z-index: 1;
}

@media (max-width: 860px) {
  .auth-root { flex-direction: column; }
  .auth-left { display: none; }
  .auth-right { width: 100%; min-height: 100vh; border-left: none; padding: 32px 24px; }
}

.auth-orb {
  position: fixed; border-radius: 50%; pointer-events: none; filter: blur(70px);
  animation: orbFloat var(--dur,9s) ease-in-out infinite alternate;
}
.auth-grid {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(26,185,160,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,185,160,0.05) 1px, transparent 1px);
  background-size: 52px 52px; pointer-events: none;
}

@keyframes orbFloat {
  from { transform:translate(0,0) scale(1); }
  to   { transform:translate(var(--tx,20px),var(--ty,-30px)) scale(1.12); }
}
@keyframes cardIn {
  from { opacity:0; transform:translateX(20px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes spin  { to { transform:rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes glowPulse {
  0%,100% { box-shadow:0 3px 14px rgba(26,185,160,0.32); }
  50%     { box-shadow:0 6px 28px rgba(26,185,160,0.55); }
}
@keyframes countUp {
  from { opacity:0; transform:translateY(4px); }
  to   { opacity:1; transform:translateY(0); }
}

.brand-icon {
  width:52px; height:52px; border-radius:15px;
  background:linear-gradient(135deg,#1ab9a0,#2196c9);
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0; animation:glowPulse 3s ease-in-out infinite;
}

.stat-card {
  background:rgba(255,255,255,0.72);
  backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,0.9);
  border-radius:16px;
  padding:18px 22px;
  box-shadow:0 4px 20px rgba(13,47,58,0.07);
  animation:fadeUp 0.5s ease both;
}

.feature-pill {
  display:inline-flex; align-items:center; gap:7px;
  background:rgba(26,185,160,0.09);
  border:1px solid rgba(26,185,160,0.2);
  border-radius:100px; padding:6px 14px;
  font-size:12.5px; font-weight:600; color:#0d8c76;
  margin-bottom:8px; margin-right:6px;
}

.divider {
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(26,185,160,0.18),transparent);
  margin:20px 0;
}

.env-badge {
  display:inline-flex; align-items:center; gap:6px;
  background:rgba(26,185,160,0.09); border:1px solid rgba(26,185,160,0.22);
  border-radius:100px; padding:5px 14px;
  font-size:11px; font-weight:700; letter-spacing:0.4px; color:#0d8c76;
  transition:all 0.2s; cursor:default;
}
.env-dot {
  width:6px; height:6px; border-radius:50%; background:#1ab9a0;
  box-shadow:0 0 6px rgba(26,185,160,0.7);
  animation:pulse 2s ease-in-out infinite;
}

.field-label {
  display:block; font-size:11.5px; font-weight:700; letter-spacing:0.35px;
  color:#5a7a88; text-transform:uppercase; margin-bottom:7px;
}
.field-input-wrap { position:relative; }
.field-icon {
  position:absolute; left:14px; top:50%; transform:translateY(-50%);
  pointer-events:none; display:flex; align-items:center; color:#9ab8c2;
  transition:color 0.2s;
}
.field-input-wrap:focus-within .field-icon { color:#1ab9a0; }

.auth-input {
  width:100%; height:48px;
  background:rgba(255,255,255,0.85);
  border:1.5px solid rgba(26,185,160,0.2); border-radius:12px;
  padding:0 14px 0 42px; font-size:14.5px; font-weight:500;
  color:#0a2030; font-family:inherit; outline:none; box-sizing:border-box;
  transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.auth-input::placeholder { color:#b0cdd8; }
.auth-input:hover { border-color:rgba(26,185,160,0.4); background:#fff; }
.auth-input:focus {
  border-color:#1ab9a0; background:#fff;
  box-shadow:0 0 0 3.5px rgba(26,185,160,0.14);
}
.auth-input.has-toggle { padding-right:46px; }

.toggle-btn {
  position:absolute; right:12px; top:50%; transform:translateY(-50%);
  background:none; border:none; cursor:pointer; color:#9ab8c2; padding:4px;
  display:flex; align-items:center; transition:color 0.2s; border-radius:6px;
}
.toggle-btn:hover { color:#1ab9a0; }

.mode-tabs { display:flex; gap:6px; margin-bottom:20px; }
.mode-tab {
  flex:1; height:40px; border:1.5px solid rgba(26,185,160,0.2); border-radius:10px;
  background:transparent; color:#6a9aaa; font-size:13.5px; font-weight:600;
  font-family:inherit; cursor:pointer; transition:all 0.18s;
}
.mode-tab:hover { background:rgba(26,185,160,0.06); color:#0d8c76; }
.mode-tab.active {
  background:linear-gradient(90deg,rgba(26,185,160,0.14),rgba(33,150,201,0.1));
  border-color:rgba(26,185,160,0.4); color:#0d8c76;
}

.cta-btn {
  width:100%; height:50px; border:none; border-radius:12px; cursor:pointer;
  background:linear-gradient(90deg,#1ab9a0 0%,#2196c9 100%);
  color:#fff; font-size:15px; font-weight:800; font-family:inherit;
  display:flex; align-items:center; justify-content:center; gap:8px;
  position:relative; overflow:hidden;
  box-shadow:0 4px 20px rgba(26,185,160,0.32);
  transition:transform 0.18s cubic-bezier(0.22,0.68,0,1.2), box-shadow 0.18s, filter 0.18s;
  margin-top:6px;
}
.cta-btn::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent);
  transform:translateX(-100%); transition:transform 0.5s;
}
.cta-btn:hover:not(:disabled) {
  transform:translateY(-2px); filter:brightness(1.06);
  box-shadow:0 8px 32px rgba(26,185,160,0.44);
}
.cta-btn:hover:not(:disabled)::before { transform:translateX(100%); }
.cta-btn:active:not(:disabled) { transform:scale(0.988); }
.cta-btn:disabled { cursor:not-allowed; filter:brightness(0.85); }

.remember-row {
  display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;
}
.remember-label {
  display:flex; align-items:center; gap:8px;
  cursor:pointer; font-size:13px; font-weight:500; color:#6a9aaa;
}
.remember-label input[type=checkbox] { width:15px; height:15px; accent-color:#1ab9a0; cursor:pointer; }
.forgot-btn {
  background:none; border:none; cursor:pointer;
  font-size:13px; font-weight:600; color:#1ab9a0;
  font-family:inherit; padding:0; transition:color 0.2s;
}
.forgot-btn:hover { color:#0d8c76; }

.error-msg {
  font-size:12.5px; font-weight:600; color:#c0392b;
  background:rgba(192,57,43,0.08); border:1px solid rgba(192,57,43,0.18);
  border-radius:8px; padding:9px 12px; margin-top:10px;
  display:flex; align-items:center; gap:7px;
}
.spinner {
  width:18px; height:18px; border:2.5px solid rgba(255,255,255,0.35);
  border-top-color:#fff; border-radius:50%;
  animation:spin 0.7s linear infinite; flex-shrink:0;
}
`;

function EyeIcon({ open }: { open: boolean }) {
  return open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

const UserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LockIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
const CheckIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;

function InputField({ id, label, type="text", value, placeholder, disabled, autoFocus, onChange, onKeyDown, showToggle }: any) {
  const [showPw, setShowPw] = useState(false);
  const inputType = type === "password" ? (showPw ? "text" : "password") : type;
  const Icon = type === "password" ? LockIcon : UserIcon;
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="field-input-wrap">
        <span className="field-icon"><Icon/></span>
        <input id={id} type={inputType} className={`auth-input${showToggle ? " has-toggle" : ""}`}
          value={value} placeholder={placeholder} disabled={disabled} autoFocus={autoFocus}
          onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown}/>
        {showToggle && (
          <button type="button" className="toggle-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            <EyeIcon open={showPw}/>
          </button>
        )}
      </div>
    </div>
  );
}

function DevForm({ onAuthed }: { onAuthed: () => void }) {
  const [devSub, setDevSub] = useState("user123");
  const [loading, setLoading] = useState(false);
  const go = () => {
    if (!devSub.trim() || loading) return;
    setLoading(true);
    setDevUserSub(devSub.trim());
    setTimeout(() => { setLoading(false); onAuthed(); }, 500);
  };
  return (
    <>
      <InputField id="devSub" label="Username" value={devSub}
        placeholder="Enter any username" autoFocus disabled={loading}
        onChange={setDevSub} onKeyDown={(e: any) => e.key === "Enter" && go()}/>
      <button className="cta-btn" disabled={!devSub.trim() || loading} onClick={go}>
        {loading ? <><div className="spinner"/><span>Signing in…</span></> : <><span>Sign In</span><ArrowIcon/></>}
      </button>
    </>
  );
}

function CognitoForm({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const go = async () => {
    if (loading) return;
    setErr(""); setLoading(true);
    try {
      mode === "login" ? await login(username, password) : await register(username, password);
      onAuthed();
    } catch (e: any) { setErr(e.message || "Authentication failed"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="mode-tabs">
        <button className={`mode-tab${mode === "login" ? " active" : ""}`} onClick={() => { setErr(""); setMode("login"); }}>Sign In</button>
        <button className={`mode-tab${mode === "register" ? " active" : ""}`} onClick={() => { setErr(""); setMode("register"); }}>Register</button>
      </div>
      <InputField id="username" label="Email address" type="email" value={username}
        placeholder="you@company.com" autoFocus disabled={loading}
        onChange={setUsername} onKeyDown={(e: any) => e.key === "Enter" && go()}/>
      <InputField id="password" label="Password" type="password" value={password}
        placeholder={mode === "register" ? "Min 8 characters" : "Enter your password"}
        disabled={loading} onChange={setPassword}
        onKeyDown={(e: any) => e.key === "Enter" && go()} showToggle/>
      <div className="remember-row">
        <label className="remember-label">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
          Remember me
        </label>
        {mode === "login" && <button className="forgot-btn">Forgot password?</button>}
      </div>
      {err && <div className="error-msg">{err}</div>}
      <button className="cta-btn" disabled={!username.trim() || !password.trim() || loading} onClick={go} style={{ marginTop: err ? "12px" : "6px" }}>
        {loading ? <><div className="spinner"/><span>{mode === "login" ? "Signing in…" : "Creating account…"}</span></> : <><span>{mode === "login" ? "Sign In" : "Create Account"}</span><ArrowIcon/></>}
      </button>
    </>
  );
}

export default function AuthPage({ onAuthed }: { onAuthed: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(id); }, []);

  const FEATURES = ["Track expenses by category", "Monthly spending insights", "Receipt uploads", "Budget tracking"];
  const STATS = [
    { value: "$0", label: "tracked so far", color: "#1ab9a0" },
    { value: "10+", label: "categories", color: "#2196c9" },
    { value: "Free", label: "forever plan", color: "#8b5cf6" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-root">
        <div className="auth-grid"/>
        <div className="auth-orb" style={{ width:500,height:500,top:-150,left:-100,background:"rgba(26,185,160,0.13)",["--dur" as any]:"10s",["--tx" as any]:"25px",["--ty" as any]:"-20px" }}/>
        <div className="auth-orb" style={{ width:350,height:350,bottom:-100,left:"30%",background:"rgba(33,150,201,0.09)",["--dur" as any]:"13s",["--tx" as any]:"20px",["--ty" as any]:"15px" }}/>

        {/* Left panel — branding + social proof */}
        <div className="auth-left" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
            <div className="brand-icon">
              <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="12" width="5" height="8" rx="1.5" fill="rgba(255,255,255,0.95)"/>
                <rect x="8.5" y="7" width="5" height="13" rx="1.5" fill="rgba(255,255,255,0.75)"/>
                <rect x="15" y="3" width="5" height="17" rx="1.5" fill="rgba(255,255,255,0.95)"/>
                <path d="M3 9.5L8.5 6L14 8.5L20 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="4" r="1.8" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:"#0a2030", letterSpacing:"-0.5px" }}>Smart Expense Tracker</div>
              <div style={{ fontSize:12, fontWeight:600, color:"#8aabb8", marginTop:1 }}>Your personal Finance OS</div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize:42, fontWeight:900, color:"#0a2030", letterSpacing:"-1.5px", lineHeight:1.1, margin:"0 0 16px", maxWidth:480 }}>
            Take control of your <span style={{ color:"#1ab9a0" }}>spending</span>
          </h1>
          <p style={{ fontSize:16, color:"#5a7a88", lineHeight:1.7, margin:"0 0 36px", maxWidth:420, fontWeight:500 }}>
            A clean, fast expense tracker built for clarity. Add expenses, track budgets, and understand where your money goes.
          </p>

          {/* Feature pills */}
          <div style={{ marginBottom:40 }}>
            {FEATURES.map(f => (
              <span key={f} className="feature-pill">
                <span style={{ color:"#1ab9a0" }}><CheckIcon/></span>
                {f}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:14 }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay:`${i*80}ms`, flex:1 }}>
                <div style={{ fontSize:24, fontWeight:900, color: s.color, letterSpacing:"-0.5px" }}>{s.value}</div>
                <div style={{ fontSize:12, color:"#8aabb8", fontWeight:600, marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-right">
          <div style={{ width:"100%", maxWidth:380, animation: visible ? "cardIn 0.55s cubic-bezier(0.22,0.68,0,1.2) both" : "none" }}>

            {/* Heading */}
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:24, fontWeight:900, color:"#0a2030", letterSpacing:"-0.6px", margin:"0 0 6px" }}>
                {IS_DEV ? "Try the demo" : "Welcome back"}
              </h2>
              <p style={{ fontSize:13.5, color:"#6a9aaa", margin:0, fontWeight:500 }}>
                {IS_DEV ? "Sign in with any username to explore the app" : "Sign in to your workspace"}
              </p>
            </div>

            {/* Badge */}
            {IS_DEV && (
              <div style={{ marginBottom:20 }}>
                <div className="env-badge">
                  <div className="env-dot"/>
                  Demo mode · No account needed
                </div>
              </div>
            )}

            <div className="divider"/>

            {/* Form */}
            {IS_DEV ? <DevForm onAuthed={onAuthed}/> : <CognitoForm onAuthed={onAuthed}/>}

            {/* Bottom note */}
            <p style={{ textAlign:"center", fontSize:12, color:"#a0bfc8", marginTop:20, fontWeight:500 }}>
              {IS_DEV
                ? "This is a portfolio demo — data resets on refresh"
                : "Your data is private and stored securely"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
