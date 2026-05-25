import React, { useState } from "react";
import { logout } from "../lib/auth";

interface SidebarProps {
  active: string;
  onNavigate: (key: string) => void;
  username: string;
}

const NAV_MAIN = [
  { key:"dashboard",   label:"Dashboard",   icon:"M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 3h2v2h-2zm0-3h2v2h-2zm3 0h2v2h-2zm0 3h2v2h-2z" },
  { key:"expenses",    label:"Expenses",    icon:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { key:"add",         label:"Add Expense", icon:"M12 5v14M5 12h14" },
];

const NAV_SECONDARY = [
  { key:"budgets",   label:"Budgets",   icon:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v6l4 2", disabled:true },
  { key:"analytics", label:"Analytics", icon:"M18 20V10M12 20V4M6 20v-6", disabled:true },
  { key:"settings",  label:"Settings",  icon:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.93-3a6.001 6.001 0 0 0-.09-1H21l-3-3-3 3h2.07A6 6 0 0 1 12 9a6 6 0 0 1-5.07 2.77", disabled:true },
];

export default function Sidebar({ active, onNavigate, username }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hovered, setHovered] = useState<string|null>(null);

  const initials = username.split(/[@._-]/).map(p=>p[0]).filter(Boolean).slice(0,2).join("").toUpperCase() || "U";

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout().catch(()=>{});
    window.location.reload();
  };

  const W = collapsed ? 72 : 224;

  return (
    <aside style={{
      width: W, minHeight:"100vh", flexShrink:0,
      background:"rgba(255,255,255,0.68)",
      backdropFilter:"blur(24px) saturate(1.5)",
      WebkitBackdropFilter:"blur(24px) saturate(1.5)",
      borderRight:"1px solid rgba(255,255,255,0.85)",
      display:"flex", flexDirection:"column",
      boxShadow:"3px 0 32px rgba(13,47,58,0.06)",
      transition:"width 0.25s cubic-bezier(.22,.68,0,1.2)",
      position:"sticky", top:0, overflow:"hidden",
    }}>

      {/* Brand */}
      <div style={{ padding: collapsed?"18px 0":"24px 18px 20px", display:"flex", alignItems:"center", justifyContent: collapsed?"center":"space-between", borderBottom:"1px solid rgba(26,185,160,0.1)", minHeight:72 }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#1ab9a0,#2196c9)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(26,185,160,0.35)",flexShrink:0 }}>
              <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="12" width="5" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/>
                <rect x="8.5" y="7" width="5" height="13" rx="1.5" fill="rgba(255,255,255,0.7)"/>
                <rect x="15" y="3" width="5" height="17" rx="1.5" fill="rgba(255,255,255,0.95)"/>
                <path d="M3 9.5L8.5 6L14 8.5L20 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:800,color:"#0a2030",letterSpacing:"-0.3px",lineHeight:1.15 }}>Smart Expense</div>
              <div style={{ fontSize:10.5,fontWeight:600,color:"#7aabb8",letterSpacing:"0.2px" }}>Tracker</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#1ab9a0,#2196c9)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(26,185,160,0.35)" }}>
            <svg width="17" height="17" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="12" width="5" height="8" rx="1.5" fill="rgba(255,255,255,0.9)"/>
              <rect x="8.5" y="7" width="5" height="13" rx="1.5" fill="rgba(255,255,255,0.7)"/>
              <rect x="15" y="3" width="5" height="17" rx="1.5" fill="rgba(255,255,255,0.95)"/>
            </svg>
          </div>
        )}
        {!collapsed && (
          <button onClick={()=>setCollapsed(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,color:"#8aabb8",borderRadius:6,transition:"all 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.color="#1ab9a0")} onMouseLeave={e=>(e.currentTarget.style.color="#8aabb8")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        )}
        {collapsed && (
          <button onClick={()=>setCollapsed(false)} style={{ position:"absolute",top:20,right:-1,background:"rgba(255,255,255,0.95)",border:"1px solid rgba(26,185,160,0.2)",borderRadius:"0 8px 8px 0",cursor:"pointer",padding:"4px 3px",color:"#1ab9a0",boxShadow:"2px 0 8px rgba(26,185,160,0.12)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ flex:1, padding: collapsed?"12px 8px":"14px 10px" }}>
        {!collapsed && <div style={{ fontSize:10,fontWeight:700,color:"#a0bfc8",letterSpacing:"0.7px",padding:"0 8px",marginBottom:6 }}>MAIN MENU</div>}
        {NAV_MAIN.map(item => {
          const isActive = active === item.key;
          const isHov = hovered === item.key;
          return (
            <button key={item.key}
              onClick={()=>onNavigate(item.key)}
              onMouseEnter={()=>setHovered(item.key)}
              onMouseLeave={()=>setHovered(null)}
              title={collapsed ? item.label : undefined}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding: collapsed?"10px":"10px 12px",
                justifyContent: collapsed?"center":"flex-start",
                borderRadius:10, border:"none", cursor:"pointer", marginBottom:2,
                background: isActive ? "linear-gradient(90deg,rgba(26,185,160,0.16),rgba(33,150,201,0.1))" : isHov ? "rgba(26,185,160,0.07)" : "transparent",
                color: isActive ? "#0d8c76" : isHov ? "#1ab9a0" : "#4a7080",
                fontWeight: isActive ? 700 : 500, fontSize:13.5,
                borderLeft: !collapsed && isActive ? "3px solid #1ab9a0" : "3px solid transparent",
                transition:"all 0.15s", position:"relative",
                boxShadow: isActive ? "inset 0 0 0 1px rgba(26,185,160,0.15)" : "none",
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive?2.5:2} strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon}/>
              </svg>
              {!collapsed && <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
              {isActive && !collapsed && <span style={{ marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#1ab9a0",boxShadow:"0 0 8px rgba(26,185,160,0.6)" }}/>}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ height:1,background:"rgba(26,185,160,0.1)",margin:"12px 4px" }}/>
        {!collapsed && <div style={{ fontSize:10,fontWeight:700,color:"#a0bfc8",letterSpacing:"0.7px",padding:"0 8px",marginBottom:6 }}>COMING SOON</div>}

        {NAV_SECONDARY.map(item => (
          <button key={item.key}
            disabled title={collapsed ? item.label : undefined}
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding: collapsed?"10px":"10px 12px",
              justifyContent: collapsed?"center":"flex-start",
              borderRadius:10, border:"none", cursor:"not-allowed", marginBottom:2,
              background:"transparent", color:"#b0cdd8", fontWeight:500, fontSize:13.5,
              borderLeft:"3px solid transparent", opacity:0.6,
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon}/>
            </svg>
            {!collapsed && <><span>{item.label}</span><span style={{ marginLeft:"auto",fontSize:9,fontWeight:700,color:"#8aabb8",background:"rgba(138,171,184,0.15)",borderRadius:4,padding:"1px 5px" }}>SOON</span></>}
          </button>
        ))}
      </nav>

      {/* Bottom — sign out only, no user info */}
      <div style={{ padding: collapsed?"12px 8px":"12px 10px", borderTop:"1px solid rgba(26,185,160,0.1)" }}>
        <button onClick={handleLogout} disabled={loggingOut}
          title={collapsed?"Sign out":undefined}
          style={{
            width:"100%", padding: collapsed?"10px":"9px 12px",
            borderRadius:9, border:"1px solid rgba(239,68,68,0.18)",
            background:"rgba(239,68,68,0.05)", color:"#e05454",
            fontSize:13, fontWeight:600, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            transition:"all 0.15s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.1)";e.currentTarget.style.borderColor="rgba(239,68,68,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.05)";e.currentTarget.style.borderColor="rgba(239,68,68,0.18)";}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && (loggingOut ? "Signing out…" : "Sign out")}
        </button>
      </div>
    </aside>
  );
}
