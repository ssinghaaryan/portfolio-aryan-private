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

    const [expandedFolders,
       setExpandedFolders] =
  useState({});

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

      setNotes(data);

      const folders = {};

data.forEach(note => {

  const parts =
    note.path.split("/");

  if (parts.length > 2) {

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

const tree =
  buildTree();

  return (

    <div className="vault-layout">

      <div
        className="vault-sidebar"
      >

        <h2>
          Vault
        </h2>

        {tree?.root?.map(note => (

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

    {
      note.path
        .split("/")
        .pop()
        .replace(".md", "")
    }

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
    </div>

))}

      </div>

      <div
        className="vault-viewer"
      >

        <ReactMarkdown>

          {content}

        </ReactMarkdown>

      </div>

    </div>

  );

}