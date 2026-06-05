import "./header.css";

export default function Header({
  title,
  children,
}) {
  return (
    <div className="section-header">
      <h2>{title}</h2>

      <div className="section-actions">
        {children}
      </div>
    </div>
  );
}