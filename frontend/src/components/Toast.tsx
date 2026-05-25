import React, { useEffect } from "react";

export type ToastType = "success"|"error"|"info";
export interface ToastMessage { id: string; type: ToastType; message: string; }

interface ToastProps { toasts: ToastMessage[]; onRemove: (id: string) => void; }

const ICONS = {
  success: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  error:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  info:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};
const COLORS = { success:{ bg:"rgba(26,185,160,0.12)", border:"rgba(26,185,160,0.3)", color:"#0d8c76" }, error:{ bg:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.3)", color:"#e05454" }, info:{ bg:"rgba(33,150,201,0.1)", border:"rgba(33,150,201,0.3)", color:"#185fa5" } };

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove:(id:string)=>void }) {
  useEffect(() => { const t = setTimeout(()=>onRemove(toast.id), 3500); return ()=>clearTimeout(t); }, []);
  const c = COLORS[toast.type];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", borderRadius:12, background:c.bg, border:`1px solid ${c.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.1)", animation:"toastIn 0.3s ease", backdropFilter:"blur(12px)", minWidth:240, maxWidth:340 }}>
      <span style={{ color:c.color, flexShrink:0 }}>{ICONS[toast.type]}</span>
      <span style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", flex:1 }}>{toast.message}</span>
      <button onClick={()=>onRemove(toast.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:2, lineHeight:1 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => <Toast key={t.id} toast={t} onRemove={onRemove}/>)}
    </div>
  );
}
