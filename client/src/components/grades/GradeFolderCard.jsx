export default function GradeFolderCard({ icon, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary-200 border border-transparent transition-all cursor-pointer text-center"
    >
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-gray-800 text-sm leading-tight">{label}</p>
      <p className="text-xs text-gray-400">{count}</p>
    </button>
  );
}
