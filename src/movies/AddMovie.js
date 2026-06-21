import React, { useState } from "react";
import { Star, Search } from "lucide-react";
import "./AddMovie.css";

export default function AddMovie({ onSave, onClose, editMode, existingItem }) {
  const [step, setStep] = useState(editMode ? "details" : "search");
  const [searchType, setSearchType] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(existingItem || null);
  const [rating, setRating] = useState(existingItem?.rating || 0);
  const [review, setReview] = useState(existingItem?.review || "");
  const [status, setStatus] = useState(existingItem?.status || "plan_to_watch");

  const searchMovies = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/movie-search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const selectMovie = (movie) => {
    setSelected({
      tmdbId: movie.tmdbId,
      title: movie.title,
      posterPath: movie.posterPath,
      type: searchType
    });
    setStep("details");
  };

  const handleSave = () => {
    onSave({
      ...selected,
      rating,
      review: review.trim(),
      status
    });
  };

  return (
    <div className="add-movie-overlay" onClick={onClose}>
      <div className="add-movie-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="add-movie-handle" />

        {step === "search" && (
          <>
            <h3 className="add-movie-heading">Find a Movie or TV Show</h3>

            <div className="add-movie-type-toggle">
              <button
                className={`add-movie-type-btn ${searchType === "movie" ? "active" : ""}`}
                onClick={() => { setSearchType("movie"); setResults([]); }}
              >
                Movie
              </button>
              <button
                className={`add-movie-type-btn ${searchType === "tv" ? "active" : ""}`}
                onClick={() => { setSearchType("tv"); setResults([]); }}
              >
                TV Series
              </button>
            </div>

            <div className="add-movie-search-row">
              <input
                className="add-movie-input"
                placeholder={`Search ${searchType === "tv" ? "TV shows" : "movies"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchMovies()}
                autoFocus
              />
              <button className="add-movie-search-btn" onClick={searchMovies}>
                <Search size={18} />
              </button>
            </div>

            <div className="add-movie-results">
              {searching && <div className="add-movie-loading">Searching...</div>}
              {results.map((movie) => (
                <div
                  key={movie.tmdbId}
                  className="add-movie-result"
                  onClick={() => selectMovie(movie)}
                >
                  {movie.posterPath ? (
                    <img src={movie.posterPath} alt={movie.title} className="add-movie-result-poster" />
                  ) : (
                    <div className="add-movie-result-poster-placeholder">{movie.title?.[0]}</div>
                  )}
                  <div className="add-movie-result-info">
                    <div className="add-movie-result-title">{movie.title}</div>
                    <div className="add-movie-result-year">
                      {movie.releaseDate?.slice(0, 4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "details" && selected && (
          <>
            <h3 className="add-movie-heading">{selected.title}</h3>

            {selected.posterPath && (
              <img src={selected.posterPath} alt={selected.title} className="add-movie-selected-poster" />
            )}

            {/* Status toggle */}
            <div className="add-movie-status-toggle">
              <button
                className={`add-movie-status-btn ${status === "watched" ? "active" : ""}`}
                onClick={() => setStatus("watched")}
              >
                Watched
              </button>
              <button
                className={`add-movie-status-btn ${status === "plan_to_watch" ? "active" : ""}`}
                onClick={() => setStatus("plan_to_watch")}
              >
                Plan to Watch
              </button>
            </div>

            {/* Rating — only if watched */}
            {status === "watched" && (
              <div className="add-movie-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    className="add-movie-star-btn"
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      size={28}
                      fill={i < rating ? "#ffaa00" : "none"}
                      color={i < rating ? "#ffaa00" : "rgba(255,255,255,.2)"}
                    />
                  </button>
                ))}
              </div>
            )}

            <textarea
              className="add-movie-textarea"
              placeholder="What did you think?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
            />

            <div className="add-movie-actions">
              <button className="add-movie-cancel" onClick={onClose}>Cancel</button>
              <button className="add-movie-save" onClick={handleSave}>
                {editMode ? "Save Changes" : "Add"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}