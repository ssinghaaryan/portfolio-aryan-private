import React, { useEffect, useState } from "react";
import "./track.css";

const HABITS = [
  { key: "studies", label: "Studies", color: "#4CAF50" },
  { key: "workouts", label: "Workouts", color: "#FF9800" },
  { key: "stocks", label: "Stocks", color: "#2196F3" },
];

const RESET_HOUR = 4; // 4 AM
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getTodayKey = () => {
  const now = new Date();
  if (now.getHours() < RESET_HOUR) {
    now.setDate(now.getDate() - 1);
  }
  return now.toDateString();
};

const TrackPage = () => {
  const [data, setData] = useState({});
  const todayKey = getTodayKey();

  // Load + daily reset
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habit-data")) || {};
    const lastDay = stored.lastDay;

    if (lastDay !== todayKey) {
      HABITS.forEach(h => {
        stored[h.key] = stored[h.key] || { total: 0 };
        stored[h.key].doneToday = false;
      });
      stored.lastDay = todayKey;
    }

    localStorage.setItem("habit-data", JSON.stringify(stored));
    setData(stored);
  }, [todayKey]);

  const completeHabit = (key) => {
  if (data[key]?.doneToday) return;

  const updated = {
    ...data,
    [key]: {
      total: (data[key]?.total || 0) + 1,
      doneToday: true,
    },
  };

  localStorage.setItem("habit-data", JSON.stringify(updated));
  setData(updated);
};

  return (
    <div className="track-container">
      <h1 className="track-title">Daily Habits</h1>

      <div className="rings-wrapper">
        {HABITS.map((habit) => {
  const doneToday = data[habit.key]?.doneToday;

  return (
    <div
      key={habit.key}
      className={`ring-card ${doneToday ? "done animate" : ""}`}
      onClick={() => completeHabit(habit.key)}
    >
      <svg className="progress-ring" width="120" height="120">
        <circle
          className="progress-ring-bg"
          cx="60"
          cy="60"
          r="52"
        />
        <circle
          className="progress-ring-fill"
          cx="60"
          cy="60"
          r="52"
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: doneToday ? 0 : CIRCUMFERENCE
          }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="ring-center-text"
        >
          {data[habit.key]?.total || 0}h
        </text>
      </svg>

      <div className="ring-label">{habit.label}</div>

      {doneToday && <div className="ring-check">✓</div>}
    </div>
  );
        })}
      </div>
    </div>
  );
};

export default TrackPage;
