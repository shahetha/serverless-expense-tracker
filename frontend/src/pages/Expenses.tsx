import React, { useState } from "react";
import ExpenseRow from "../components/ExpenseRow";
import { useExpenses } from "../hooks/useExpenses";
import type { Expense, Category } from "../types";
import { CATEGORIES } from "../types";

interface Props { month: string; onEdit: (e: Expense) => void; onAdd: () => void; onToast: (msg:string,type?:"success"|"error"|"info")=>void; }

export default function Expenses({ month, onEdit, onAdd, onToast }: Props) {
  const { expenses, loading, remove } = useExpenses(month);
  const [catFilter, setCatFilter] = useState<Category|"">("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date"|"amount">("date");

  const filtered = expenses
    .filter(e => !catFilter || e.category === catFilter)
    .filter(e => !search || e.merchant.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==="date" ? b.date.localeCompare(a.date) : b.amount-a.amount);

  const total = filtered.reduce((s,e)=>s+e.amount,0);

  const handleDelete = async (id: string) => {
    try { await remove(id); onToast("Expense deleted","success"); }
    catch { onToast("Failed to delete","error"); }
  };

  return (
    <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:20, animation:"fadeIn 0.4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.5px" }}>All Expenses</div>
          <div style={{ fontSize:13, color:"var(--text-muted)", marginTop:2 }}>{filtered.length} transactions · ${total.toFixed(2)} total</div>
        </div>
        <button className="btn-primary" onClick={onAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Expense
        </button>
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8aabb8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search merchant or category…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", height:38, paddingLeft:36, paddingRight:12, borderRadius:10, border:"1.5px solid rgba(26,185,160,0.18)", background:"rgba(255,255,255,0.85)", fontSize:13, color:"var(--text-primary)", outline:"none", fontFamily:"inherit" }}/>
        </div>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value as Category|"")}
          style={{ height:38, padding:"0 12px", borderRadius:10, border:"1.5px solid rgba(26,185,160,0.18)", background:"rgba(255,255,255,0.85)", fontSize:13, color:"var(--text-primary)", outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value as "date"|"amount")}
          style={{ height:38, padding:"0 12px", borderRadius:10, border:"1.5px solid rgba(26,185,160,0.18)", background:"rgba(255,255,255,0.85)", fontSize:13, color:"var(--text-primary)", outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
        </select>
        {(catFilter||search) && <button className="btn-ghost" onClick={()=>{setCatFilter("");setSearch("");}} style={{ color:"#e05454", borderColor:"rgba(239,68,68,0.25)" }}>Clear</button>}
      </div>

      <div className="card" style={{ padding:"8px", overflow:"hidden" }}>
        {loading
          ? [1,2,3,4].map(i=><div key={i} style={{ padding:"14px 18px", display:"flex", gap:12, alignItems:"center" }}><div className="skeleton" style={{ width:38,height:38,borderRadius:10,flexShrink:0 }}/><div style={{ flex:1 }}><div className="skeleton" style={{ width:"50%",height:13,marginBottom:7 }}/><div className="skeleton" style={{ width:"35%",height:11 }}/></div><div className="skeleton" style={{ width:70,height:16 }}/></div>)
          : filtered.length===0
            ? <div style={{ padding:48, textAlign:"center", color:"var(--text-muted)", fontSize:14 }}>
                <div style={{ fontSize:36, marginBottom:12 }}>📭</div>
                No expenses found.{" "}
                <button onClick={onAdd} style={{ background:"none", border:"none", color:"#1ab9a0", fontWeight:700, cursor:"pointer", fontSize:14 }}>Add one?</button>
              </div>
            : filtered.map(e=><ExpenseRow key={e.id} expense={e} onEdit={onEdit} onDelete={handleDelete}/>)
        }
      </div>
    </div>
  );
}
