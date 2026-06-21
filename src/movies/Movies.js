import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../Firebase";
import MovieCard from "./MovieCard";
import AddMovie from "./AddMovie";
import { Plus } from "lucide-react";
import { useData } from "../context/DataContext";
import "./Movies.css";

export default function Movies() {
  const { moviesData, setMoviesData } = useData();
  const [items, setItems] = useState(moviesData || []);
  const [loading, setLoading] = useState(!moviesData);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setItems(data);
    setMoviesData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!moviesData) {
      loadItems();
    }
  }, []);

  const handleAdd = async (movie) => {
    await addDoc(collection(db, "movies"), {
      ...movie,
      createdAt: Date.now()
    });
    setShowAddModal(false);
    loadItems();
  };

  const handleUpdate = async (id, updates) => {
    await updateDoc(doc(db, "movies", id), updates);
    loadItems();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "movies", id));
    loadItems();
  };

  const handleMoveToWatched = async (item) => {
    await handleUpdate(item.id, { status: "watched" });
  };

  const filteredItems = items.filter(item => {
    const typeMatch = typeFilter === "all" || item.type === typeFilter;
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h2 className="movies-title">Movies & TV</h2>
      </div>

      {/* Type filter */}
      <div className="movies-filters">
        <button
          className={`movies-filter-pill ${typeFilter === "all" ? "active" : ""}`}
          onClick={() => setTypeFilter("all")}
        >
          All
        </button>
        <button
          className={`movies-filter-pill ${typeFilter === "movie" ? "active" : ""}`}
          onClick={() => setTypeFilter("movie")}
        >
          Movies
        </button>
        <button
          className={`movies-filter-pill ${typeFilter === "tv" ? "active" : ""}`}
          onClick={() => setTypeFilter("tv")}
        >
          TV Series
        </button>
      </div>

      {/* Status filter */}
      <div className="movies-status-tabs">
        <button
          className={`movies-status-tab ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          className={`movies-status-tab ${statusFilter === "watched" ? "active" : ""}`}
          onClick={() => setStatusFilter("watched")}
        >
          Watched
        </button>
        <button
          className={`movies-status-tab ${statusFilter === "plan_to_watch" ? "active" : ""}`}
          onClick={() => setStatusFilter("plan_to_watch")}
        >
          Plan to Watch
        </button>
      </div>

      {/* Grid */}
      <div className="movies-grid">
        {filteredItems.map(item => (
          <MovieCard
            key={item.id}
            item={item}
            onMoveToWatched={handleMoveToWatched}
            onEdit={(item) => setEditingItem(item)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="movies-empty">No entries yet. Add one ↓</div>
      )}

      {/* FAB */}
      <button className="movies-fab" onClick={() => setShowAddModal(true)}>
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <AddMovie
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <AddMovie
          editMode
          existingItem={editingItem}
          onSave={(updates) => {
            handleUpdate(editingItem.id, updates);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}