import "./Vault.css";

import React, {
  useEffect,
  useState
} from "react";

import ReactMarkdown
  from "react-markdown";

export default function Vault() {

  const [notes, setNotes] =
    useState([]);

  const [selectedNote,
         setSelectedNote] =
    useState(null);

  const [content,
         setContent] =
    useState("");

    const [showCreateNote,
       setShowCreateNote] =
  useState(false);

const [newNoteName,
       setNewNoteName] =
  useState("");

const [selectedFolder,
       setSelectedFolder] =
  useState("Personal");

    const [expandedFolders,
       setExpandedFolders] =
  useState({});
  
  const [editMode,
       setEditMode] =
  useState(false);

  useEffect(() => {

    loadNotes();

  }, []);

  const loadNotes =
  async () => {

    const response =
      await fetch(
        "/api/vault/tree"
      );

    const data =
      await response.json();

    console.log(
      "TREE RESPONSE",
      data
    );

    if (
      !Array.isArray(data)
    ) {

      console.error(
        "Tree API failed",
        data
      );

      setNotes([]);

      return;

    }

    setNotes(data);

    const folders = {};

    data.forEach(note => {

      const parts =
        note.path.split("/");

      if (
        parts.length > 2
      ) {

        folders[
          parts[1]
        ] = true;

      }

    });

    setExpandedFolders(
      folders
    );

  };

  const loadNote =
    async (path) => {

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

    };

    const saveNote =
  async () => {

    await fetch(
      "/api/vault/save",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          path:
            selectedNote,

          content

        })

      }
    );

    setEditMode(false);

    alert(
      "Saved"
    );

  };

  const createNote =
  async () => {

    if (
      !newNoteName.trim()
    ) return;

    const response =
      await fetch(
        "/api/vault/create",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            folder:
              selectedFolder,

            noteName:
              newNoteName

          })

        }
      );

    const data =
      await response.json();

    const newPath =
      `vault/${selectedFolder}/${newNoteName}.md`;

    await loadNote(
      newPath
    );

    setEditMode(true);

    setShowCreateNote(
      false
    );

    setNewNoteName("");

    loadNotes();

  };

    const toggleFolder =
  (folder) => {

    setExpandedFolders(
      prev => ({

        ...prev,

        [folder]:
          !prev[folder]

      })
    );

  };

   const buildTree = () => {

  const folders = {};

  if (
    !Array.isArray(notes)
  ) {

    return folders;

  }

  notes.forEach(note => {

    const parts =
      note.path.split("/");

    if (parts.length === 2) {

      if (!folders.root) {

        folders.root = [];

      }

      folders.root.push(note);

      return;

    }

    const folder =
      parts[1];

    if (!folders[folder]) {

      folders[folder] = [];

    }

    folders[folder].push(note);

  });

  return folders;

};

const tree = buildTree();

const openWikiLink =
  async (noteName) => {

    const target =
      notes.find(note =>

        note.path
          .toLowerCase()
          .endsWith(
            `${noteName.toLowerCase()}.md`
          )

      );

    if (!target) {

      alert(
        `Note "${noteName}" not found`
      );

      return;

    }

    await loadNote(
      target.path
    );

    setEditMode(false);

  };

  return (

  <div className="vault-layout">

    <div
      className="vault-sidebar"
    >

      <h2>
        Vault
      </h2>

      <button
        className="new-note-btn"
        onClick={() =>
          setShowCreateNote(true)
        }
      >
        + New Note
      </button>

      {tree?.root?.map(note => (

        <div
          key={note.path}
          className={
            selectedNote === note.path
              ? "vault-note active"
              : "vault-note"
          }
          onClick={() =>
            loadNote(note.path)
          }
        >

          {note.path
            .split("/")
            .pop()
            .replace(".md", "")}

        </div>

      ))}

      {Object.keys(tree || {})

        .filter(
          key => key !== "root"
        )

        .map(folder => (

          <div
            key={folder}
            className="vault-folder"
          >

            <div
              className="vault-folder-title"
              onClick={() =>
                toggleFolder(folder)
              }
            >

              {
                expandedFolders[folder]
                  ? "▼"
                  : "▶"
              }

              {" "}

              {folder}

            </div>

            {expandedFolders[folder] &&
              tree[folder].map(note => (

                <div

                  key={note.path}

                  className={
                    selectedNote ===
                    note.path

                      ? "vault-note active"

                      : "vault-note"
                  }

                  onClick={() =>
                    loadNote(note.path)
                  }

                >

                  {note.path
                    .split("/")
                    .pop()
                    .replace(".md", "")}

                </div>

            ))}

          </div>

      ))}

    </div>

    <div
  className="vault-viewer"
>

  <div
    className="vault-toolbar"
  >

    <button
      onClick={() =>
        setEditMode(
          !editMode
        )
      }
    >

      {editMode
        ? "Preview"
        : "Edit"}

    </button>

    {editMode && (

      <button
        onClick={saveNote}
      >

        Save

      </button>

    )}

  </div>

  {editMode ? (

    <textarea

      className="vault-editor"

      value={content}

      onChange={(e) =>
        setContent(
          e.target.value
        )
      }

    />

  ) : (

   <ReactMarkdown>
  {content}
</ReactMarkdown>

  )}

</div>

    {showCreateNote && (

      <div
        className="vault-modal-overlay"
        onClick={() =>
          setShowCreateNote(false)
        }
      >

        <div
          className="vault-modal"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <h3>
            Create Note
          </h3>

          <select

            value={
              selectedFolder
            }

            onChange={(e) =>
              setSelectedFolder(
                e.target.value
              )
            }

          >

            {Object.keys(tree || {})

              .filter(
                key =>
                  key !== "root"
              )

              .map(folder => (

                <option
                  key={folder}
                  value={folder}
                >

                  {folder}

                </option>

            ))}

          </select>

          <input

            placeholder="Note Name"

            value={
              newNoteName
            }

            onChange={(e) =>
              setNewNoteName(
                e.target.value
              )
            }

          />

          <button
            onClick={createNote}
          >

            Create

          </button>

        </div>

      </div>

    )}

  </div>

);
}