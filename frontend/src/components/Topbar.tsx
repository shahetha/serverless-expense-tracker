import React, { useState, useEffect } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { usingDevAuth, getDevUserSub, logout } from "../lib/auth";

interface TopbarProps {
  title: string;
  month: string;
  onMonthChange: (m: string) => void;
}

export default function Topbar({ title, month, onMonthChange }: TopbarProps) {
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        if (usingDevAuth()) {
          setUsername(getDevUserSub() || "user");
        } else {
          const user = await getCurrentUser();
          setUsername(user.signInDetails?.loginId || user.username || "user");
        }
      } catch {
        setUsername("user");
      }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const initials = username
    .split(/[@._-]/)
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <header style={{
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.8)",
      position: "sticky",
      top: 0,
      zIndex: 10,
      boxShadow: "0 1px 16px rgba(30,120,110,0.06)",
    }}>

      {/* Left — title + month picker */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1 style={{
          fontSize: 18, fontWeight: 800, color: "#0d2f3a",
          letterSpacing: "-0.4px", margin: 0,
        }}>
          {title}
        </h1>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(26,185,160,0.08)", borderRadius: 8,
          padding: "5px 10px", border: "1px solid rgba(26,185,160,0.18)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#1ab9a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <input
            type="month"
            value={month}
            onChange={e => onMonthChange(e.target.value)}
            style={{
              border: "none", background: "transparent",
              fontSize: 13, fontWeight: 600, color: "#0d6e5a",
              outline: "none", cursor: "pointer",
            }}
          />
        </div>
      </div>

      {/* Right — user avatar + dropdown */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(26,185,160,0.2)",
            borderRadius: 12, padding: "6px 14px 6px 8px",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(30,120,110,0.06)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,120,110,0.12)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(30,120,110,0.06)")}
        >
          {/* Avatar circle */}
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg,#1ab9a0,#2196c9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {initials}
          </div>

          {/* Username */}
          <span style={{
            fontSize: 13, fontWeight: 600, color: "#0d2f3a",
            maxWidth: 140, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {username}
          </span>

          {/* Chevron */}
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#7a9aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.85)",
            borderRadius: 14, padding: "8px",
            boxShadow: "0 8px 32px rgba(30,120,110,0.14)",
            minWidth: 200, zIndex: 100,
          }}>

            {/* User info */}
            <div style={{
              padding: "10px 12px 12px",
              borderBottom: "1px solid rgba(26,185,160,0.1)",
              marginBottom: 6,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg,#1ab9a0,#2196c9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: "#0d2f3a",
                    maxWidth: 140, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {username}
                  </div>
                  <div style={{ fontSize: 11, color: "#7a9aaa", marginTop: 1 }}>
                    {usingDevAuth() ? "Dev mode" : "Signed in"}
                  </div>
                </div>
              </div>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{
                width: "100%", padding: "9px 12px",
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent",
                border: "none", borderRadius: 8,
                color: "#e05454", fontSize: 13, fontWeight: 600,
                cursor: signingOut ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        )}

        {/* Click outside to close */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
          />
        )}
      </div>
    </header>
  );
}
