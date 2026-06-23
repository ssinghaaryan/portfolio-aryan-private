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

  const [searchTerm,
       setSearchTerm] =
  useState("");

  const [searchResults,
       setSearchResults] =
  useState([]);

  const [showCreateFolder,
       setShowCreateFolder] =
  useState(false);

const [newFolderName,
       setNewFolderName] =
  useState("");

  const [showRename,
       setShowRename] =
  useState(false);

const [renameValue,
       setRenameValue] =
  useState("");

  const [recentNotes,
       setRecentNotes] =
  useState([]);

  useEffect(() => {

  loadNotes();

  const savedRecent =

    localStorage.getItem(
      "vault-recent"
    );

  if (savedRecent) {

    setRecentNotes(

      JSON.parse(
        savedRecent
      )

    );

  }

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
      const updatedRecent = [

  path,

  ...recentNotes.filter(
    note => note !== path
  )

].slice(0, 10);

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

  const createFolder =
  async () => {

    if (
      !newFolderName.trim()
    ) return;

    await fetch(
      "/api/vault/create-folder",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          folderName:
            newFolderName

        })

      }
    );

    setShowCreateFolder(
      false
    );

    setNewFolderName("");

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

  const renameNote =
  async () => {

    if (
      !selectedNote
    ) return;

    await fetch(
      "/api/vault/save",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          action:
            "rename",

          oldPath:
            selectedNote,

          newName:
            renameValue

        })

      }
    );

    const folder =
      selectedNote.substring(

        0,

        selectedNote.lastIndexOf(
          "/"
        )

      );

    const newPath =
      `${folder}/${renameValue}.md`;

    setSelectedNote(
      newPath
    );

    setShowRename(
      false
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

if (
  note.path.endsWith(
    ".gitkeep"
  )
) {

  return;

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

  const createNew =
    window.confirm(

      `${noteName} doesn't exist.

Create it?`

    );

  if (!createNew) {

    return;

  }

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

        noteName

      })

    }
  );

  await loadNotes();

  const newPath =
    `vault/${selectedFolder}/${noteName}.md`;

  await loadNote(
    newPath
  );

  setEditMode(true);

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

  const searchNotes =
  async (term) => {

    setSearchTerm(term);

    if (!term.trim()) {

      setSearchResults([]);

      return;

    }

    const results = [];

    for (const note of notes) {

      try {

        const response =
          await fetch(

            `/api/vault/read?path=${note.path}`

          );

        const data =
          await response.json();

        const fileName =
          note.path
            .split("/")
            .pop()
            .replace(
              ".md",
              ""
            );

        const matchesTitle =
          fileName
            .toLowerCase()
            .includes(
              term.toLowerCase()
            );

        const matchesContent =
          data.content
            ?.toLowerCase()
            .includes(
              term.toLowerCase()
            );

        if (
          matchesTitle ||
          matchesContent
        ) {

          results.push(note);

        }

      } catch (err) {

        console.error(err);

      }

    }

    setSearchResults(
      results
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

      {recentNotes.length > 0 && (

  <div
    className="vault-recent"
  >

    <h4>
      Recent
    </h4>

    {recentNotes.map(path => (

      <div

        key={path}

        className="vault-note"

        onClick={() =>
          loadNote(path)
        }

      >

        {path
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

      <input

  className="vault-search"

  placeholder="Search..."

  value={searchTerm}

  onChange={(e) =>
  searchNotes(
    e.target.value
  )
}

/>

{searchTerm && (

  <div
    className="search-results"
  >

    {searchResults.map(note => (

      <div

        key={note.path}

        className="vault-note"

        onClick={() => {

          loadNote(
            note.path
          );

          setSearchTerm("");

        }}

      >

        <>

  <div>

    {note.path
      .split("/")
      .pop()
      .replace(
        ".md",
        ""
      )}

  </div>

  <small>

  {note.path.replace(
    "vault/",
    ""
  )}

</small>

</>

      </div>

    ))}

  </div>

)}

      <button
        className="new-note-btn"
        onClick={() =>
          setShowCreateNote(true)
        }
      >
        + New Note
      </button>

      <button
  className="new-folder-btn"
  onClick={() =>
    setShowCreateFolder(true)
  }
>

  + Folder

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

  onClick={() => {

    if (
      !selectedNote
    ) return;

    setRenameValue(

      selectedNote
        .split("/")
        .pop()
        .replace(
          ".md",
          ""
        )

    );

    setShowRename(
      true
    );

  }}

>

  Rename

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

{showRename && (

  <div
    className="vault-modal-overlay"
    onClick={() =>
      setShowRename(false)
    }
  >

    <div
      className="vault-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <h3>
        Rename Note
      </h3>

      <input

        value={
          renameValue
        }

        onChange={(e) =>
          setRenameValue(
            e.target.value
          )
        }

      />

      <button
        onClick={
          renameNote
        }
      >

        Save

      </button>

    </div>

  </div>

)}

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

    {showCreateFolder && (

  <div
    className="vault-modal-overlay"
    onClick={() =>
      setShowCreateFolder(false)
    }
  >

    <div
      className="vault-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <h3>
        Create Folder
      </h3>

      <input

        placeholder="Folder Name"

        value={
          newFolderName
        }

        onChange={(e) =>
          setNewFolderName(
            e.target.value
          )
        }

      />

      <button
        onClick={createFolder}
      >

        Create Folder

      </button>

    </div>

  </div>

)}

  </div>

);
}