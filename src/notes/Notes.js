import React, { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import Masonry from "react-masonry-css";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { PencilLine } from "lucide-react";
import { FilePenLine } from "lucide-react";
import Header from "../components/Header/header";
import "./Notes.css";

export default function Notes() {

  const [notes, setNotes] = useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [noteText, setNoteText] =
    useState("");

  const [author, setAuthor] =
    useState("");

  const [selectedNote, setSelectedNote] = useState(null);
const [showNoteViewer, setShowNoteViewer] = useState(false);

  const loadNotes = async () => {

    const snapshot =
      await getDocs(
        collection(db, "notes")
      );

    const data =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    setNotes(data);
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
        favorite: false,
        createdAt: Date.now()
      }
    );

    setNoteText("");
    setAuthor("");

    setShowModal(false);

    loadNotes();
  };

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
  {notes.map((note) => (
  <NoteCard
    key={note.id}
    note={note}
    onClick={() => {
      setSelectedNote(note);
      setShowNoteViewer(true);
    }}
  />
))}
</Masonry>

<button
  className="add-note-fab"
  onClick={() => setShowModal(true)}
>
  <FilePenLine size={22} />
</button>

{showNoteViewer && selectedNote && (

  <div
    className="library-overlay"
    onClick={() =>
      setShowNoteViewer(false)
    }
  >

    <div
      className="note-viewer-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <button
        className="library-close"
        onClick={() =>
          setShowNoteViewer(false)
        }
      >
        ✕
      </button>

      <div className="note-viewer-text">
        {selectedNote.text}
      </div>

      <div className="note-viewer-author">
        — {selectedNote.author}
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
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>

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
        onClick={saveNote}
      >
        Save Note
      </button>
    </div>
  </div>
)}
    </div>
  );
}