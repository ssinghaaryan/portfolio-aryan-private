import "./Skeleton.css";

export default function IdeasSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          marginBottom: 10,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,.05)"
        }}>
          <div className="skeleton" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="skeleton" style={{ height: 13, width: "70%" }} />
            <div className="skeleton" style={{ height: 10, width: "35%" }} />
          </div>
          <div className="skeleton" style={{ height: 18, width: 45, borderRadius: 999 }} />
        </div>
      ))}
    </>
  );
}