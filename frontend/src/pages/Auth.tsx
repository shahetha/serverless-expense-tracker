import React, { useState, useEffect } from "react";
import { login, register, usingDevAuth, setDevUserSub } from "../lib/auth";

const IS_DEV = usingDevAuth();

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

.auth-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  font-family: 'Manrope', system-ui, sans-serif;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #dff6f2 0%, #e8faf7 20%, #eefcff 50%, #f4f8fd 100%);
}

.auth-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(70px);
  animation: orbFloat var(--dur,9s) ease-in-out infinite alternate;
}

.auth-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(26,185,160,0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,185,160,0.055) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
}

@keyframes orbFloat {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(var(--tx,20px),var(--ty,-30px)) scale(1.12); }
}
@keyframes cardIn {
  from { opacity:0; transform:translateY(20px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes spin  { to { transform:rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes glowPulse {
  0%,100% { box-shadow: 0 3px 14px rgba(26,185,160,0.32), 0 0 0 1px rgba(26,185,160,0.3); }
  50%     { box-shadow: 0 6px 24px rgba(26,185,160,0.52), 0 0 0 1px rgba(26,185,160,0.45); }
}

.auth-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 430px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(28px) saturate(1.5);
  -webkit-backdrop-filter: blur(28px) saturate(1.5);
  border: 1px solid rgba(255,255,255,0.88);
  border-radius: 24px;
  padding: 40px 36px 36px;
  box-shadow:
    0 0 0 1px rgba(26,185,160,0.08) inset,
    0 24px 64px rgba(13,47,58,0.11),
    0 4px 16px rgba(13,47,58,0.06);
  animation: cardIn 0.55s cubic-bezier(0.22,0.68,0,1.2) both;
}

@media (max-width:480px) {
  .auth-card { padding:30px 20px 26px; border-radius:20px; }
}

.brand-icon {
  width:48px; height:48px; border-radius:14px;
  background: linear-gradient(135deg,#1ab9a0,#2196c9);
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
  animation: glowPulse 3s ease-in-out infinite;
}

.divider {
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(26,185,160,0.18),transparent);
  margin:20px 0;
}

.env-badge {
  display:inline-flex; align-items:center; gap:6px;
  background:rgba(26,185,160,0.09);
  border:1px solid rgba(26,185,160,0.22);
  border-radius:100px;
  padding:5px 14px;
  font-size:11px; font-weight:700; letter-spacing:0.4px;
  color:#0d8c76;
  transition:all 0.2s; cursor:default;
}
.env-badge:hover {
  background:rgba(26,185,160,0.15);
  border-color:rgba(26,185,160,0.38);
}
.env-dot {
  width:6px; height:6px; border-radius:50%;
  background:#1ab9a0;
  box-shadow:0 0 6px rgba(26,185,160,0.7);
  animation:pulse 2s ease-in-out infinite;
}

.field-wrap { position:relative; margin-bottom:14px; }
.field-label {
  display:block;
  font-size:11.5px; font-weight:700; letter-spacing:0.35px;
  color:#5a7a88; text-transform:uppercase; margin-bottom:7px;
}
.field-input-wrap { position:relative; }
.field-icon {
  position:absolute; left:14px; top:50%;
  transform:translateY(-50%);
  pointer-events:none; display:flex; align-items:center;
  color:#9ab8c2; transition:color 0.2s;
}

.auth-input {
  width:100%; height:48px;
  background:rgba(255,255,255,0.82);
  border:1.5px solid rgba(26,185,160,0.2);
  border-radius:12px;
  padding:0 14px 0 42px;
  font-size:14.5px; font-weight:500;
  color:#0a2030; font-family:inherit;
  outline:none; box-sizing:border-box;
  transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.auth-input::placeholder { color:#b0cdd8; }
.auth-input:hover {
  border-color:rgba(26,185,160,0.4);
  background:rgba(255,255,255,0.95);
}
.auth-input:focus {
  border-color:#1ab9a0;
  background:#fff;
  box-shadow:0 0 0 3.5px rgba(26,185,160,0.14), 0 2px 12px rgba(26,185,160,0.08);
}
.auth-input:focus + .field-icon { color:#1ab9a0; }
.field-input-wrap:focus-within .field-icon { color:#1ab9a0; }
.auth-input.has-toggle { padding-right:46px; }
.auth-input.error {
  border-color:rgba(239,68,68,0.5);
  box-shadow:0 0 0 3px rgba(239,68,68,0.1);
}

.toggle-btn {
  position:absolute; right:12px; top:50%;
  transform:translateY(-50%);
  background:none; border:none; cursor:pointer;
  color:#9ab8c2; padding:4px;
  display:flex; align-items:center; justify-content:center;
  transition:color 0.2s; border-radius:6px;
}
.toggle-btn:hover { color:#1ab9a0; }

.mode-tabs { display:flex; gap:6px; margin-bottom:20px; }
.mode-tab {
  flex:1; height:40px;
  border:1.5px solid rgba(26,185,160,0.2);
  border-radius:10px; background:transparent;
  color:#6a9aaa; font-size:13.5px; font-weight:600;
  font-family:inherit; cursor:pointer; transition:all 0.18s;
}
.mode-tab:hover { background:rgba(26,185,160,0.06); color:#0d8c76; }
.mode-tab.active {
  background:linear-gradient(90deg,rgba(26,185,160,0.14),rgba(33,150,201,0.1));
  border-color:rgba(26,185,160,0.4);
  color:#0d8c76;
}

.cta-btn {
  width:100%; height:50px;
  border:none; border-radius:12px; cursor:pointer;
  background:linear-gradient(90deg,#1ab9a0 0%,#2196c9 100%);
  color:#fff; font-size:15px; font-weight:800;
  font-family:inherit; letter-spacing:0.2px;
  display:flex; align-items:center; justify-content:center; gap:8px;
  position:relative; overflow:hidden;
  box-shadow:0 4px 20px rgba(26,185,160,0.32), 0 1px 0 rgba(255,255,255,0.15) inset;
  transition:transform 0.18s cubic-bezier(0.22,0.68,0,1.2), box-shadow 0.18s, filter 0.18s;
  margin-top:6px;
}
.cta-btn::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent);
  transform:translateX(-100%); transition:transform 0.5s;
}
.cta-btn:hover:not(:disabled) {
  transform:translateY(-2px);
  box-shadow:0 8px 32px rgba(26,185,160,0.44), 0 1px 0 rgba(255,255,255,0.15) inset;
  filter:brightness(1.06);
}
.cta-btn:hover:not(:disabled)::before { transform:translateX(100%); }
.cta-btn:active:not(:disabled) { transform:scale(0.988) translateY(0); }
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
  background:rgba(192,57,43,0.08);
  border:1px solid rgba(192,57,43,0.18);
  border-radius:8px; padding:9px 12px;
  margin-top:10px;
  display:flex; align-items:center; gap:7px;
}

.spinner {
  width:18px; height:18px;
  border:2.5px solid rgba(255,255,255,0.35);
  border-top-color:#fff; border-radius:50%;
  animation:spin 0.7s linear infinite; flex-shrink:0;
}

.footer-text {
  text-align:center; font-size:12px; font-weight:500;
  color:#9ab8c2; margin-top:22px; letter-spacing:0.15px;
}
.footer-dots { display:flex; justify-content:center; gap:5px; margin-top:10px; }
.footer-dot { width:4px; height:4px; border-radius:50%; }
`;

function EyeIcon({ open }: { open:boolean }) {
  return open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

const UserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LockIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
const AlertIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

function InputField({ id, label, type="text", value, placeholder, disabled, autoFocus, onChange, onKeyDown, showToggle }: any) {
  const [showPw, setShowPw] = useState(false);
  const inputType = type==="password" ? (showPw?"text":"password") : type;
  const Icon = type==="password" ? LockIcon : UserIcon;
  return (
    <div className="field-wrap">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="field-input-wrap">
        <span className="field-icon"><Icon/></span>
        <input id={id} type={inputType}
          className={`auth-input${showToggle?" has-toggle":""}`}
          value={value} placeholder={placeholder}
          disabled={disabled} autoFocus={autoFocus}
          onChange={e=>onChange(e.target.value)}
          onKeyDown={onKeyDown}/>
        {showToggle && (
          <button type="button" className="toggle-btn"
            onClick={()=>setShowPw(v=>!v)}
            tabIndex={-1}
            aria-label={showPw?"Hide password":"Show password"}>
            <EyeIcon open={showPw}/>
          </button>
        )}
      </div>
    </div>
  );
}

function DevForm({ onAuthed }: { onAuthed:()=>void }) {
  const [devSub, setDevSub] = useState("user123");
  const [loading, setLoading] = useState(false);
  const go = () => {
    if (!devSub.trim()||loading) return;
    setLoading(true);
    setDevUserSub(devSub.trim());
    setTimeout(()=>{ setLoading(false); onAuthed(); }, 500);
  };
  return (
    <>
      <InputField id="devSub" label="Dev User Sub" value={devSub}
        placeholder="e.g. user123" autoFocus disabled={loading}
        onChange={setDevSub} onKeyDown={(e:any)=>e.key==="Enter"&&go()}/>
      <button className="cta-btn" disabled={!devSub.trim()||loading} onClick={go}>
        {loading
          ? <><div className="spinner"/><span>Authenticating…</span></>
          : <><span>Continue</span><ArrowIcon/></>}
      </button>
    </>
  );
}

function CognitoForm({ onAuthed }: { onAuthed:()=>void }) {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const go = async () => {
    if (loading) return;
    setErr(""); setLoading(true);
    try {
      mode==="login" ? await login(username,password) : await register(username,password);
      onAuthed();
    } catch(e:any) { setErr(e.message||"Authentication failed"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="mode-tabs">
        <button className={`mode-tab${mode==="login"?" active":""}`} onClick={()=>{setErr("");setMode("login");}}>Sign In</button>
        <button className={`mode-tab${mode==="register"?" active":""}`} onClick={()=>{setErr("");setMode("register");}}>Create Account</button>
      </div>
      <InputField id="username" label="Email address" type="email" value={username}
        placeholder="you@company.com" autoFocus disabled={loading}
        onChange={setUsername} onKeyDown={(e:any)=>e.key==="Enter"&&go()}/>
      <InputField id="password" label="Password" type="password" value={password}
        placeholder={mode==="register"?"Min 8 characters":"Enter your password"}
        disabled={loading} onChange={setPassword}
        onKeyDown={(e:any)=>e.key==="Enter"&&go()} showToggle/>
      <div className="remember-row">
        <label className="remember-label">
          <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>
          Remember me
        </label>
        {mode==="login" && (
          <button className="forgot-btn" onClick={()=>alert("Password reset coming soon")}>
            Forgot password?
          </button>
        )}
      </div>
      {err && (
        <div className="error-msg">
          <AlertIcon/>{err}
        </div>
      )}
      <button className="cta-btn"
        disabled={!username.trim()||!password.trim()||loading}
        onClick={go}
        style={{ marginTop: err?"12px":"6px" }}>
        {loading
          ? <><div className="spinner"/><span>{mode==="login"?"Signing in…":"Creating account…"}</span></>
          : <><span>{mode==="login"?"Sign In":"Create Account"}</span><ArrowIcon/></>}
      </button>
    </>
  );
}

export default function AuthPage({ onAuthed }: { onAuthed:()=>void }) {
  const [visible, setVisible] = useState(false);
  useEffect(()=>{ const id=requestAnimationFrame(()=>setVisible(true)); return()=>cancelAnimationFrame(id); },[]);

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-root">
        <div className="auth-grid"/>

        {/* Soft ambient orbs matching dashboard palette */}
        <div className="auth-orb" style={{ width:500,height:500,top:-120,left:-100,background:"rgba(26,185,160,0.14)",["--dur" as any]:"10s",["--tx" as any]:"30px",["--ty" as any]:"-20px" }}/>
        <div className="auth-orb" style={{ width:380,height:380,bottom:-100,right:-80,background:"rgba(33,150,201,0.11)",["--dur" as any]:"13s",["--tx" as any]:"-20px",["--ty" as any]:"25px" }}/>
        <div className="auth-orb" style={{ width:240,height:240,top:"45%",right:"18%",background:"rgba(26,185,160,0.07)",["--dur" as any]:"8s",["--tx" as any]:"15px",["--ty" as any]:"-35px" }}/>

        <div className="auth-card" role="main" aria-label="Sign in to Smart Expense Tracker">

          {/* Brand */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:26,animation:"fadeUp 0.45s 0.05s both" }}>
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="12" width="5" height="8" rx="1.5" fill="rgba(255,255,255,0.95)"/>
                <rect x="8.5" y="7" width="5" height="13" rx="1.5" fill="rgba(255,255,255,0.75)"/>
                <rect x="15" y="3" width="5" height="17" rx="1.5" fill="rgba(255,255,255,0.95)"/>
                <path d="M3 9.5L8.5 6L14 8.5L20 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="4" r="1.8" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:18,fontWeight:900,color:"#0a2030",letterSpacing:"-0.5px",lineHeight:1.15 }}>Smart Expense</div>
              <div style={{ fontSize:11,fontWeight:600,color:"#8aabb8",letterSpacing:"0.3px" }}>Tracker · Finance OS</div>
            </div>
          </div>

          <div className="divider"/>

          {/* Headings */}
          <div style={{ textAlign:"center",marginBottom:22,animation:"fadeUp 0.45s 0.1s both" }}>
            <h1 style={{ fontSize:23,fontWeight:900,color:"#0a2030",letterSpacing:"-0.6px",margin:"0 0 7px",lineHeight:1.2 }}>
              {IS_DEV ? "Development Access" : "Welcome back"}
            </h1>
            <p style={{ fontSize:13.5,color:"#6a9aaa",lineHeight:1.6,margin:0,fontWeight:500 }}>
              {IS_DEV
                ? "Authenticate with a dev user sub — no AWS required"
                : "Sign in to your expense management workspace"}
            </p>
          </div>

          {/* Badge */}
          <div style={{ display:"flex",justifyContent:"center",marginBottom:22,animation:"fadeUp 0.45s 0.15s both" }}>
            <div className="env-badge">
              <div className="env-dot"/>
              {IS_DEV ? "DEV AUTH · no AWS" : "COGNITO · Amplify"}
            </div>
          </div>

          {/* Form */}
          <div style={{ animation:"fadeUp 0.45s 0.2s both" }}>
            {IS_DEV ? <DevForm onAuthed={onAuthed}/> : <CognitoForm onAuthed={onAuthed}/>}
          </div>

          {/* Footer */}
          <p className="footer-text">Secured by AWS · End-to-end encrypted · SOC 2 ready</p>
          <div className="footer-dots">
            {["rgba(26,185,160,0.2)","rgba(26,185,160,0.5)","rgba(26,185,160,0.2)"].map((c,i)=>(
              <div key={i} className="footer-dot" style={{ background:c }}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
