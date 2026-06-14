import "./Skeleton.css";

const HEIGHTS = [180, 220, 160, 240, 190, 170];

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