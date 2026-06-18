import "./Skeleton.css";

const HEIGHTS = [120, 140, 110, 130, 120, 115];

export default function NotesSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{
          height: HEIGHTS[i % HEIGHTS.length],
          borderRadius: 24,
          marginBottom: 16
        }} />
      ))}
    </>
  );
}