import React, { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import Masonry from "react-masonry-css";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../Firebase";
import { PencilLine } from "lucide-react";
import { FilePenLine, Dice5 } from "lucide-react";
import "./Notes.css";
import NotesSkeleton from "../components/Skeleton/NotesSkeleton";

export default function Notes() {

  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteViewer, setShowNoteViewer] = useState(false);
  const [category, setCategory] = useState("Quotes");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showNoteMenu, setShowNoteMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
  "All",
  "Quotes",
  "Books",
  "Ideas",
  "Notes",
];

  const loadNotes = async () => {

    // Right now this fetches all notes at once.. eventually update it to fetch say 10-20 at once then load more.
    setLoading(true);
    const notesQuery = query(
  collection(db, "notes"),
  orderBy(
    "createdAt",
    "desc"
  )
);

const snapshot =
  await getDocs(notesQuery);

    const data =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNote = async () => {

    if (!noteText.trim()) return;

    await addDoc(
  collection(db, "notes"),
  {
    text: noteText,
    author,
    category,
    createdAt: Date.now()
  }
);

    setNoteText("");
    setAuthor("");
    setCategory("Quotes");
    setIsEditing(false);

    setShowModal(false);
    loadNotes();
  };

  const deleteNote = async () => {

  if (!selectedNote) return;

  await deleteDoc(
    doc(
      db,
      "notes",
      selectedNote.id
    )
  );
setSelectedNote(null);
setShowNoteViewer(false);

loadNotes();
};

const updateNote = async () => {

  if (!selectedNote) return;

  await updateDoc(
    doc(
      db,
      "notes",
      selectedNote.id
    ),
    {
      text: noteText,
      author,
      category
    }
  );

  setShowModal(false);

  setIsEditing(false);

  loadNotes();
};

const openRandomNote = () => {

  if (!notes.length) return;

  const randomNote =
    notes[
      Math.floor(
        Math.random() * notes.length
      )
    ];

  setSelectedNote(randomNote);

  setShowNoteViewer(true);

  setShowNoteMenu(false);
};

  const filteredNotes =
  notes.filter((note) => {

    const categoryMatch =
      activeCategory === "All"
      ||
      note.category === activeCategory;

    const searchMatch =

      note.text
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

      ||

      note.author
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    return (
      categoryMatch &&
      searchMatch
    );

  });

  return (
    <div>

      <div className="notes-header">

  <h2 className="notes-title">
    Notes
  </h2>
{/* 
  <button
    className="add-note-btn"
    onClick={() => setShowModal(true)}
  >
    + Add Note
  </button> */}

</div>

<div className="category-filters">

  {categories.map((cat) => (

    <button
      key={cat}
      className={
        activeCategory === cat
          ? "filter-pill active"
          : "filter-pill"
      }
      onClick={() => {
  setActiveCategory(cat);
  setVisibleCount(10);
}}
    >
      {cat}
    </button>

  ))}

</div>

<div className="notes-search">

  <input
    type="text"
    placeholder="Search notes..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />

</div>

    {loading ? (
  <div style={{ display: "flex", gap: 16, padding: "0 16px" }}>
    <div style={{ flex: 1 }}><NotesSkeleton count={3} /></div>
    <div style={{ flex: 1 }}><NotesSkeleton count={3} /></div>
  </div>
) : (
      <Masonry
  breakpointCols={{
  default: 4,
  1400: 3,
  900: 2,
  600: 2
}}
  className="notes-grid"
  columnClassName="notes-column"
>
  {filteredNotes
  .slice(0, visibleCount)
  .map((note) => (
  <NoteCard
    key={note.id}
    note={note}
    onClick={() => {
      setSelectedNote(note);
      setShowNoteViewer(true);
      setShowNoteMenu(false);
    }}
  />
))}
</Masonry>
)}

{visibleCount < filteredNotes.length && (

  <button
    className="load-more-notes"
    onClick={() =>
      setVisibleCount(
        prev => prev + 10
      )
    }
  >
    Load More
  </button>

)}

{filteredNotes.length === 0 && (

  <div className="empty-state">

    No notes found.

  </div>

)}

<button
  className="random-note-fab"
  onClick={openRandomNote}
>
  <Dice5 size={20} />
</button>

<button
  className="add-note-fab"
  onClick={() => {
    setIsEditing(false);
    setNoteText("");
    setAuthor("");
    setCategory("Quotes");
    setShowModal(true);
  }}
>
  <FilePenLine size={22} />
</button>

<button
  className="add-note-fab"
  onClick={() => {
    setIsEditing(false);
    setNoteText("");
    setAuthor("");
    setCategory("Quotes");
    setShowModal(true);
  }}
>
  <FilePenLine size={22} />
</button>

{showNoteViewer && selectedNote && (

  <div
    className="library-overlay"
    onClick={() => {
      setShowNoteViewer(false);
      setShowNoteMenu(false);
    }}
  >

    <div
      className="note-viewer-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

    <button
  className="library-close"
  onClick={() => {
    setShowNoteViewer(false);
    setShowNoteMenu(false);
  }}
>
  ✕
</button>

      <button
        className="note-menu-btn"
        onClick={() =>
          setShowNoteMenu(
            !showNoteMenu
          )
        }
      >
        ⋯
      </button>

      {showNoteMenu && (

        <div className="note-menu">

          <button
  onClick={() => {

    setNoteText(
      selectedNote.text
    );

    setAuthor(
      selectedNote.author
    );

    setCategory(
      selectedNote.category
    );

    setIsEditing(true);

    setShowModal(true);

    setShowNoteViewer(false);

    setShowNoteMenu(false);
  }}
>
  Edit
</button>

          <button
  onClick={() => {
    setShowDeleteConfirm(true);
    setShowNoteMenu(false);
  }}
>
  Delete
</button>

        </div>

      )}

      <div className="note-viewer-text">
        {selectedNote.text}
      </div>

      <div className="note-viewer-category">
        {selectedNote.category}
      </div>

      <div className="note-viewer-author">
        — {selectedNote.author}
      </div>

    </div>

  </div>

)}

{showDeleteConfirm && (

  <div
    className="library-overlay"
    onClick={() =>
      setShowDeleteConfirm(false)
    }
  >

    <div
      className="delete-confirm-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <h3>
        Delete Note?
      </h3>

      <p>
        This action cannot be undone.
      </p>

      <div className="delete-actions">

        <button
          onClick={() =>
            setShowDeleteConfirm(false)
          }
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={() => {

            deleteNote();

            setShowDeleteConfirm(false);

          }}
        >
          Delete
        </button>

      </div>

    </div>

  </div>

)}

{showModal && (
  <div
    className="library-overlay"
    onClick={() => setShowModal(false)}
  >
    <div
      className="note-create-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
  className="library-close"
  onClick={() => {
    setShowModal(false);
  }}
>
  ✕
</button>
<h3>

  {isEditing
    ? "Edit Note"
    : "New Note"}

</h3>
      <select
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
>
  <option>Quotes</option>
  <option>Books</option>
  <option>Ideas</option>
  <option>Notes</option>
  <option>Principles</option>
</select>

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) =>
          setAuthor(e.target.value)
        }
      />

      <textarea
        placeholder="Write your note..."
        value={noteText}
        onChange={(e) =>
          setNoteText(e.target.value)
        }
      />

      <button
  className="save-note-btn"
  onClick={
    isEditing
      ? updateNote
      : saveNote
  }
>
  {isEditing
    ? "Update Note"
    : "Save Note"}
</button>
    </div>
  </div>
)}
    </div>
  );
}