import React, { useState } from "react";
import "./AddIdea.css";
import { CheckSquare2, Lightbulb } from "lucide-react";

export default function AddIdea({ onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("task");
  const [priority, setPriority] = useState("medium");
  const [details, setDetails] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), type, priority, details: details.trim() });
  };

  return (
    <div className="add-idea-overlay" onClick={onClose}>
      <div className="add-idea-sheet" onClick={e => e.stopPropagation()}>

        <div className="add-idea-handle" />

        <h3 className="add-idea-heading">
  {type === "idea" 
    ? <> New Idea <Lightbulb size={18} style={{ verticalAlign: "top" }} /></>
    : <> New Task <CheckSquare2 size={18} style={{ verticalAlign: "top" }} /></>
  }
</h3>

        {/* Type toggle */}
        <div className="add-idea-toggle">
        <button
  className={`toggle-btn ${type === "task" ? "active" : ""}`}
  onClick={() => setType("task")}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    ...(type === "task" ? {
      background: "rgba(0, 122, 255, 0.12)",
      borderColor: "#4a9eff",
      color: "#4a9eff"
    } : {})
  }}
>
  <CheckSquare2 size={15} /> Task
</button>
<button
  className={`toggle-btn ${type === "idea" ? "active" : ""}`}
  onClick={() => setType("idea")}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    ...(type === "idea" ? {
      background: "rgba(255, 166, 0, 0.12)",
      borderColor: "#ffaa00",
      color: "#ffaa00"
    } : {})
  }}
>
  <Lightbulb size={15} /> Idea
</button>
        </div>

        {/* Title */}
        <input
          className="add-idea-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />

        {/* Priority */}
        <div className="add-idea-priority">
          {["low", "medium", "high"].map(p => (
            <button
              key={p}
              className={`priority-btn priority-${p} ${priority === p ? "active" : ""}`}
              onClick={() => setPriority(p)}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Details */}
        <textarea
          className="add-idea-textarea"
          placeholder="Details (optional)"
          value={details}
          onChange={e => setDetails(e.target.value)}
          rows={3}
        />

        {/* Actions */}
        <div className="add-idea-actions">
          <button className="add-idea-cancel" onClick={onClose}>Cancel</button>
          <button className="add-idea-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}