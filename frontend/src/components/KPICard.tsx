import React, { useEffect, useRef, useState } from "react";

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  displayValue?: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  trend?: { value: string; up: boolean };
  delay?: number;
  sparkline?: number[];
}

function AnimatedNumber({ value, prefix="", decimals=0 }: { value:number; prefix?:string; decimals?:number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const start = Date.now();
    const duration = 900;
    const from = 0;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * ease);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current!);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const W = 72, H = 28;
  const pts = data.map((v, i) => `${(i / (data.length-1)) * W},${H - ((v - min) / range) * H}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={pts} opacity="0.7"/>
      <circle cx={(data.length-1)/(data.length-1)*W} cy={H-((data[data.length-1]-min)/range)*H} r="2.5" fill={color}/>
    </svg>
  );
}

export default function KPICard({ label, value, prefix="$", displayValue, sub, icon, color, trend, delay=0, sparkline }: KPICardProps) {
  const isStr = !!displayValue;
  return (
    <div className="card" style={{
      padding:"20px 22px", display:"flex", flexDirection:"column", gap:14,
      animation:`fadeUp 0.5s ${delay}ms both ease-out`,
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#8aabb8", letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
          <div style={{ fontSize:28, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-1px", lineHeight:1 }}>
            {isStr ? displayValue : <AnimatedNumber value={value} prefix={prefix} decimals={value % 1 !== 0 ? 2 : 0}/>}
          </div>
          {sub && <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:6, fontWeight:500 }}>{sub}</div>}
        </div>
        <div style={{
          width:44, height:44, borderRadius:13,
          background:`linear-gradient(135deg,${color}18,${color}30)`,
          border:`1px solid ${color}25`,
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, color,
        }}>{icon}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {trend && (
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700 }}>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:3,
              color: trend.up ? "#1ab9a0" : "#ef4444",
              background: trend.up ? "rgba(26,185,160,0.1)" : "rgba(239,68,68,0.1)",
              padding:"2px 8px", borderRadius:6,
            }}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </span>
            <span style={{ color:"var(--text-muted)", fontWeight:500 }}>vs last month</span>
          </div>
        )}
        {sparkline && <Sparkline data={sparkline} color={color}/>}
      </div>
    </div>
  );
}
