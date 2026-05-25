import React, { useState } from "react";
import type { Expense } from "../types";
import { CATEGORY_COLORS } from "../types";

interface Props {
  expense: Expense;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseRow({ expense, onEdit, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const color = CATEGORY_COLORS[expense.category] || "#94a3b8";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
      style={{
        display:"flex", alignItems:"center", gap:14,
        padding:"14px 18px", borderRadius:12,
        background: hovered ? "rgba(26,185,160,0.04)" : "transparent",
        border:"1px solid", borderColor: hovered ? "rgba(26,185,160,0.12)" : "transparent",
        transition:"all 0.15s", cursor:"default",
      }}
    >
      {/* Category dot */}
      <div style={{ width:38, height:38, borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:color }}/>
      </div>

      {/* Merchant + category */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#0d2f3a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{expense.merchant}</div>
        <div style={{ fontSize:11, color:"#7a9aaa", marginTop:2, fontWeight:500 }}>{expense.category} · {expense.paymentMethod}</div>
      </div>

      {/* Date */}
      <div style={{ fontSize:12, color:"#7a9aaa", fontWeight:500, flexShrink:0, minWidth:80, textAlign:"right" }}>
        {new Date(expense.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
      </div>

      {/* Amount */}
      <div style={{ fontSize:16, fontWeight:800, color:"#0d2f3a", minWidth:80, textAlign:"right", letterSpacing:"-0.3px" }}>
        ${expense.amount.toFixed(2)}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:6, opacity: hovered ? 1 : 0, transition:"opacity 0.15s", flexShrink:0 }}>
        <button onClick={() => onEdit(expense)} style={{ padding:"5px 10px", borderRadius:7, border:"1px solid rgba(33,150,201,0.25)", background:"rgba(33,150,201,0.08)", color:"#2196c9", fontSize:12, fontWeight:600, cursor:"pointer" }}>Edit</button>
        {confirming
          ? <button onClick={() => onDelete(expense.id)} style={{ padding:"5px 10px", borderRadius:7, border:"1px solid rgba(239,68,68,0.35)", background:"rgba(239,68,68,0.12)", color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer" }}>Confirm?</button>
          : <button onClick={() => setConfirming(true)} style={{ padding:"5px 10px", borderRadius:7, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.06)", color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer" }}>Delete</button>
        }
      </div>
    </div>
  );
}
