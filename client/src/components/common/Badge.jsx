import clsx from 'clsx';

const variants = {
  urgent: 'bg-red-100 text-red-800 ring-red-200',
  important: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  normal: 'bg-green-100 text-green-800 ring-green-200',
  pending: 'bg-gray-100 text-gray-700 ring-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 ring-blue-200',
  printed: 'bg-purple-100 text-purple-800 ring-purple-200',
  completed: 'bg-green-100 text-green-800 ring-green-200',
  admin: 'bg-indigo-100 text-indigo-800',
  teacher: 'bg-teal-100 text-teal-800',
  secretary: 'bg-pink-100 text-pink-800',
  default: 'bg-gray-100 text-gray-700',
};

export default function Badge({ label, variant = 'default', pulse = false }) {
  const cls = variants[variant] || variants.default;
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
      cls
    )}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            variant === 'urgent' ? 'bg-red-500' : 'bg-current')} />
          <span className={clsx('relative inline-flex rounded-full h-2 w-2',
            variant === 'urgent' ? 'bg-red-600' : 'bg-current')} />
        </span>
      )}
      {label}
    </span>
  );
}
