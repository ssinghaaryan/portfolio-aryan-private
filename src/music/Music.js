import React, { useState, useEffect, useRef,useMemo } from "react";
import { db } from "../Firebase.js";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import "./Music.css";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar.js";
import Header from "../components/Header/header.js";
import { Music2, PlayCircle } from "lucide-react";
import MusicSkeleton from "../components/Skeleton/MusicSkeleton";
import { useData } from "../context/DataContext";

export default function Music() {
  const { musicData, setMusicData } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [savedSongs, setSavedSongs] = useState(musicData?.songs || []);
  const [view, setView] = useState("collection");
  const [showLibrary, setShowLibrary] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchMode, setSearchMode] = useState("web");
  const [playlists, setPlaylists] = useState(musicData?.playlists || []);
  const [loading, setLoading] = useState(!musicData);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [showSongMenu, setShowSongMenu] = useState(false);
  const [menuSongId, setMenuSongId] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [shuffledSongs, setShuffledSongs] = useState([]);

  const MENU_WIDTH = 180;
  const MENU_HEIGHT = 260;
  const longPressTimer = useRef(null);
  // const collectionSongs = [...savedSongs]
  // .sort((a, b) => b.createdAt - a.createdAt)
  // .slice(0, 30);

  const displayedSongs =
  selectedPlaylist
    ? savedSongs.filter(
        (song) =>
          song.playlistIds?.includes(
            selectedPlaylist
          )
      )
    : savedSongs;

//------------Open in Spotify and YT Music----------------------//

// const openExternalLink = (url) => {
//   const a = document.createElement("a");
//   a.href = url;
//   a.target = "_blank";
//   a.rel = "noreferrer";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// };

// const openSpotify = (song) => {
//   const query = encodeURIComponent(`${song.trackName} ${song.artistName}`);
//   openExternalLink(`https://open.spotify.com/search/${query}`);
// };

// const openYouTubeMusic = (song) => {
//   const query = encodeURIComponent(`${song.trackName} ${song.artistName}`);
//   openExternalLink(`https://music.youtube.com/search?q=${query}`);
// };

const openSpotify = (song) => {
  const query = encodeURIComponent(`${song.trackName} ${song.artistName}`);
  const url = `https://open.spotify.com/search/${query}`;
  window.open(url, "_blank", "noopener");
};

const openYouTubeMusic = (song) => {
  const query = encodeURIComponent(`${song.trackName} ${song.artistName}`);
  const url = `https://music.youtube.com/search?q=${query}`;
  window.open(url, "_blank", "noopener");
};

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
      playlistIds: [],
      createdAt: Date.now()
    });

    toast.success(`Added "${song.trackName}"`);

    closeSearchOverlay();
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
    setMusicData(prev => ({ ...prev, songs })); // 👈 save to context
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (!musicData) {
    loadSavedSongs();
    loadPlaylists();
  }
}, []);

useEffect(() => {

  const shuffled =
    [...displayedSongs]
      .sort(() => Math.random() - 0.5);

  setShuffledSongs(shuffled);

}, [selectedPlaylist, savedSongs]);

const visibleSongs = shuffledSongs.slice(0, 12);

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

const renderMusicTile = (song) => (
  // <div key={song.id} className="music-tile">
  <div
  key={song.id}
  className="music-tile"
  
  onContextMenu={(e) =>
    e.preventDefault()
  }

  onTouchStart={(e) =>
    handleLongPressStart(
      e,
      song
    )
  }

  onTouchEnd={
    handleLongPressEnd
  }

  onTouchMove={
    handleLongPressEnd
  }

  onMouseDown={(e) =>
    handleLongPressStart(
      e,
      song
    )
  }

  onMouseUp={
    handleLongPressEnd
  }

  onMouseLeave={
    handleLongPressEnd
  }
>

    <img
      src={song.artworkUrl100}
      alt={song.trackName}
    />

    <div className="music-tile-overlay">
      <div className="music-tile-title">
        {song.trackName}
      </div>
    </div>

    <div
      className="song-menu-btn"
      onClick={(e) => {
        e.stopPropagation();
        const rect =e.currentTarget.getBoundingClientRect();
        setSelectedSong(song);
        setMenuSongId(song.id); 
        setMenuPosition({
          x: rect.right,
          y: rect.bottom
        });
      }}
    >
      ⋯
    </div>

  </div>
);

// Common reusable method for the cards under recent, saved grid, etc.
const renderSongRow = (song) => (
  // <div key={song.id} className="song-card">
  <div
  key={song.id}
  className="song-card"

  onTouchStart={(e) =>
    handleLongPressStart(
      e,
      song
    )
  }

  onTouchEnd={
    handleLongPressEnd
  }

  onTouchMove={
    handleLongPressEnd
  }

  onMouseDown={(e) =>
    handleLongPressStart(
      e,
      song
    )
  }

  onMouseUp={
    handleLongPressEnd
  }

  onMouseLeave={
    handleLongPressEnd
  }
>

    <img
      src={song.artworkUrl100}
      alt={song.trackName}
      width="64"
      height="64"
      style={{ borderRadius: "10px" }}
    />

    <div style={{ flex: 1, overflow: "hidden" }}>
      <div className="song-title">
        {song.trackName}
      </div>

      <div className="song-artist">
        {song.artistName}
      </div>
    </div>

    <div
  className="song-menu-btn"
  onClick={(e) => {

    console.log("MENU CLICK");

    e.stopPropagation();
        e.stopPropagation();

        const rect =
          e.currentTarget.getBoundingClientRect();

        setSelectedSong(song);

        setMenuSongId(song.id);

        setMenuPosition({
          x: rect.right,
          y: rect.bottom
        });
      }}
    >
      ⋯
    </div>

  </div>
);



 const groupedSongs = [...displayedSongs]
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

  const closeSearchOverlay = () => {
  setShowSearch(false);

  setSearchTerm("");
  setResults([]);

  setLastSearch("");
};

const filteredLibrarySongs =
  savedSongs.filter((song) =>
    `${song.trackName} ${song.artistName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

const inputRef = useRef(null);

useEffect(() => {
  if (!showSearch) return;

  requestAnimationFrame(() => {
    inputRef.current?.focus();
  });
}, [showSearch]);

const loadPlaylists = async () => {
  const snapshot = await getDocs(collection(db, "playlists"));
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setPlaylists(data);
  setMusicData(prev => ({ ...prev, playlists: data })); // 👈 save to context
};

const createPlaylist = async () => {

  if (!newPlaylistName.trim())
    return;

  await addDoc(
    collection(db, "playlists"),
    {
      name: newPlaylistName,
      createdAt: Date.now()
    }
  );

  setNewPlaylistName("");

  setShowCreatePlaylist(false);

  loadPlaylists();

  toast.success(
    "Playlist created"
  );
};

const openSongMenu = (song) => {
  setSelectedSong(song);
  setShowSongMenu(true);
};

const addSongToPlaylist = async (
  songId,
  playlistId
) => {
  // console.log("Called with:", songId, playlistId);
  try {

    const song = savedSongs.find((s) => s.id === songId);
    // console.log("Found song:", song);

    if (!song) return;

    const existing =
      song.playlistIds || [];

    if (
      existing.includes(playlistId)
    ) {
      toast("Already added");
      return;
    }

    await updateDoc(
      doc(db, "music", songId),
      {
        playlistIds: [
          ...existing,
          playlistId
        ]
      }
    );

    toast.success(
      "Added to playlist"
    );

    loadSavedSongs();

  } catch (err) {
    console.error(err);
  }
};

const handleLongPressStart = (
  e,
  song
) => {

  const rect =
    e.currentTarget.getBoundingClientRect();

  longPressTimer.current =
    setTimeout(() => {

      setSelectedSong(song);

      setMenuSongId(song.id);

      setMenuPosition({
        x: rect.right,
        y: rect.bottom
      });

    }, 500);

};

const handleLongPressEnd = () => {

  clearTimeout(
    longPressTimer.current
  );

};

// --------------------------------------- ********* ----------------------------------- //
// --------------------------------------- ********* ----------------------------------- //
// --------------------------------------- ********* ----------------------------------- //
// --------------------------------------- ********* ----------------------------------- //

  return (
    <div style={{ padding: "20px" }}>

    <Header title="My Music">

  <button
    className="header-btn"
    onClick={() => setShowSearch(true)}
  >
    ⌕
  </button>
</Header>

<div className="playlist-section">

  <div className="playlist-row">

   <button
    className="new-playlist-btn"
    onClick={() =>
  setShowCreatePlaylist(true)
}
  >
    + New Playlist
  </button>

    <div
      className={`playlist-chip ${
        selectedPlaylist === null
          ? "playlist-chip-active"
          : ""
      }`}
      onClick={() => setSelectedPlaylist(null)}
    >
      All Songs
    </div>

    {playlists.map((playlist) => (
      <div
        key={playlist.id}
        className={`playlist-chip ${
          selectedPlaylist === playlist.id
            ? "playlist-chip-active"
            : ""
        }`}
        onClick={() =>
          setSelectedPlaylist(playlist.id)
        }
      >
        {playlist.name}
      </div>
    ))}

  </div>

</div>

   <div className="music-controls-row">
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

  {displayedSongs.length > 12 && (
    <button
      className="view-all-btn"
      onClick={() => setShowLibrary(true)}
    >
      View All ({displayedSongs.length})
    </button>
  )}
</div>

{view === "collection" && (
<div className="saved-grid">
  {visibleSongs.map(renderMusicTile)}
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

          <div className="library-list">
            {songs.map(renderSongRow)}
          </div>
        </div>
      )
    )}
  </div>
)}

{/* {displayedSongs.length > 12 && (
  <button
    className="view-all-btn"
    onClick={() => setShowLibrary(true)}
  >
    View All ({displayedSongs.length})
  </button>
)} */}

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
        {[...displayedSongs]
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((song) => (
            renderSongRow(song)
        ))}
      </div>

    </div>
  </div>
)}

{showSearch && (
  <div
    className="library-overlay"
    onClick={closeSearchOverlay}
  >
    <div
      className="library-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="library-header">
        <h3>Search Music</h3>

        <button
          className="library-close"
          onClick={closeSearchOverlay}
        >
          ✕
        </button>
      </div>

      {/* <div className="section-divider" /> */}

      <div className="search-mode-toggle">

  <button
    className={
      searchMode === "web"
        ? "music-active"
        : ""
    }
    onClick={() => {
  setSearchMode("web");
  setSearchTerm("");
  setResults([]);

  setTimeout(() => {
    inputRef.current?.focus();
  }, 0);
}}
  >
    Web
  </button>

  <button
    className={
      searchMode === "library"
        ? "music-active"
        : ""
    }
    onClick={() => {
  setSearchMode("library");
  setSearchTerm("");
  setResults([]);

  setTimeout(() => {
    inputRef.current?.focus();
  }, 0);
}}
  >
    Library
  </button>

</div>

      <div className="search-bar-row">

        <input
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          onKeyDown={(e) => {
    if (
      e.key === "Enter" &&
      searchMode === "web"
    ) {
      searchSongs();
    }
  }}
          ref={inputRef}
          placeholder="Search songs, artists..."
          style={{
  flex: 1,
  padding: "12px 14px",
  borderRadius: "15px",
  border: "1px solid #333",
  fontSize: "16px",
  color: "white",
  background: "#242424",
  outline: "none",
  fontFamily: "inherit"
}}
        />

        {searchMode === "web" && (
  <button
  className="overlay-search-btn"
  onClick={searchSongs}
  disabled={loading}
>
  {loading ? "..." : "Search"}
</button>
)}

      </div>

      {results.length > 0 && (
        <div
          className="search-results-label"
        >
          Showing {filteredLibrarySongs.length} results for '{lastSearch}'
        </div>
      )}

      {loading && searchMode === "web" && (
  <div style={{ padding: "0 16px" }}>
    <MusicSkeleton count={6} />
  </div>
)}

      {searchMode === "web" && (
  <div className="search-grid">
        {results.map((song) => (
          <div
            key={song.trackId}
            onClick={() => saveSong(song)}
            className="search-card"
          >
            <img
              src={song.artworkUrl100.replace(
                "100x100",
                "300x300"
              )}
              alt={song.trackName}
              className="search-img"
            />

            <div>
              <div className="search-title">
                {song.trackName}
              </div>

              <div className="search-artist">
                {song.artistName}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    {searchMode === "web" &&
 !searchTerm.trim() && (
  <div className="empty-state">
    Search the Web...
  </div>
)}
    {searchMode === "library" &&
 !searchTerm.trim() && (
  <div className="empty-state">
    Search your collection...
  </div>
)}
    {searchMode === "library" &&
 searchTerm.trim() && (
  <div className="library-list">
    {filteredLibrarySongs.map((song) =>
      renderSongRow(song)
    )}
  </div>
)}
{searchMode === "library" &&
 searchTerm &&
 filteredLibrarySongs.length === 0 && (
  <div className="empty-state">
    No songs found
  </div>
)}
    </div>
  </div>
)}

{showSongMenu && (
  <div
    className="library-overlay"
    onClick={() =>
      setShowSongMenu(false)
    }
  >
    <div
      className="song-menu-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <div
  style={{
  top:
    window.innerHeight -
    menuPosition.y <
    MENU_HEIGHT
      ? menuPosition.y - MENU_HEIGHT
      : menuPosition.y + 8,

  left:
    window.innerWidth -
    menuPosition.x <
    MENU_WIDTH
      ? menuPosition.x - MENU_WIDTH
      : menuPosition.x
}}
>


  {playlists.map((playlist) => {

  const alreadyInPlaylist =
    selectedSong.playlistIds?.includes(
      playlist.id
    );

  return (
    <button className={
    alreadyInPlaylist
      ? "playlist-added"
      : ""
  }
      key={playlist.id}
      onClick={() => {

        addSongToPlaylist(
          selectedSong.id,
          playlist.id
        );

        setShowSongMenu(false);
      }}
    >
      {alreadyInPlaylist
        ? `${playlist.name} ✓`
        : `+ ${playlist.name}`}
    </button>
  );

})}

</div>

<button
  onClick={() => {
    openSpotify(selectedSong);
    setShowSongMenu(false);
  }}
>
  <Music2 size={16} />
  Spotify
</button>

<button
  onClick={() => {
    openYouTubeMusic(selectedSong);
    setShowSongMenu(false);
  }}
>
  <PlayCircle size={16} />
  YT Music
</button>

      <button
        onClick={() =>
          deleteSong(selectedSong.id)
        }
      >
        Delete Song
      </button>
    </div>
  </div>
)}

{menuSongId && selectedSong && (
  <>

    <div
      className="menu-backdrop"
      onClick={() =>
        setMenuSongId(null)
      }
    />
          {console.log("Menu position:", menuPosition)}
   <div
  className="floating-song-menu"
  style={{
    position: "fixed",
    top: Math.min(
      menuPosition.y + 8,
      window.innerHeight - MENU_HEIGHT - 20
    ),
    left: Math.min(
      menuPosition.x - MENU_WIDTH,
      window.innerWidth - MENU_WIDTH - 20
    ),
    zIndex: 99999
  }}
>
    {/* {console.log("Playlists at render:", playlists)} */}
  {/* {console.log("Selected song:", selectedSong)} */}
  {playlists.map((playlist) => {
  const alreadyInPlaylist = selectedSong.playlistIds?.includes(playlist.id);

  return (
    <button
      key={playlist.id}
      onClick={(e) => {
        e.stopPropagation();
        addSongToPlaylist(selectedSong.id, playlist.id);
        setMenuSongId(null);
      }}
    >
      {alreadyInPlaylist ? `✓ ${playlist.name}` : `+ ${playlist.name}`}
    </button>
  );
})}
      {/* {playlists.map((playlist) => {

        const alreadyInPlaylist =
          selectedSong.playlistIds?.includes(
            playlist.id
          );

        return (
          <button
            key={playlist.id}
            onClick={(e) => {
              e.stopPropagation();
              addSongToPlaylist(
                selectedSong.id,
                playlist.id
              );

              setMenuSongId(null);
            }}
          >
            {alreadyInPlaylist
              ? `✓ ${playlist.name}`
              : `+ ${playlist.name}`}
          </button>
        );
      })} */}

      <hr />

<button
  onClick={(e) => {
    e.stopPropagation();
    openSpotify(selectedSong);
    setMenuSongId(null);
  }}
>
  <Music2 size={16} />
  Spotify
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    openYouTubeMusic(selectedSong);
    setMenuSongId(null);
  }}
>
  <PlayCircle size={16} />
  YT Music
</button>

<hr />

<button
  onClick={(e) => {
    e.stopPropagation();
    deleteSong(selectedSong.id);
    setMenuSongId(null);
  }}
>
  Delete Song
</button>

    </div>

  </>

)}

{showCreatePlaylist && (

  <>
    <div
      className="menu-backdrop"
      onClick={() =>
        setShowCreatePlaylist(false)
      }
    />

    <div className="playlist-modal">

      <h3>New Playlist</h3>

      <input
        value={newPlaylistName}
        onChange={(e) =>
          setNewPlaylistName(
            e.target.value
          )
        }
        placeholder="Playlist name"
      />

      <div className="playlist-modal-actions">

        <button className="playlist-cancel-btn"
          onClick={() =>
            setShowCreatePlaylist(false)
          }
        >
          Cancel
        </button>

        <button className="playlist-create-btn"
          onClick={createPlaylist}
        >
          Create
        </button>

      </div>

    </div>
  </>

)}

    </div>
  );
}