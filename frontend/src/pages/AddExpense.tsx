import React, { useState, useEffect } from "react";
import { createExpense, updateExpense, uploadReceipt } from "../lib/api";
import type { Expense, ExpenseInput, Category, PaymentMethod } from "../types";
import { CATEGORIES, PAYMENT_METHODS } from "../types";

interface Props {
  expense?: Expense | null;
  onSaved: () => void;
  onCancel: () => void;
}

const today = () => new Date().toISOString().split("T")[0];

const inputStyle = {
  width:"100%", height:44, borderRadius:10, border:"1.5px solid rgba(26,185,160,0.22)",
  background:"rgba(255,255,255,0.82)", padding:"0 14px", fontSize:14,
  color:"#0d2f3a", outline:"none", fontFamily:"inherit", boxSizing:"border-box" as const,
  transition:"border-color 0.2s, box-shadow 0.2s",
};

export default function AddExpense({ expense, onSaved, onCancel }: Props) {
  const isEdit = !!expense;
  const [amount,        setAmount       ] = useState(expense ? String(expense.amount) : "");
  const [date,          setDate         ] = useState(expense?.date ?? today());
  const [merchant,      setMerchant     ] = useState(expense?.merchant ?? "");
  const [category,      setCategory     ] = useState<Category>(expense?.category ?? "Food & Dining");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(expense?.paymentMethod ?? "Credit Card");
  const [notes,         setNotes        ] = useState(expense?.notes ?? "");
  const [receipt,       setReceipt      ] = useState<File | null>(null);
  const [saving,        setSaving       ] = useState(false);
  const [err,           setErr          ] = useState("");
  const [focus,         setFocus        ] = useState<string | null>(null);

  const iStyle = (field: string) => ({
    ...inputStyle,
    borderColor: focus === field ? "#1ab9a0" : "rgba(26,185,160,0.22)",
    boxShadow: focus === field ? "0 0 0 3px rgba(26,185,160,0.12)" : "none",
    background: focus === field ? "#fff" : "rgba(255,255,255,0.82)",
  });

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setErr("Enter a valid amount."); return; }
    if (!merchant.trim()) { setErr("Merchant is required."); return; }
    setErr(""); setSaving(true);
    try {
      let receiptKey = expense?.receiptKey;
      if (receipt) receiptKey = await uploadReceipt(receipt);
      const input: ExpenseInput = {
        amount: Number(amount), date, merchant: merchant.trim(),
        category, paymentMethod, notes: notes.trim(),
        receiptKey,
      };
      isEdit ? await updateExpense(expense!.id, input) : await createExpense(input);
      onSaved();
    } catch(e: any) { setErr(e.message || "Save failed."); }
    finally { setSaving(false); }
  };

  const LabelStyle = { fontSize:13, fontWeight:600, color:"#2a5565", marginBottom:6, display:"block" as const };

  return (
    <div style={{ padding:"24px 28px", maxWidth:640, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
        <button onClick={onCancel} style={{ width:36,height:36,borderRadius:9,border:"1px solid rgba(26,185,160,0.2)",background:"rgba(26,185,160,0.07)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#1ab9a0" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <div style={{ fontSize:20,fontWeight:800,color:"#0d2f3a",letterSpacing:"-0.4px" }}>{isEdit?"Edit Expense":"New Expense"}</div>
          <div style={{ fontSize:13,color:"#7a9aaa",marginTop:1 }}>{isEdit?"Update the details below":"Fill in the expense details"}</div>
        </div>
      </div>

      {/* Card */}
      <div style={{ background:"rgba(255,255,255,0.72)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,0.85)",borderRadius:18,padding:"24px",boxShadow:"0 4px 24px rgba(30,120,110,0.08)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 20px" }}>
          {/* Amount */}
          <div>
            <label style={LabelStyle}>Amount *</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#7a9aaa",fontWeight:700,fontSize:15 }}>$</span>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01"
                onFocus={()=>setFocus("amount")} onBlur={()=>setFocus(null)}
                style={{ ...iStyle("amount"), paddingLeft:24 }}/>
            </div>
          </div>
          {/* Date */}
          <div>
            <label style={LabelStyle}>Date *</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              onFocus={()=>setFocus("date")} onBlur={()=>setFocus(null)} style={iStyle("date")}/>
          </div>
          {/* Merchant */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={LabelStyle}>Merchant *</label>
            <input type="text" value={merchant} onChange={e=>setMerchant(e.target.value)} placeholder="e.g. Whole Foods"
              onFocus={()=>setFocus("merchant")} onBlur={()=>setFocus(null)} style={iStyle("merchant")}/>
          </div>
          {/* Category */}
          <div>
            <label style={LabelStyle}>Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value as Category)}
              onFocus={()=>setFocus("cat")} onBlur={()=>setFocus(null)} style={iStyle("cat")}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Payment method */}
          <div>
            <label style={LabelStyle}>Payment Method</label>
            <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value as PaymentMethod)}
              onFocus={()=>setFocus("pm")} onBlur={()=>setFocus(null)} style={iStyle("pm")}>
              {PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {/* Notes */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={LabelStyle}>Notes</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional notes…" rows={3}
              onFocus={()=>setFocus("notes")} onBlur={()=>setFocus(null)}
              style={{ ...iStyle("notes"), height:"auto", padding:"10px 14px", resize:"vertical" as const }}/>
          </div>
          {/* Receipt */}
          <div style={{ gridColumn:"1/-1" }}>
            <label style={LabelStyle}>Receipt Image</label>
            <div style={{ border:"1.5px dashed rgba(26,185,160,0.3)",borderRadius:10,padding:"18px",textAlign:"center",background:"rgba(26,185,160,0.03)",cursor:"pointer" }}
              onClick={()=>document.getElementById("receipt-upload")!.click()}>
              {receipt
                ? <div style={{ color:"#0d6e5a",fontWeight:600,fontSize:14 }}>📎 {receipt.name}</div>
                : <div style={{ color:"#7a9aaa",fontSize:13 }}>
                    <div style={{ fontSize:24,marginBottom:6 }}>📤</div>
                    <div>Click to upload receipt <span style={{ color:"#1ab9a0",fontWeight:600 }}>or drag & drop</span></div>
                    <div style={{ fontSize:11,marginTop:3 }}>PNG, JPG, PDF up to 10MB</div>
                  </div>
              }
              <input id="receipt-upload" type="file" accept="image/*,.pdf" style={{ display:"none" }}
                onChange={e => setReceipt(e.target.files?.[0] || null)}/>
            </div>
          </div>
        </div>

        {err && <div style={{ marginTop:14,padding:"10px 14px",borderRadius:8,background:"rgba(192,57,43,0.08)",border:"1px solid rgba(192,57,43,0.18)",color:"#c0392b",fontSize:13 }} role="alert">{err}</div>}

        <div style={{ display:"flex",gap:10,marginTop:22 }}>
          <button onClick={onCancel} style={{ flex:1,height:46,borderRadius:10,border:"1.5px solid rgba(26,185,160,0.22)",background:"transparent",color:"#5a7a86",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} style={{ flex:2,height:46,borderRadius:10,border:"none",background:"linear-gradient(90deg,#1ab9a0,#2196c9)",color:"#fff",fontWeight:700,fontSize:15,cursor:saving?"not-allowed":"pointer",boxShadow:"0 4px 16px rgba(26,185,160,0.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit",filter:saving?"brightness(0.85)":"none",transition:"all 0.18s" }}>
            {saving
              ? <><span style={{ width:18,height:18,border:"2.5px solid rgba(255,255,255,0.35)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite" }}/> Saving…</>
              : <>{isEdit?"Save Changes":"Add Expense"}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
