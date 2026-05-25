import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryBreakdown } from "../types";
import { CATEGORY_COLORS } from "../types";

interface Props { data: CategoryBreakdown[]; }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CategoryBreakdown;
  return (
    <div style={{
      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(10px)",
      border:"1px solid rgba(26,185,160,0.2)", borderRadius:10,
      padding:"10px 14px", boxShadow:"0 4px 20px rgba(30,120,110,0.15)",
    }}>
      <div style={{ fontSize:12, fontWeight:700, color:"#0d2f3a", marginBottom:2 }}>{d.category}</div>
      <div style={{ fontSize:16, fontWeight:800, color:"#0d2f3a" }}>${d.total.toFixed(2)}</div>
      <div style={{ fontSize:11, color:"#7a9aaa" }}>{d.percentage}% · {d.count} expenses</div>
    </div>
  );
};

export default function CategoryPie({ data }: Props) {
  const top5 = data.slice(0, 5);
  return (
    <div style={{
      background:"rgba(255,255,255,0.72)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
      border:"1px solid rgba(255,255,255,0.85)", borderRadius:18, padding:"20px 22px",
      boxShadow:"0 4px 24px rgba(30,120,110,0.08)",
    }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#0d2f3a", letterSpacing:"-0.2px" }}>Category Breakdown</div>
        <div style={{ fontSize:12, color:"#7a9aaa", marginTop:2 }}>Spending by category</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={top5} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
              dataKey="total" paddingAngle={3} strokeWidth={0}>
              {top5.map((entry, i) => (
                <Cell key={i} fill={CATEGORY_COLORS[entry.category] || "#94a3b8"}/>
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip/>}/>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
          {top5.map((item, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:CATEGORY_COLORS[item.category], flexShrink:0 }}/>
              <div style={{ flex:1, fontSize:12, fontWeight:600, color:"#3a5a6a" }}>{item.category}</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#0d2f3a" }}>{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
