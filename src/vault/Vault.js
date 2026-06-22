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

  return (

    <div className="vault-layout">

      <div
        className="vault-sidebar"
      >

        <h2>
          Vault
        </h2>

        {notes.map(note => (

          <div

            key={note.path}

            className={
              selectedNote ===
              note.path

                ? "vault-note active"

                : "vault-note"
            }

            onClick={() =>
              loadNote(
                note.path
              )
            }

          >

            {
              note.path
                .split("/")
                .pop()
                .replace(
                  ".md",
                  ""
                )
            }

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