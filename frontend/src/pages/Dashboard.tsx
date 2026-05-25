import React, { useState } from "react";
import KPICard from "../components/KPICard";
import SpendingChart from "../components/SpendingChart";
import CategoryPie from "../components/CategoryPie";
import ExpenseRow from "../components/ExpenseRow";
import { useSummary, useExpenses } from "../hooks/useExpenses";
import type { Expense } from "../types";
import { CATEGORY_COLORS } from "../types";

interface Props {
  month: string;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
  onAddExpense: () => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

function SkeletonCard() {
  return (
    <div className="card" style={{ padding:"20px 22px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
        <div>
          <div className="skeleton" style={{ width:80, height:11, marginBottom:10 }}/>
          <div className="skeleton" style={{ width:120, height:28 }}/>
        </div>
        <div className="skeleton" style={{ width:44, height:44, borderRadius:13 }}/>
      </div>
      <div className="skeleton" style={{ width:140, height:16 }}/>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: ()=>void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 24px", textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:18, background:"rgba(26,185,160,0.1)", border:"1px solid rgba(26,185,160,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1ab9a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>
      <div style={{ fontSize:16, fontWeight:700, color:"var(--text-primary)", marginBottom:6 }}>No expenses yet</div>
      <div style={{ fontSize:13, color:"var(--text-muted)", marginBottom:20, maxWidth:240 }}>Add your first expense to start tracking your spending</div>
      <button className="btn-primary" onClick={onAdd}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add first expense
      </button>
    </div>
  );
}

function BudgetBar({ label, spent, budget, color }: { label:string; spent:number; budget:number; color:string }) {
  const pct = Math.min((spent/budget)*100, 100);
  const over = pct >= 90;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:700, color: over ? "#ef4444" : "var(--text-primary)" }}>${spent.toFixed(0)} <span style={{ fontWeight:400, color:"var(--text-muted)" }}>/ ${budget}</span></span>
      </div>
      <div style={{ height:6, borderRadius:99, background:"rgba(26,185,160,0.1)", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background: over ? "linear-gradient(90deg,#f59e0b,#ef4444)" : `linear-gradient(90deg,${color},#2196c9)`, transition:"width 0.8s cubic-bezier(.22,.68,0,1.2)" }}/>
      </div>
    </div>
  );
}

export default function Dashboard({ month, onEdit, onDelete, onAddExpense, onToast }: Props) {
  const { summary, loading: sl } = useSummary(month);
  const { expenses, loading: el, remove } = useExpenses(month);

  const handleDelete = async (id: string) => {
    try { await remove(id); onToast("Expense deleted", "success"); }
    catch { onToast("Failed to delete", "error"); }
  };

  const recent = expenses.slice(0, 5);
  const loading = sl || el;

  const spark = summary?.weeklyTotals?.map(w => w.total) ?? [0,0,0,0];

  return (
    <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:22, animation:"fadeIn 0.4s ease" }}>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
        {loading ? (<><SkeletonCard/><SkeletonCard/><SkeletonCard/><SkeletonCard/></>) : (<>
          <KPICard label="Total Spend" value={summary?.totalSpend ?? 0} prefix="$" sub={`${summary?.expenseCount ?? 0} transactions`} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} color="#1ab9a0" trend={{ value:"12%", up:false }} delay={0} sparkline={spark}/>
          <KPICard label="Daily Average" value={summary?.dailyAverage ?? 0} prefix="$" sub="This month" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} color="#2196c9" trend={{ value:"5%", up:true }} delay={60}/>
          <KPICard label="Top Category" displayValue={summary?.topCategory?.replace(/_/g," ") ?? "—"} value={0} sub={summary?.categoryBreakdown[0] ? `$${summary.categoryBreakdown[0].total.toFixed(0)} spent` : "No data yet"} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>} color="#8b5cf6" delay={120}/>
          <KPICard label="Transactions" value={summary?.expenseCount ?? 0} prefix="" sub="This month" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/></svg>} color="#f59e0b" trend={{ value:"3", up:true }} delay={180}/>
        </>)}
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:14 }}>
        <SpendingChart data={summary?.weeklyTotals ?? []}/>
        <CategoryPie data={summary?.categoryBreakdown ?? []}/>
      </div>

      {/* Bottom row: recent + budget */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:14 }}>

        {/* Recent transactions */}
        <div className="card" style={{ padding:"0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 14px" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>Recent Transactions</div>
              <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>Latest activity this month</div>
            </div>
            <button className="btn-ghost" onClick={onAddExpense} style={{ fontSize:12 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add new
            </button>
          </div>
          <div style={{ borderTop:"1px solid rgba(26,185,160,0.08)", padding:"4px 8px 8px" }}>
            {loading
              ? [1,2,3].map(i=><div key={i} style={{ padding:"12px 10px", display:"flex", gap:12, alignItems:"center" }}><div className="skeleton" style={{ width:36,height:36,borderRadius:10,flexShrink:0 }}/><div style={{ flex:1 }}><div className="skeleton" style={{ width:"60%",height:13,marginBottom:6 }}/><div className="skeleton" style={{ width:"40%",height:11 }}/></div><div className="skeleton" style={{ width:60,height:16 }}/></div>)
              : recent.length === 0
                ? <EmptyState onAdd={onAddExpense}/>
                : recent.map(e=><ExpenseRow key={e.id} expense={e} onEdit={onEdit} onDelete={handleDelete}/>)
            }
          </div>
        </div>

        {/* Budget tracker */}
        <div className="card" style={{ padding:"20px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)", marginBottom:4 }}>Monthly Budgets</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:18 }}>Spending vs limits</div>
          {summary?.categoryBreakdown?.slice(0,5).map((item,i) => (
            <BudgetBar
              key={item.category}
              label={String(item.category).replace(/_/g," ")}
              spent={item.total}
              budget={Math.round(item.total * (1 + (i % 3 === 0 ? 0.3 : 0.6)))}
              color={CATEGORY_COLORS[item.category] || "#1ab9a0"}
            />
          ))}
          {(!summary || summary.categoryBreakdown.length === 0) && (
            <div style={{ textAlign:"center", padding:"20px 0", color:"var(--text-muted)", fontSize:13 }}>
              Add expenses to see budget tracking
            </div>
          )}
          <div style={{ marginTop:8, padding:"10px 12px", borderRadius:10, background:"rgba(26,185,160,0.06)", border:"1px solid rgba(26,185,160,0.12)", fontSize:12, color:"var(--text-secondary)", fontWeight:500 }}>
            Budget limits auto-scale to spending. Custom limits coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}
