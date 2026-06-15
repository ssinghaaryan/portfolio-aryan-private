import React, { useState } from "react";
import "./IdeaCard.css";
import { Trash2, ChevronDown, ChevronUp, Pencil, Check, X, CheckSquare2, Lightbulb } from "lucide-react";

const PRIORITY_COLORS = {
  high: "#ff4d4d",
  medium: "#f5a623",
  low: "#4cd964"
};

const TYPE_ICONS = {
  idea: <Lightbulb size={15} />,
  task: <CheckSquare2 size={15} />
};

export default function IdeaCard({ item, onComplete, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDetails, setEditDetails] = useState(item.details || "");
  const [editPriority, setEditPriority] = useState(item.priority);
  const [editType, setEditType] = useState(item.type);

  const handleConfirmEdit = () => {
    if (!editTitle.trim()) return;
    onEdit(item.id, {
      title: editTitle.trim(),
      details: editDetails.trim(),
      priority: editPriority,
      type: editType
    });
    setIsEditing(false);
    setExpanded(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(item.title);
    setEditDetails(item.details || "");
    setEditPriority(item.priority);
    setEditType(item.type);
    setIsEditing(false);
  };

  return (
    <div className={`idea-row ${item.status === "completed" ? "completed" : ""} ${isEditing ? "editing" : ""}`}>

      {!isEditing && (
  <div className="idea-left">
    <button
      className={`idea-tick ${item.status === "completed" ? "ticked" : ""}`}
      onClick={() => onComplete(item)}
    >
      {item.status === "completed" ? "✓" : ""}
    </button>
    {item.status === "active" && (
      <button
        className="idea-edit-btn"
        onClick={() => setIsEditing(true)}
      >
        <Pencil size={15} />
      </button>
    )}
    {item.status === "completed" && (
      <button
        className="idea-delete"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 size={13} />
      </button>
    )}
  </div>
)}

      <div className="idea-content">
        {isEditing ? (
          <>
            <input
              className="idea-edit-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              autoFocus
            />
            <div className="idea-edit-toggles">
              <button
                className={`idea-edit-toggle ${editType === "task" ? "active-task" : ""}`}
                onClick={() => setEditType("task")}
              >
                <CheckSquare2 size={13} /> Task
              </button>
              <button
                className={`idea-edit-toggle ${editType === "idea" ? "active-idea" : ""}`}
                onClick={() => setEditType("idea")}
              >
                <Lightbulb size={13} /> Idea
              </button>
            </div>
            <div className="idea-edit-priorities">
              {["low", "medium", "high"].map(p => (
                <button
                  key={p}
                  className={`idea-edit-priority ${editPriority === p ? "active" : ""}`}
                  style={editPriority === p ? { color: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] } : {}}
                  onClick={() => setEditPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <textarea
              className="idea-edit-textarea"
              value={editDetails}
              onChange={e => setEditDetails(e.target.value)}
              placeholder="Details (optional)"
              rows={3}
            />
            <div className="idea-edit-actions">
              <button className="idea-edit-cancel" onClick={handleCancelEdit}>
                <X size={14} /> Cancel
              </button>
              <button className="idea-edit-confirm" onClick={handleConfirmEdit}>
                <Check size={14} /> Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="idea-top">
              <span className="idea-title">{item.title}</span>
              <div className="idea-badges">
  <span
    className="idea-priority"
    style={{ color: PRIORITY_COLORS[item.priority] }}
  >
    {item.priority}
  </span>
  <span
    className="idea-type"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: item.type === "task"
        ? "rgba(0, 122, 255, 0.12)"
        : "rgba(255, 166, 0, 0.12)",
      color: item.type === "task" ? "#4a9eff" : "#ffaa00"
    }}
  >
    {TYPE_ICONS[item.type]} {item.type}
  </span>
</div>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}