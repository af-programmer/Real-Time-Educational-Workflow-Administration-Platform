import { useState, useEffect } from 'react';
import apiFetch from '../../api/apiFetch';

export default function DailyQuote({ role }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch.get(`/quotes/daily?role=${role}`)
      .then((r) => setQuote(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role]);

  function fetchRandom() {
    apiFetch.get(`/quotes/random?role=${role}&excludeId=${quote?.id ?? 0}`)
      .then((r) => { if (r.data.data) setQuote(r.data.data); })
      .catch(() => {});
  }

  if (loading || !quote) return null;

  return (
    <div className="card p-5 bg-white border-r-4 border-primary-400 flex items-start gap-4" dir="rtl">
      <span className="text-3xl mt-0.5">💡</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">Quote of the Day</p>
        <p className="text-gray-800 font-medium leading-relaxed text-sm">"{quote.text}"</p>
      </div>
      <button
        onClick={fetchRandom}
        title="Give me another quote"
        className="shrink-0 text-primary-500 hover:text-primary-700 transition-colors text-xl mt-0.5"
      >
        🔄
      </button>
    </div>
  );
}
