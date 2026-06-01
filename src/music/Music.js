import React, { useState, useEffect } from "react";
import { db } from "../Firebase.js";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import "./Music.css";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar.js";

export default function Music() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [view, setView] = useState("collection");
  const [showLibrary, setShowLibrary] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const collectionSongs = [...savedSongs]
  .sort((a, b) => b.createdAt - a.createdAt)
  .slice(0, 30);

  // Searching for songs with the query passed.
  const searchSongs = async () => {
    if (!searchTerm.trim()) return;
    const term = searchTerm;
    setLastSearch(term);
    setSearchTerm("");
    setResults([]);
    setLoading(true);

    try {
      const res = await fetch(
        `https://iaryan.vercel.app/api/music-search?q=${encodeURIComponent(searchTerm)}`
      );

      const data = await res.json();
      setResults(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Saving the songs to Firestore DB.
  const saveSong = async (song) => {
  console.log("CLICKED SONG:", song.trackName);

  try {
    const musicRef = collection(db, "music");

    console.log("Checking duplicates...");

    const existingSongQuery = query(
      musicRef,
      where("trackId", "==", song.trackId)
    );

    const existingSong = await getDocs(existingSongQuery);

    console.log("Query result:", existingSong.size);

    if (!existingSong.empty) {
      toast(`"${song.trackName}" already added`);
      return;
    }

    console.log("Adding song...");

    await addDoc(musicRef, {
      trackId: song.trackId,
      trackName: song.trackName,
      artistName: song.artistName,
      collectionName: song.collectionName,
      artworkUrl100: song.artworkUrl100.replace(
        "100x100",
        "600x600"
      ),
      trackViewUrl: song.trackViewUrl,
      createdAt: Date.now()
    });

    toast.success(`Added "${song.trackName}"`);

    setResults([]);
    setSearchTerm("");

    loadSavedSongs();

  } catch (err) {
    console.error("SAVE ERROR:");
    toast.error("Failed to save song");
  }
};

  // Loading the saved songs on UI from DB.
  const loadSavedSongs = async () => {
  try {
    const snapshot = await getDocs(collection(db, "music"));

    const songs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSavedSongs(songs);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadSavedSongs();
}, []);

const deleteSong = async (id) => {
  try {
    if (!window.confirm("Delete this song?")) return;
    await deleteDoc(doc(db, "music", id));

    toast.success("Song removed");

    loadSavedSongs();
  } catch (err) {
    console.error(err);

    toast.error("Failed to delete");
  }
};

// Common reusable method for the cards under recent, saved grid, etc.
const renderSongCard = (song) => (
  <div key={song.id} className="song-card">
    <img
      src={song.artworkUrl100}
      alt={song.trackName}
      width="64"
      height="64"
      style={{ borderRadius: "10px" }}
    />

    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          {song.trackName}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#666",
          }}
        >
          {song.artistName}
        </div>
      </div>
    </div>

    <div
      className="delete-btn"
      onClick={() => deleteSong(song.id)}
    >
      🗑️
    </div>
  </div>
);

 const groupedSongs = [...savedSongs]
  .sort((a, b) => b.createdAt - a.createdAt)
  .reduce((acc, song) => {
    const monthYear = new Date(song.createdAt)
      .toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(song);

    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>

    <h2 style={{ marginBottom: "15px", paddingTop: "60px" }}>My Music</h2>
    <div className="music-toggle">
<button
  className={view === "collection" ? "music-active" : ""}
  onClick={() => setView("collection")}
>
  Collection
</button>

<button
  className={view === "timeline" ? "music-active" : ""}
  onClick={() => setView("timeline")}
>
  Timeline
</button>
</div>
{view === "collection" && (
<div className="saved-grid">
  {collectionSongs.map(renderSongCard)}
  {/* {savedSongs.map((song) => (
    <div key={song.id} className="song-card">
      <img
        src={song.artworkUrl100}
        alt={song.trackName}
        width="64"
        height="64"
        object-fit="cover"
        style={{ borderRadius: "10px" }}
      />

      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
  <div style={{ fontWeight: 600, fontSize: "14px" }}>
    {song.trackName}
  </div>

  <div style={{ fontSize: "12px", color: "#666" }}>
    {song.artistName}
  </div>
</div>
      </div>
      <div
        className="delete-btn"
        onClick={() => deleteSong(song.id)}
      >
        🗑️
        </div>
    </div>
  ))} */}
</div>
)}

{view === "timeline" && (
  <div className="timeline-view">
    {Object.entries(groupedSongs).map(
      ([month, songs]) => (
        <div
          key={month}
          className="timeline-month"
        >
          <h3>{month}</h3>

          <div className="saved-grid">
            {songs.map(renderSongCard)}
          </div>
        </div>
      )
    )}
  </div>
)}

{savedSongs.length > 20 && (
  <button
    className="view-all-btn"
    onClick={() => setShowLibrary(true)}
  >
    View All ({savedSongs.length})
  </button>
)}

{showLibrary && (
  <div className="library-overlay">
    <div className="library-modal">

      <div className="library-header">
        <h2>All Songs</h2>

        <button
  className="library-close"
  onClick={() => setShowLibrary(false)}
>
  ✕
</button>
      </div>

      <div className="library-list">
        {[...savedSongs]
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((song) => (
            renderSongCard(song)
        ))}
      </div>

    </div>
  </div>
)}

<div className="section-divider">

  <span>Discover Music</span>
</div>

      <h2>Search New Music</h2>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  }}
></div>
    <div className="search-bar-row" >
      <input
        value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search songs, artists..."
    style={{
      flex: 1,
      padding: "12px 14px",
      borderRadius: "15px",
      border: "1px solid grey",
      outline: "none",
      fontSize: "15px",
      color: "white"
    //   background: "",
    }}/>

      <button 
      onClick={searchSongs}
      disabled={loading}
    style={{
      width: "80px",
      height: "42px",
      padding: "12px 16px",
      borderRadius: "15px",
      border: "1px solid grey",
      marginLeft: "5px",
      color: "grey",
      fontWeight: "600",
      fontSize: "15px",
      cursor: "pointer",
      transition: "0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
    {loading ? (
      <div className="spinner" />
    ) : (
        "Search"
    )}
      </button>
    </div>

      {results.length > 0 && (
  <div className="search-results-label">
    Showing results for - '{lastSearch}'
  </div>
)}

      {!loading &&
 results.length === 0 &&
 lastSearch && (
  <div className="search-results-label">
    No results found for '{lastSearch}'
  </div>
)}

      <div className="search-grid">
        {results.map((song) => (
          <div
            key={song.trackId}
            onClick={() => saveSong(song)}
            className="search-card"
            >
            <img
              src={song.artworkUrl100.replace("100x100", "300x300")}
              alt={song.trackName}
              className="search-img"
            />

            <div>
              <div className="search-title">{song.trackName}</div>
              <div className="search-artist">{song.artistName}</div>
            </div>
          </div>
        ))}
      </div>
      {/* <BottomNavbar /> */}
    </div>
  );
}