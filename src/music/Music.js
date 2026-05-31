import React, { useState } from "react";

export default function Music() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchSongs = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://iaryan.vercel.app/api/music-search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Music</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search songs..."
      />

      <button onClick={searchSongs}>
        Search
      </button>

      <div style={{ marginTop: "20px" }}>
        {results.map((song) => (
          <div
            key={song.trackId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px"
            }}
          >
            <img
              src={song.artworkUrl100}
              alt={song.trackName}
              width="60"
              height="60"
            />

            <div>
              <div>{song.trackName}</div>
              <div>{song.artistName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}