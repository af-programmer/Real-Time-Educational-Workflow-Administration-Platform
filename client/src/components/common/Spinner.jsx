import clsx from 'clsx';
import { spinnerSizes } from '../../styles/variantClasses';

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <svg
        className={clsx('animate-spin text-primary-600', spinnerSizes[size])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 text-sm">Loading EduFlow...</p>
      </div>
    </div>
  );
}
