import "./Skeleton.css";

export default function MusicSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "12px 16px",
          marginBottom: "4px"
        }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="skeleton" style={{ height: 14, width: "65%" }} />
            <div className="skeleton" style={{ height: 11, width: "40%" }} />
          </div>
        </div>
      ))}
    </>
  );
}