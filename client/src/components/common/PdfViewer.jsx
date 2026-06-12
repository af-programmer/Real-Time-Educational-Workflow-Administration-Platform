import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Unified PDF viewer modal.
 * Accepts either a `url` (string) or a `blobData` (ArrayBuffer/Blob) — not both.
 * The caller is responsible for revoking the blob URL when the modal closes
 * (pass onClose handler to clean up if needed).
 */
export default function PdfViewer({ url, blobData, title = 'Document', onClose }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const src = objectUrl || url;

  useEffect(() => {
    if (blobData) {
      try {
        const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: 'application/pdf' });
        const created = URL.createObjectURL(blob);
        setObjectUrl(created);
        return () => URL.revokeObjectURL(created);
      } catch {
        setError(true);
      }
    }
  }, [blobData]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/80 backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 text-white flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg">📄</span>
          <span className="font-medium truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {src && (
            <a
              href={src}
              download={title}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
            >
              Download
            </a>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close viewer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Viewer body */}
      <div className="flex-1 relative overflow-hidden">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm gap-3">
            <svg className="animate-spin h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading document…
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
            <span className="text-5xl">⚠️</span>
            <p className="text-lg font-medium">Unable to load document</p>
            {src && (
              <a href={src} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm">
                Open in new tab
              </a>
            )}
          </div>
        ) : src ? (
          <iframe
            src={src}
            title={title}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        ) : null}
      </div>
    </div>,
    document.body
  );
}
