import React from "react";
import { Star, Check } from "lucide-react";
import "./MovieCard.css";

export default function MovieCard({ item, onMoveToWatched, onEdit, onDelete }) {
  return (
    <div className="movie-card" onClick={() => onEdit(item)}>
      <div className="movie-poster-wrap">
        {item.posterPath ? (
          <img src={item.posterPath} alt={item.title} className="movie-poster" />
        ) : (
          <div className="movie-poster-placeholder">{item.title?.[0]}</div>
        )}

        <span className="movie-type-badge">
          {item.type === "tv" ? "TV" : "Movie"}
        </span>

        {item.status === "plan_to_watch" && (
          <button
            className="movie-watch-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMoveToWatched(item);
            }}
          >
            <Check size={14} />
          </button>
        )}
      </div>

      <div className="movie-info">
        <div className="movie-title">{item.title}</div>
        {item.status === "watched" && item.rating > 0 && (
          <div className="movie-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < item.rating ? "#ffaa00" : "none"}
                color={i < item.rating ? "#ffaa00" : "rgba(255,255,255,.2)"}
              />
            ))}
          </div>
        )}
        {item.status === "plan_to_watch" && (
          <div className="movie-plan-tag">Plan to watch</div>
        )}
      </div>
    </div>
  );
}