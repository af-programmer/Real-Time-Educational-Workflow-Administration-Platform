export default function LibrarySubjectGroup({ subjectName, files, onPrint, onDownload, onEdit, onDelete }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">📁 {subjectName}</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {files.map((f) => (
          <div key={f.id} className="flex items-center gap-3 px-5 py-3">
            <span className="text-xl">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{f.original_name}</p>
              {f.description && <p className="text-xs text-gray-500">{f.description}</p>}
              <p className="text-xs text-gray-400">{(f.file_size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="flex gap-2 flex-shrink-0 items-center">
              <button onClick={() => onPrint(f)} title="Print this file" className="text-lg hover:scale-110 transition-transform">🖨️</button>
              <button onClick={() => onDownload(f)} title="Download" className="text-lg hover:scale-110 transition-transform">⬇️</button>
              <button onClick={() => onEdit(f)} title="Edit" className="text-lg hover:scale-110 transition-transform">✏️</button>
              <button onClick={() => onDelete(f.id)} title="Delete" className="text-lg hover:scale-110 transition-transform text-red-400 hover:text-red-600">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
