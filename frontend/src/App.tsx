import React, { useState, useEffect, useCallback } from "react";
import { configureAuth, isAuthed, getDevUserSub, usingDevAuth } from "./lib/auth";
import AuthPage   from "./pages/Auth";
import Dashboard  from "./pages/Dashboard";
import Expenses   from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import Sidebar    from "./components/Sidebar";
import Topbar     from "./components/Topbar";
import ToastContainer, { type ToastMessage } from "./components/Toast";
import type { Expense } from "./types";

configureAuth();

type Page = "dashboard"|"expenses"|"add";
const nowMonth = () => new Date().toISOString().slice(0,7);

export default function App() {
  const [authed,   setAuthed  ] = useState(false);
  const [checking, setChecking] = useState(true);
  const [page,     setPage    ] = useState<Page>("dashboard");
  const [month,    setMonth   ] = useState(nowMonth());
  const [editing,  setEditing ] = useState<Expense|null>(null);
  const [username, setUsername] = useState("user");
  const [toasts,   setToasts  ] = useState<ToastMessage[]>([]);

  useEffect(() => {
    isAuthed().then(ok => {
      setAuthed(ok);
      if (ok) {
        const sub = getDevUserSub() || "user";
        setUsername(sub.length > 22 ? sub.slice(0,22)+"…" : sub);
      }
      setChecking(false);
    });
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage["type"] = "info") => {
    const id = String(Date.now());
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAuthed = () => {
    setAuthed(true);
    const sub = getDevUserSub() || "user";
    setUsername(sub.length > 22 ? sub.slice(0,22)+"…" : sub);
    addToast("Welcome back!", "success");
  };

  const openEdit = (e: Expense) => { setEditing(e); setPage("add"); };
  const handleSaved = () => { setEditing(null); setPage("expenses"); addToast(editing ? "Expense updated" : "Expense added", "success"); };

  const PAGE_TITLES: Record<Page,string> = {
    dashboard:"Dashboard", expenses:"Expenses", add: editing ? "Edit Expense" : "New Expense",
  };

  if (checking) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#b2eee6,#7dd3c8,#a8d5e2)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:44,height:44,border:"3px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 14px" }}/>
        <div style={{ fontSize:14,color:"rgba(255,255,255,0.85)",fontWeight:600 }}>Loading…</div>
      </div>
    </div>
  );

  if (!authed) return <AuthPage onAuthed={handleAuthed}/>;

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Manrope',system-ui,sans-serif" }}>
      <Sidebar active={page} onNavigate={p => { setEditing(null); setPage(p as Page); }} username={username}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <Topbar title={PAGE_TITLES[page]} month={month} onMonthChange={setMonth}/>
        <main style={{ flex:1, overflowY:"auto" }}>
          {page==="dashboard" && <Dashboard month={month} onEdit={openEdit} onDelete={()=>{}} onAddExpense={()=>{setEditing(null);setPage("add");}} onToast={addToast}/>}
          {page==="expenses"  && <Expenses  month={month} onEdit={openEdit} onAdd={()=>{setEditing(null);setPage("add");}} onToast={addToast}/>}
          {page==="add"       && <AddExpense expense={editing} onSaved={handleSaved} onCancel={()=>{setEditing(null);setPage("expenses");}} onToast={addToast}/>}
        </main>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast}/>
    </div>
  );
}
