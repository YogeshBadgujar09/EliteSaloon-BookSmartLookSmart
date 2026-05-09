import React, { useState } from "react";
import OwnerList from "./OwnerList";
import DeactiveOwnerList from "./DeactiveOwnerList";

const OwnerTabs = () => {
  const [tab, setTab] = useState("active");

  return (
    <div className="ad-content">

      {/* ✅ SAME TAB UI (customer jaisa hi) */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px"
        }}
      >
        {/* ACTIVE OWNERS */}
        <button
          className="btn-view"
          style={{
            background:
              tab === "active"
                ? "var(--gradient-gold)"
                : "rgba(212,175,55,0.12)",
            color: tab === "active" ? "#fff" : "var(--primary-gold)",
            border:
              tab === "active"
                ? "none"
                : "1px solid rgba(212,175,55,0.4)"
          }}
          onClick={() => setTab("active")}
        >
          Active Owners
        </button>

        {/* DEACTIVE OWNERS */}
        <button
          className="btn-view"
          style={{
            background:
              tab === "deactive"
                ? "var(--gradient-gold)"
                : "rgba(212,175,55,0.12)",
            color: tab === "deactive" ? "#fff" : "var(--primary-gold)",
            border:
              tab === "deactive"
                ? "none"
                : "1px solid rgba(212,175,55,0.4)"
          }}
          onClick={() => setTab("deactive")}
        >
          Deactive Owners
        </button>
      </div>

      {/* ✅ SWITCH */}
      {tab === "active" && <OwnerList />}
      {tab === "deactive" && <DeactiveOwnerList />}

    </div>
  );
};

export default OwnerTabs;   