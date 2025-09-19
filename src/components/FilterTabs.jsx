import React from "react";

function FilterTabs({ filter, setFilter }) {
  return (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item">
        <button
          className={`nav-link ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          TẤT CẢ
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          ĐÃ HOÀN THÀNH
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          CHƯA HOÀN THÀNH
        </button>
      </li>
    </ul>
  );
}

export default FilterTabs;
