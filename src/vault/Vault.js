import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  ChevronRight, ChevronDown, Star, Edit3, Eye, 
  Trash2, Save, Plus, FolderPlus, Search, Menu, X,
  FileText, Pencil
} from "lucide-react";
import GraphView from "../components/GraphView/GraphView";
import "./Vault.css";

export default function Vault() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [newNoteName, setNewNoteName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [backlinks, setBacklinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGraph,setShowGraph] = useState(false);
  const [graphCache, setGraphCache] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    loadNotes();
    loadFavorites();
    const savedRecent = localStorage.getItem("vault-recent");
    if (savedRecent) setRecentNotes(JSON.parse(savedRecent));
  }, []);

  useEffect(() => {

  const handleKeyDown =
    (e) => {

      const isMac =
        navigator.platform
          .toUpperCase()
          .includes("MAC");

      const cmd =
        isMac
          ? e.metaKey
          : e.ctrlKey;

      // Save

      if (
        cmd &&
        e.key === "s"
      ) {

        e.preventDefault();

        if (
          selectedNote &&
          editMode
        ) {

          saveNote();

        }

      }

      // Search

      if (
        cmd &&
        e.key === "k"
      ) {

        e.preventDefault();

        document
          .querySelector(
            ".vault-search"
          )
          ?.focus();

      }

      // Edit

      if (
        e.key === "e" &&
        selectedNote
      ) {

        setEditMode(
          prev => !prev
        );

      }

    };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

  };

}, [
  selectedNote,
  editMode,
  content
]);

useEffect(() => {

  if (
    notes.length
  ) {

    buildGraphCache();

  }

}, [notes]);

  const loadNotes = async () => {
    // const response = await fetch("/api/vault/tree");
    const response = await fetch("/api/vault/ops");
    const data = await response.json();
    if (!Array.isArray(data)) { setNotes([]); return; }
    setNotes(data);
    const validPaths =
  data.map(
    note => note.path
  );

const cleanedRecent =
  recentNotes.filter(
    path =>
      validPaths.includes(
        path
      )
  );

setRecentNotes(
  cleanedRecent
);

localStorage.setItem(
  "vault-recent",
  JSON.stringify(
    cleanedRecent
  )
);
    const folders = {};
    data.forEach(note => {
      const parts = note.path.split("/");
      if (parts.length > 2) folders[parts[1]] = true;
    });
    setExpandedFolders(folders);
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch("/api/vault/read?path=vault/System/Favorites.md");
      const data = await response.json();
      const matches = data.content.match(/\[\[(.*?)\]\]/g) || [];
      setFavorites(matches.map(link => link.replace(/\[\[|\]\]/g, "")));
    } catch { setFavorites([]); }
  };

  const loadNote = async (path) => {

  if (!path) {

    return;

  }

  const noteExists =
    notes.some(
      note =>
        note.path === path
    );

  if (!noteExists) {

    console.log(
      "Note no longer exists:",
      path
    );

    return;

  }

  const response =
    await fetch(
      `/api/vault/read?path=${path}`
    );

  const data =
    await response.json();

  setContent(
    data.content
  );

  setSelectedNote(path);

  setEditMode(false);

  setSidebarOpen(false);

  loadBacklinks(path);

  const updatedRecent = [

    path,

    ...recentNotes.filter(
      n => n !== path
    )

  ].slice(0, 8);

  setRecentNotes(
    updatedRecent
  );

  localStorage.setItem(
    "vault-recent",
    JSON.stringify(
      updatedRecent
    )
  );

};

  const saveNote = async () => {
    setSaving(true);
    await fetch("/api/vault/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: selectedNote, content })
    });
    setSaving(false);
    setEditMode(false);
  };

  const createNote = async () => {
    if (!newNoteName.trim()) return;
    await fetch("/api/vault/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: selectedFolder, noteName: newNoteName })
    });
    const newPath = `vault/${selectedFolder}/${newNoteName}.md`;
    await loadNotes();
    await loadNote(newPath);
    setEditMode(true);
    setShowCreateNote(false);
    setNewNoteName("");
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    await fetch("/api/vault/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName: newFolderName })
    });
    setShowCreateFolder(false);
    setNewFolderName("");
    loadNotes();
  };

  const deleteNote = async () => {
  if (!selectedNote) return;
  setShowDeleteConfirm(true);
};

  const confirmDelete = async () => {

  await fetch("/api/vault/ops", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json"
    },
    body: JSON.stringify({
      path: selectedNote
    })
  });

  const deletedNoteName =
    selectedNote
      .split("/")
      .pop()
      .replace(".md", "");

  const updatedFavorites =
    favorites.filter(
      fav =>
        fav !== deletedNoteName
    );

  setFavorites(
    updatedFavorites
  );

  const favContent =
    "# Favorites\n\n" +
    updatedFavorites
      .map(
        note =>
          `[[${note}]]`
      )
      .join("\n");

  await fetch(
    "/api/vault/ops",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        path:
          "vault/System/Favorites.md",
        content:
          favContent
      })
    }
  );

  const updatedRecent =
    recentNotes.filter(
      n =>
        n !== selectedNote
    );

  setRecentNotes(
    updatedRecent
  );

  localStorage.setItem(
    "vault-recent",
    JSON.stringify(
      updatedRecent
    )
  );

  setContent("");
  setSelectedNote(null);
  setShowDeleteConfirm(false);

  loadNotes();
};

  const renameNote = async () => {
    if (!selectedNote) return;
    await fetch("/api/vault/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename", oldPath: selectedNote, newName: renameValue })
    });
    const folder = selectedNote.substring(0, selectedNote.lastIndexOf("/"));
    setSelectedNote(`${folder}/${renameValue}.md`);
    setShowRename(false);
    loadNotes();
  };

  const toggleFavorite = async () => {
    if (!selectedNote) return;
    const noteName = selectedNote.split("/").pop().replace(".md", "");
    const updated = favorites.includes(noteName)
      ? favorites.filter(f => f !== noteName)
      : [...favorites, noteName];
    const favContent = "# Favorites\n\n" + updated.map(n => `[[${n}]]`).join("\n");
    await fetch("/api/vault/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", path: "vault/System/Favorites.md", content: favContent })
    });
    setFavorites(updated);
  };

  const isFavorite = () => {

  if (!selectedNote) {

    return false;

  }

  const noteName =
    selectedNote
      .split("/")
      .pop()
      .replace(".md", "");

  return favorites.includes(
    noteName
  );

};

  const loadBacklinks = async (notePath) => {
    const noteName = notePath.split("/").pop().replace(".md", "");
    const linked = [];
    for (const note of notes) {
      if (note.path === notePath) continue;
      try {
        const res = await fetch(`/api/vault/read?path=${note.path}`);
        const data = await res.json();
        if (data.content?.includes(`[[${noteName}]]`)) linked.push(note);
      } catch {}
    }
    setBacklinks(linked);
  };

  const searchNotes = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) { setSearchResults([]); return; }
    const results = [];
    for (const note of notes) {
      try {
        const res = await fetch(`/api/vault/read?path=${note.path}`);
        const data = await res.json();
        const fileName = note.path.split("/").pop().replace(".md", "");
        if (
          fileName.toLowerCase().includes(term.toLowerCase()) ||
          data.content?.toLowerCase().includes(term.toLowerCase())
        ) results.push(note);
      } catch {}
    }
    setSearchResults(results);
  };

  const openWikiLink = async (noteName) => {
    const target = notes.find(n => n.path.toLowerCase().endsWith(`${noteName.toLowerCase()}.md`));
    if (!target) {
      if (window.confirm(`"${noteName}" doesn't exist. Create it?`)) {
        await fetch("/api/vault/ops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: selectedFolder || "Personal", noteName })
        });
        await loadNotes();
        await loadNote(`vault/${selectedFolder || "Personal"}/${noteName}.md`);
        setEditMode(true);
      }
      return;
    }
    await loadNote(target.path);
  };

const buildTree = () => {

  const folders = {};

  if (!Array.isArray(notes))
    return folders;

  notes.forEach(note => {

    const parts =
      note.path.split("/");

    if (
      parts.length < 3
    ) return;

    const folder =
      parts[1];

    if (
      folder === "System"
    ) return;

    if (
      !folders[folder]
    ) {

      folders[folder] = [];

    }

    if (
      note.path.endsWith(
        ".gitkeep"
      )
    ) {

      return;

    }

    folders[folder].push(
      note
    );

  });

  return folders;

};

const buildGraphCache =
  async () => {

    const cache = {};

    for (
      const note of notes
    ) {

      try {

        const res =
          await fetch(

            `/api/vault/read?path=${note.path}`

          );

        const data =
          await res.json();

        const matches =
          [
            ...data.content.matchAll(
              /\[\[(.*?)\]\]/g
            )
          ].map(
            m => m[1]
          );

        cache[
          note.path
        ] = matches;

      }

      catch {}

    }

    setGraphCache(
      cache
    );

  };

const buildGraphData = () => {

  const nodes = [];
  const links = [];

  const connectionCount = {};

  notes.forEach(note => {

    const noteName =
      note.path
        .split("/")
        .pop()
        .replace(".md", "");

    connectionCount[noteName] = 0;

    nodes.push({
      id: noteName,
      path: note.path
    });

  });

  notes.forEach(note => {

    const noteName =
      note.path
        .split("/")
        .pop()
        .replace(".md", "");

    const matches =
      graphCache[note.path] || [];

    matches.forEach(target => {

      links.push({
        source: noteName,
        target
      });

      connectionCount[noteName] =
        (connectionCount[noteName] || 0) + 1;

      connectionCount[target] =
        (connectionCount[target] || 0) + 1;

    });

  });

  nodes.forEach(node => {

    node.connections =
      connectionCount[node.id] || 0;

  });

  return {
    nodes,
    links
  };

};

  const renderContent = () => {
    const parts = content.split(/(\[\[.*?\]\])/);
    return parts.map((part, index) => {
      const match = part.match(/^\[\[(.*?)\]\]$/);
      if (match) {
        return (
          <button key={index} className="wiki-link" onClick={() => openWikiLink(match[1])}>
            {match[1]}
          </button>
        );
      }
      return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
    });
  };

  const tree = buildTree();
  const noteName = selectedNote?.split("/").pop().replace(".md", "");
  const folderName = selectedNote?.split("/")?.[1];

  return (
    <div className="vault-layout">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="vault-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`vault-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="vault-sidebar-header">
          <span className="vault-sidebar-title">Vault</span>
          <button className="vault-icon-btn mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="vault-search-wrap">
          <Search size={13} className="vault-search-icon" />
          <input
            className="vault-search"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => searchNotes(e.target.value)}
          />
        </div>

        {/* Search results */}
        {searchTerm && (
          <div className="vault-search-results">
            {searchResults.map(note => (
              <div key={note.path} className="vault-search-result" onClick={() => { loadNote(note.path); setSearchTerm(""); setSearchResults([]); }}>
                <FileText size={12} />
                <span>{note.path.split("/").pop().replace(".md", "")}</span>
              </div>
            ))}
            {searchResults.length === 0 && <div className="vault-empty-search">No results</div>}
          </div>
        )}

        {/* Favorites */}
        {!searchTerm && favorites.length > 0 && (
          <div className="vault-section">
            <div className="vault-section-label">Favorites</div>
            {favorites

  .filter(fav =>

    notes.some(note =>

      note.path
        .toLowerCase()
        .endsWith(
          `${fav.toLowerCase()}.md`
        )

    )

  )

  .map(fav => (

    <div

      key={fav}

      className={`vault-note-item ${
        noteName === fav
          ? "active"
          : ""
      }`}

      onClick={() =>
        openWikiLink(fav)
      }

    >

      <Star
        size={11}
        className="vault-note-icon fav"
      />

      <span>
        {fav}
      </span>

    </div>

))}
          </div>
        )}

        {/* Recent */}
        {!searchTerm && recentNotes.length > 0 && (
          <div className="vault-section">
            <div className="vault-section-label">Recent</div>
            {recentNotes.filter(path =>notes.some(note =>note.path === path)).slice(0,5).map(path => (
              <div key={path} className={`vault-note-item ${selectedNote === path ? "active" : ""}`} onClick={() => loadNote(path)}>
                <FileText size={11} className="vault-note-icon" />
                <span>{path.split("/").pop().replace(".md", "")}</span>
              </div>
            ))}
          </div>
        )}

        {/* File tree */}
        {!searchTerm && (
          <div className="vault-section">
            <div className="vault-section-label">Files</div>

            {/* Root notes */}
            {tree.root?.map(note => (
              <div
                key={note.path}
                className={`vault-note-item ${selectedNote === note.path ? "active" : ""}`}
                onClick={() => loadNote(note.path)}
              >
                <FileText size={11} className="vault-note-icon" />
                <span>{note.path.split("/").pop().replace(".md", "")}</span>
              </div>
            ))}

            {/* Folders */}
            {Object.keys(tree).filter(k => k !== "root").sort().map(folder => (
              <div key={folder} className="vault-folder">
                <div
                  className="vault-folder-row"
                  onClick={() => setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }))}
                >
                  {expandedFolders[folder]
                    ? <ChevronDown size={13} />
                    : <ChevronRight size={13} />
                  }
                  <span className="vault-folder-name">{folder}</span>
                </div>

                {expandedFolders[folder] && (
                  <div className="vault-folder-notes">
                    {tree[folder].map(note => (
                      <div
                        key={note.path}
                        className={`vault-note-item indented ${selectedNote === note.path ? "active" : ""}`}
                        onClick={() => loadNote(note.path)}
                      >
                        <FileText size={11} className="vault-note-icon" />
                        <span>{note.path.split("/").pop().replace(".md", "")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="vault-sidebar-actions">
          <button className="vault-action-btn" onClick={() => setShowCreateNote(true)}>
            <Plus size={14} /> New Note
          </button>
          <button className="vault-action-btn" onClick={() => setShowCreateFolder(true)}>
            <FolderPlus size={14} /> New Folder
          </button>
        </div>
      </aside>

      {/* Main editor */}
      <main className="vault-main">

        {/* Top bar */}
        <div className="vault-topbar">
          <div className="vault-topbar-left">
            <button className="vault-icon-btn mobile-only" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <button className="vault-icon-btn" onClick={() => setShowGraph(!showGraph)}>
              Graph
            </button>
            {selectedNote && (
              <div className="vault-breadcrumb">
                {folderName && <span className="vault-breadcrumb-folder">{folderName}</span>}
                {folderName && <span className="vault-breadcrumb-sep">/</span>}
                <span className="vault-breadcrumb-note">{noteName}</span>
              </div>
            )}
          </div>

          {selectedNote && (
            <div className="vault-topbar-actions">
              <button
                className={`vault-icon-btn fav-btn ${isFavorite() ? "active-star" : ""}`}
                onClick={toggleFavorite}
                title="Favorite"
                >
                <Star size={16} fill={isFavorite() ? "#ffaa00" : "none"} color={isFavorite() ? "#ffaa00" : "currentColor"} />
              </button>

              <button
                className="vault-icon-btn"
                onClick={() => { setRenameValue(noteName); setShowRename(true); }}
                title="Rename"
              >
                <Pencil size={16} />
              </button>

              <button
                className="vault-icon-btn"
                onClick={() => setEditMode(!editMode)}
                title={editMode ? "Preview" : "Edit"}
              >
                {editMode ? <Eye size={16} /> : <Edit3 size={16} />}
              </button>

              {editMode && (
                <button
                  className={`vault-save-btn ${saving ? "saving" : ""}`}
                  onClick={saveNote}
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save"}
                </button>
              )}

              <button className="vault-icon-btn danger" onClick={deleteNote} title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="vault-content">
        <div className="vault-content">

  {showGraph ? (

    <GraphView

      graphData={
        buildGraphData()
      }

      onNodeClick={
        node =>
          loadNote(
            node.path
          )
      }

    />

  ) : (

    !selectedNote ? (

      <div className="vault-empty-state">

        <div className="vault-empty-icon">
          ⌘
        </div>

        <p>
          Select a note or create a new one
        </p>

      </div>

    ) : editMode ? (

      <textarea

        ref={editorRef}

        className="vault-editor"

        value={content}

        onChange={(e) =>
          setContent(
            e.target.value
          )
        }

        placeholder="Start writing..."

      />

    ) : (

      <div className="vault-preview">

        <h1
          className="vault-note-title"
        >
          {noteName}
        </h1>

        <div
          className="vault-markdown"
        >
          {renderContent()}
        </div>

        {backlinks.length > 0 && (

          <div
            className="vault-backlinks"
          >

            <div
              className="vault-backlinks-label"
            >

              Linked from

            </div>

            {backlinks.map(note => (

              <div

                key={note.path}

                className="vault-backlink-item"

                onClick={() =>
                  loadNote(
                    note.path
                  )
                }

              >

                <FileText
                  size={12}
                />

                {note.path
                  .split("/")
                  .pop()
                  .replace(
                    ".md",
                    ""
                  )}

              </div>

            ))}

          </div>

        )}

      </div>

    )

  )}

</div>
        </div>
      </main>

      {/* Create Note Modal */}
      {showCreateNote && (
        <div className="vault-modal-overlay" onClick={() => setShowCreateNote(false)}>
          <div className="vault-modal" onClick={e => e.stopPropagation()}>
            <h3>New Note</h3>
            <select
              value={selectedFolder}
              onChange={e => setSelectedFolder(e.target.value)}
            >
              {Object.keys(tree).filter(k => k !== "root").sort().map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
            <input
              placeholder="Note name"
              value={newNoteName}
              onChange={e => setNewNoteName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createNote()}
              autoFocus
            />
            <div className="vault-modal-actions">
              <button className="vault-modal-cancel" onClick={() => setShowCreateNote(false)}>Cancel</button>
              <button className="vault-modal-confirm" onClick={createNote}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="vault-modal-overlay" onClick={() => setShowCreateFolder(false)}>
          <div className="vault-modal" onClick={e => e.stopPropagation()}>
            <h3>New Folder</h3>
            <input
              placeholder="Folder name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createFolder()}
              autoFocus
            />
            <div className="vault-modal-actions">
              <button className="vault-modal-cancel" onClick={() => setShowCreateFolder(false)}>Cancel</button>
              <button className="vault-modal-confirm" onClick={createFolder}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRename && (
        <div className="vault-modal-overlay" onClick={() => setShowRename(false)}>
          <div className="vault-modal" onClick={e => e.stopPropagation()}>
            <h3>Rename Note</h3>
            <input
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && renameNote()}
              autoFocus
            />
            <div className="vault-modal-actions">
              <button className="vault-modal-cancel" onClick={() => setShowRename(false)}>Cancel</button>
              <button className="vault-modal-confirm" onClick={renameNote}>Rename</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
  <div className="vault-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
    <div className="vault-modal" onClick={e => e.stopPropagation()}>
      <h3>Delete Note?</h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", margin: 0 }}>
        "{noteName}" will be permanently deleted from your vault.
      </p>
      <div className="vault-modal-actions">
        <button className="vault-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>
          Cancel
        </button>
        <button
          className="vault-modal-confirm"
          onClick={confirmDelete}
          style={{ background: "rgba(255,60,60,.8)" }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}