import clsx from 'clsx';
import { badgeVariants } from '../../styles/variantClasses';

export default function Badge({ label, variant = 'default', pulse = false }) {
  const cls = badgeVariants[variant] || badgeVariants.default;
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
