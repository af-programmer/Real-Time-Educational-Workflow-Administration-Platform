export default function FileUploadSection({ files, setFiles, libraryFiles, selectedLibraryFile, setSelectedLibraryFile }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="label mb-0">Files *</label>
        {libraryFiles.length > 0 && (
          <button type="button" onClick={() => setShowLibrary(!showLibrary)}
            className="text-xs text-primary-600 hover:text-primary-800">
            📚 {showLibrary ? 'Hide Library' : 'Pick from Library'}
          </button>
        )}
      </div>

      {showLibrary && (
        <div className="mb-3 border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
          {libraryFiles.map((f) => (
            <button key={f.id} type="button"
              onClick={() => { setSelectedLibraryFile(f); setShowLibrary(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-0 ${selectedLibraryFile?.id === f.id ? 'bg-primary-50' : ''}`}>
              <span>📄</span>
              <div>
                <p className="font-medium text-gray-900">{f.original_name}</p>
                <p className="text-xs text-gray-400">{f.subject_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedLibraryFile && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl border border-primary-200 mb-2">
          <span>📚</span>
          <span className="text-sm text-primary-800 flex-1 truncate">{selectedLibraryFile.original_name}</span>
          <button type="button" onClick={() => setSelectedLibraryFile(null)}
            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none">&times;</button>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files)])}
          className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-3xl mb-2">📎</div>
          <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PDF, Images, Word, PowerPoint (max 10MB)</p>
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <span>📄</span>
              <span className="flex-1 truncate">{f.name}</span>
              <button type="button" onClick={() => removeFile(i)}
                className="text-red-500 hover:text-red-700 font-bold text-base leading-none">&times;</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
