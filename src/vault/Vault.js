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

  const [backlinks,
       setBacklinks] =
  useState([]);

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
      loadBacklinks(path);

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

  const deleteNote =
  async () => {

    if (
      !selectedNote
    ) return;

    const confirmed =
      window.confirm(
        "Delete this note?"
      );

    if (
      !confirmed
    ) return;

    await fetch(
      "/api/vault/delete",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          path:
            selectedNote

        })

      }
    );

    setContent("");

    setSelectedNote(
      null
    );

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

  const renderWikiLinks =
  (markdown) => {

    if (!markdown) {

      return "";

    }

    return markdown.replace(

      /\[\[(.*?)\]\]/g,

      (_, noteName) => {

        return `[${noteName}](wiki:${noteName})`;

      }

    );

  };

  const renderContent = () => {

  const parts =
    content.split(
      /(\[\[.*?\]\])/
    );

  return parts.map(
    (part, index) => {

      const match =
        part.match(
          /^\[\[(.*?)\]\]$/
        );

      if (match) {

        const noteName =
          match[1];

        return (

          <button

            key={index}

            type="button"

            className="wiki-link"

            onClick={() =>
              openWikiLink(
                noteName
              )
            }

          >

            {noteName}

          </button>

        );

      }

      return (

        <ReactMarkdown
          key={index}
        >

          {part}

        </ReactMarkdown>

      );

    }
  );

};

  const openWikiLink =
  async (noteName) => {

    console.log(
      "CLICKED",
      noteName
    );

    const target =
      notes.find(note =>

        note.path
          .toLowerCase()
          .endsWith(
            `${noteName.toLowerCase()}.md`
          )

      );

    console.log(
      "FOUND TARGET",
      target
    );

    if (!target) {

      alert(
        `${noteName} not found`
      );

      return;

    }

    await loadNote(
      target.path
    );

  };

  const loadBacklinks =
  async (notePath) => {

    const noteName =
      notePath
        .split("/")
        .pop()
        .replace(".md", "");

    const linkedNotes =
      [];

    for (const note of notes) {

      if (
        note.path === notePath
      ) continue;

      try {

        const response =
          await fetch(

            `/api/vault/read?path=${note.path}`

          );

        const data =
          await response.json();

        if (

          data.content?.includes(

            `[[${noteName}]]`

          )

        ) {

          linkedNotes.push(
            note
          );

        }

      } catch (err) {

        console.error(err);

      }

    }

    setBacklinks(
      linkedNotes
    );

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

    <button
  onClick={deleteNote}
>
  Delete
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
      <>
    {renderContent()}
    {backlinks.length > 0 && (

  <div
    className="vault-backlinks"
  >

    <h3>
      Referenced By
    </h3>

    {backlinks.map(note => (

      <div

        key={note.path}

        className="backlink-item"

        onClick={() =>
          loadNote(
            note.path
          )
        }

      >

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
  </>
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