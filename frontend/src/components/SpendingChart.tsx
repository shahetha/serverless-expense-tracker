import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: { week: string; total: number }[]; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(10px)",
      border:"1px solid rgba(26,185,160,0.2)", borderRadius:10,
      padding:"10px 14px", boxShadow:"0 4px 20px rgba(30,120,110,0.15)",
    }}>
      <div style={{ fontSize:11, fontWeight:600, color:"#7a9aaa", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:800, color:"#0d2f3a" }}>${payload[0].value.toFixed(0)}</div>
    </div>
  );
};

export default function SpendingChart({ data }: Props) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.72)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
      border:"1px solid rgba(255,255,255,0.85)", borderRadius:18, padding:"20px 22px",
      boxShadow:"0 4px 24px rgba(30,120,110,0.08)",
    }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#0d2f3a", letterSpacing:"-0.2px" }}>Weekly Spending</div>
        <div style={{ fontSize:12, color:"#7a9aaa", marginTop:2 }}>Expense breakdown by week</div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,185,160,0.08)" vertical={false}/>
          <XAxis dataKey="week" tick={{ fontSize:12, fill:"#7a9aaa", fontWeight:600 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontSize:11, fill:"#7a9aaa" }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
          <Tooltip content={<CustomTooltip/>} cursor={{ fill:"rgba(26,185,160,0.05)", radius:8 }}/>
          <Bar dataKey="total" radius={[8,8,0,0]}
            fill="url(#barGrad)"
          />
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1ab9a0"/>
              <stop offset="100%" stopColor="#2196c9"/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
