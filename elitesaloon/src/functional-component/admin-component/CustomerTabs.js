import React, { useState } from "react";
import CustomerList from "./CustomerList";
import DeactiveCustomerList from "./DeactiveCustomerList";

const CustomerTabs = () => {
  const [tab, setTab] = useState("active");

  return (
    <div className="ad-content">

      {/* ✅ TAB UI (existing design jaisa) */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px"
        }}
      >
        {/* ACTIVE TAB */}
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
          Active Customers
        </button>

        {/* DEACTIVE TAB */}
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
          Deactive Customers
        </button>
      </div>

      {/* ✅ SWITCH */}
      {tab === "active" && <CustomerList />}
      {tab === "deactive" && <DeactiveCustomerList />}

    </div>
  );
};

export default CustomerTabs;