import React from "react";

const StatusTracker = ({ status, onUpdate, timestamp, disabled, showDropdown = true }) => {
  const statuses = ["in progress", "completed"]; 

  let className = "status-pill ";
  if (status === "pending") className += "status-pending";
  else if (status === "in progress") className += "status-inprogress";
  else className += "status-completed";

  return (
    <div style={{ margin: "16px 0" }}>
      {status === "pending" && !showDropdown ? (
        <span className={className}>
          {status}
        </span>
      ) : (
        showDropdown && (
          <>
            <select
              value={status}
              onChange={e => onUpdate(e.target.value)}
              disabled={disabled}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className={className} style={{ marginLeft: 8 }}>
              {status}
            </span>
          </>
        )
      )}
      {timestamp && status === "completed" && (
        <span style={{ marginLeft: 12, color: '#8ba063', fontSize: 13 }}>
          Completed: {timestamp}
        </span>
      )}
    </div>
  );
};

export default StatusTracker;
