import "./NoteCard.css";
export default function NoteCard({ note, onClick }) {
  return ( 
    <div className="note-card" onClick={onClick} >
      <div className="note-text">
        {note.text}
      </div>

      <div className="note-footer">

  <span className="note-author">
    {note.author}
  </span>

  <span className="note-category">
    {note.category}
  </span>

</div>
        {/* <div className="song-menu-btn">
          ⋯
        </div> */}
      </div>
  );
}