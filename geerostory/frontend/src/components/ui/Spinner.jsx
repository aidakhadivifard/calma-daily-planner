export default function Spinner({ size = 32, className = '' }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-[3px] border-lavender-200/15 border-t-lavender-300 ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
