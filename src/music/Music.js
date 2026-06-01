import React, { useState, useEffect } from "react";
import { db } from "../Firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import toast from "react-hot-toast";
import "./Music.css";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar.js";

export default function Music() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);

  // Searching for songs with the query passed.
  const searchSongs = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(
        `https://iaryan.vercel.app/api/music-search?q=${encodeURIComponent(searchTerm)}`
      );

      const data = await res.json();

      setResults(data);
    } catch (err) {
      console.error(err);
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

  return (

    <div style={{ padding: "20px" }}>
     <h2 style={{ marginBottom: "15px", paddingTop: "60px" }}>My Collection</h2>
<div className="saved-grid">
  {savedSongs.map((song) => (
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
        onClick={() => console.log("delete", song.id)}
      >
        🗑️
        </div>
    </div>
  ))}
</div>

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
      fontSize: "12px",
      color: "white"
    //   background: "",
    }}/>

      <button 
      onClick={searchSongs}
    style={{
      padding: "12px 16px",
      borderRadius: "15px",
      border: "1px solid grey",
      marginLeft: "5px",
    //   background: "grey",
    
      color: "grey",
      fontWeight: "600",
      fontSize: "12px",
      cursor: "pointer",
      transition: "0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
        Search
      </button>

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