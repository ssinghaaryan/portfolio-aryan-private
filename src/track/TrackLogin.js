import { useState } from "react";
import { setTrackAuthed } from "../utils/trackAuth";

const TrackLogin = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    const res = await fetch("/api/track/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      setTrackAuthed();
      onSuccess();
    } else {
      setError("Wrong password");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30vh" }}>
      <h2>🔒 Track Access</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={login}>Enter</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TrackLogin;
