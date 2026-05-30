export const isTrackAuthed = () => {
  return localStorage.getItem("track-auth") === "true";
};

export const setTrackAuthed = () => {
  localStorage.setItem("track-auth", "true");
};

export const clearTrackAuthed = () => {
  localStorage.removeItem("track-auth");
};
