import "./Vault.css";

import React, {
  useEffect,
  useState
} from "react";

import ReactMarkdown
  from "react-markdown";

export default function Vault() {

  const [content, setContent] =
    useState("");

  useEffect(() => {

    loadWelcomeNote();

  }, []);

  const loadWelcomeNote =
  async () => {

    try {

      const response =
        await fetch(
          "/api/vault/read"
        );

      const data =
        await response.json();

      setContent(
        data.content
      );

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="vault-page">

      <div className="vault-header">

        <h1>
          Vault
        </h1>

      </div>

      <div className="vault-content">

        <ReactMarkdown>

          {content}

        </ReactMarkdown>

      </div>

    </div>

  );

}