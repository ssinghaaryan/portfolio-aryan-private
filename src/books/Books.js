import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../Firebase";
import { Plus, Search, X } from "lucide-react";
import { useData } from "../context/DataContext";
import "./Books.css";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Philosophy",
  "Science",
  "History",
  "Biography",
  "Self-Help",
  "Psychology",
  "Technology",
  "Business",
  "Poetry",
  "Classic",
  "Mystery",
  "Fantasy",
  "Science Fiction",
];

export default function Books() {
  const { booksData, setBooksData } = useData();
  const [books, setBooks] = useState(booksData || []);
  const [loading, setLoading] = useState(!booksData);
  const [showSearch, setShowSearch] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add form state
  const [addCategory, setAddCategory] = useState("Fiction");
  const [addNote, setAddNote] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);

  // Edit state
  const [editNote, setEditNote] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setBooks(data);
    setBooksData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!booksData) loadBooks();
  }, []);

  const searchBooks = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/search?mode=books&q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (book) => {
    setSelectedResult(book);
    setAddCategory("Fiction");
    setAddNote("");
  };

  const handleAdd = async () => {
    if (!selectedResult) return;
    setAdding(true);
    try {
      await addDoc(collection(db, "books"), {
        googleId: selectedResult.googleId,
        title: selectedResult.title,
        author: selectedResult.author,
        year: selectedResult.year,
        coverUrl: selectedResult.coverUrl,
        category: addCategory,
        note: addNote.trim(),
        createdAt: Date.now()
      });
      setShowSearch(false);
      setSearchTerm("");
      setSearchResults([]);
      setSelectedResult(null);
      loadBooks();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "books", id));
    setShowDetail(false);
    setSelectedBook(null);
    loadBooks();
  };

  const handleUpdate = async () => {
    if (!selectedBook) return;
    await updateDoc(doc(db, "books", selectedBook.id), {
      note: editNote.trim(),
      category: editCategory
    });
    setIsEditing(false);
    const updated = { ...selectedBook, note: editNote, category: editCategory };
    setSelectedBook(updated);
    loadBooks();
  };

  const openDetail = (book) => {
    setSelectedBook(book);
    setEditNote(book.note || "");
    setEditCategory(book.category || "Fiction");
    setIsEditing(false);
    setShowDetail(true);
  };

  const allCategories = ["All", ...CATEGORIES];
  const filteredBooks = categoryFilter === "All"
    ? books
    : books.filter(b => b.category === categoryFilter);

  return (
    <div className="books-container">
      <div className="books-header">
        <h2 className="books-title">Books</h2>
        <button className="books-add-btn" onClick={() => setShowSearch(true)}>
          <Plus size={20} />
        </button>
      </div>

      {/* Category filters */}
      <div className="books-filters">
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`books-filter-pill ${categoryFilter === cat ? "active" : ""}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="books-loading">
          <div className="books-spinner" />
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card" onClick={() => openDetail(book)}>
              <div className="book-cover-wrap">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="book-cover" />
                ) : (
                  <div className="book-cover-placeholder">
                    <span>{book.title?.[0]}</span>
                  </div>
                )}
                {book.category && (
                  <span className="book-category-badge">{book.category}</span>
                )}
              </div>
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && !loading && (
            <div className="books-empty">No books yet. Add one →</div>
          )}
        </div>
      )}

      {/* Search overlay */}
      {showSearch && (
        <div className="books-overlay" onClick={() => { setShowSearch(false); setSelectedResult(null); setSearchResults([]); setSearchTerm(""); }}>
          <div className="books-sheet" onClick={e => e.stopPropagation()}>
            <div className="books-sheet-handle" />

            {!selectedResult ? (
              <>
                <h3 className="books-sheet-title">Find a Book</h3>
                <div className="books-search-row">
                  <input
                    className="books-search-input"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && searchBooks()}
                    autoFocus
                  />
                  <button className="books-search-btn" onClick={searchBooks}>
                    <Search size={18} />
                  </button>
                </div>

                <div className="books-results">
                  {searching && <div className="books-searching">Searching...</div>}
                  {searchResults.map(book => (
                    <div
                      key={book.googleId}
                      className="books-result-row"
                      onClick={() => handleSelectResult(book)}
                    >
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="books-result-cover" />
                      ) : (
                        <div className="books-result-cover-placeholder">{book.title?.[0]}</div>
                      )}
                      <div className="books-result-info">
                        <div className="books-result-title">{book.title}</div>
                        <div className="books-result-author">{book.author} {book.year && `· ${book.year}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="books-confirm-header">
                  <button className="books-back-btn" onClick={() => setSelectedResult(null)}>← Back</button>
                  <h3 className="books-sheet-title">Add to Collection</h3>
                </div>

                <div className="books-confirm-book">
                  {selectedResult.coverUrl ? (
                    <img src={selectedResult.coverUrl} alt={selectedResult.title} className="books-confirm-cover" />
                  ) : (
                    <div className="books-confirm-cover-placeholder">{selectedResult.title?.[0]}</div>
                  )}
                  <div>
                    <div className="books-confirm-title">{selectedResult.title}</div>
                    <div className="books-confirm-author">{selectedResult.author} {selectedResult.year && `· ${selectedResult.year}`}</div>
                  </div>
                </div>

                <div className="books-form-label">Category</div>
                <div className="books-category-select">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`books-cat-btn ${addCategory === cat ? "active" : ""}`}
                      onClick={() => setAddCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="books-form-label">Note (optional)</div>
                <textarea
                  className="books-note-input"
                  placeholder="Why do you want to read this?"
                  value={addNote}
                  onChange={e => setAddNote(e.target.value)}
                  rows={3}
                />

                <div className="books-confirm-actions">
                  <button className="books-cancel-btn" onClick={() => setSelectedResult(null)}>Cancel</button>
                  <button className="books-save-btn" onClick={handleAdd} disabled={adding}>
                    {adding ? "Adding..." : "Add to Collection"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detail overlay */}
      {showDetail && selectedBook && (
        <div className="books-overlay" onClick={() => { setShowDetail(false); setIsEditing(false); }}>
          <div className="books-detail" onClick={e => e.stopPropagation()}>
            <button className="books-detail-close" onClick={() => { setShowDetail(false); setIsEditing(false); }}>
              <X size={16} />
            </button>

            <div className="books-detail-top">
              {selectedBook.coverUrl ? (
                <img src={selectedBook.coverUrl} alt={selectedBook.title} className="books-detail-cover" />
              ) : (
                <div className="books-detail-cover-placeholder">{selectedBook.title?.[0]}</div>
              )}
              <div className="books-detail-meta">
                <div className="books-detail-title">{selectedBook.title}</div>
                <div className="books-detail-author">{selectedBook.author}</div>
                {selectedBook.year && <div className="books-detail-year">{selectedBook.year}</div>}
              </div>
            </div>

            {isEditing ? (
              <>
                <div className="books-form-label">Category</div>
                <div className="books-category-select">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`books-cat-btn ${editCategory === cat ? "active" : ""}`}
                      onClick={() => setEditCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="books-form-label">Note</div>
                <textarea
                  className="books-note-input"
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="books-confirm-actions">
                  <button className="books-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="books-save-btn" onClick={handleUpdate}>Save</button>
                </div>
              </>
            ) : (
              <>
                <div className="books-detail-category">{selectedBook.category}</div>
                {selectedBook.note && (
                  <div className="books-detail-note">{selectedBook.note}</div>
                )}
                <div className="books-detail-actions">
                  <button className="books-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="books-delete-btn" onClick={() => handleDelete(selectedBook.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}