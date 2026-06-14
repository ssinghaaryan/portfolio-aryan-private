import React, { useState } from "react";
import "./IdeaCard.css";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

const PRIORITY_COLORS = {
  high: "#ff4d4d",
  medium: "#f5a623",
  low: "#4cd964"
};

const TYPE_ICONS = {
  idea: "💡",
  task: "✅"
};

export default function IdeaCard({ item, onComplete, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className={`idea-row ${item.status === "completed" ? "completed" : ""}`}>

      {/* Tick button */}
      <button
        className={`idea-tick ${item.status === "completed" ? "ticked" : ""}`}
        onClick={() => onComplete(item)}
      >
        {item.status === "completed" ? "✓" : "○"}
      </button>

      {/* Main content */}
      <div className="idea-content">
        <div className="idea-top">
          <span className="idea-title">{item.title}</span>
          <div className="idea-badges">
            <span
              className="idea-priority"
              style={{ color: PRIORITY_COLORS[item.priority] }}
            >
              {item.priority}
            </span>
            <span className="idea-type">
              {TYPE_ICONS[item.type]} {item.type}
            </span>
          </div>
        </div>

        {/* Expandable details */}
        {item.details && (
          <>
            {expanded && (
              <div className="idea-details">{item.details}</div>
            )}
            <button
              className="idea-expand"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? <><ChevronUp size={14} /> hide</>
                : <><ChevronDown size={14} /> details</>
              }
            </button>
          </>
        )}
      </div>

      {/* Delete — only in completed tab */}
      {item.status === "completed" && (
        <button
          className="idea-delete"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}