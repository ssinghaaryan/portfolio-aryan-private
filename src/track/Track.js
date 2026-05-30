import { useState } from "react";
import TrackLogin from "./TrackLogin";
import TrackPage from "./TrackPage";
import { isTrackAuthed } from "../utils/trackAuth";

const Track = () => {
  const [authed, setAuthed] = useState(isTrackAuthed());

  if (!authed) {
    return <TrackLogin onSuccess={() => setAuthed(true)} />;
  }

  return <TrackPage />;

};

export default Track;
