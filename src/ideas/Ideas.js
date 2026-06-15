import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../Firebase";
import IdeaCard from "./IdeaCard";
import AddIdea from "./AddIdea";
import { Plus } from "lucide-react";
import "./Ideas.css";
import IdeasSkeleton from "../components/Skeleton/IdeasSkeleton";
import { useData } from "../context/DataContext";

export default function Ideas() {
  const { ideasData, setIdeasData } = useData();
  const [items, setItems] = useState(ideasData || []);
  const [activeTab, setActiveTab] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(!ideasData);

  const loadItems = async () => {
  setLoading(true);
  const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  setItems(data);
  setIdeasData(data); // 👈 save to context
  setLoading(false);
};

useEffect(() => {
  if (!ideasData) {
    loadItems();
  }
}, []);

  const handleAdd = async (item) => {
    await addDoc(collection(db, "ideas"), {
      ...item,
      status: "active",
      createdAt: Date.now()
    });
    setShowModal(false);
    loadItems();
  };

  const handleComplete = async (item) => {
    await updateDoc(doc(db, "ideas", item.id), {
      status: item.status === "active" ? "completed" : "active"
    });
    loadItems();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "ideas", id));
    loadItems();
  };

  const handleEdit = async (id, updates) => {
  await updateDoc(doc(db, "ideas", id), updates);
  const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
  setItems(updated);
  setIdeasData(updated);
};

  const active = items.filter(i => i.status === "active");
  const completed = items.filter(i => i.status === "completed");
  const displayed = activeTab === "active" ? active : completed;

  return (
    <div className="ideas-container">
      <div className="ideas-header">
        <h2 className="ideas-title">Ideas & Tasks</h2>
      </div>

      {/* Tabs */}
      <div className="ideas-tabs">
        <button
          className={`ideas-tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active <span className="tab-count">{active.length}</span>
        </button>
        <button
          className={`ideas-tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed <span className="tab-count">{completed.length}</span>
        </button>
      </div>

      {/* List */}
      <div className="ideas-list">
  {loading ? (
    <IdeasSkeleton count={6} />
  ) : (
    <>
      {displayed.length === 0 && (
        <div className="ideas-empty">
          {activeTab === "active" ? "No active items. Add one ↓" : "Nothing completed yet."}
        </div>
      )}
      {displayed.map(item => (
        <IdeaCard
          key={item.id}
          item={item}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </>
  )}
</div>

      {/* FAB */}
      <button className="ideas-fab" onClick={() => setShowModal(true)}>
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      {showModal && (
        <AddIdea
          onSave={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}