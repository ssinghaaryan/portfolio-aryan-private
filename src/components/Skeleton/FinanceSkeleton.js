import "./Skeleton.css";

export default function FinanceSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          marginBottom: "8px"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="skeleton" style={{ height: 13, width: 120 }} />
            <div className="skeleton" style={{ height: 11, width: 80 }} />
          </div>
          <div className="skeleton" style={{ height: 16, width: 70, borderRadius: 8 }} />
        </div>
      ))}
    </>
  );
}