export default function GradeBreadcrumb({ parts }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300">›</span>}
          {p.onClick ? (
            <button onClick={p.onClick} className="text-primary-600 hover:underline font-medium">
              {p.label}
            </button>
          ) : (
            <span className="text-gray-800 font-semibold">{p.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
