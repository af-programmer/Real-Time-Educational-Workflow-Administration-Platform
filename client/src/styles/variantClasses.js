// Visual styling constants extracted from component files.
// Keeping these as JS strings (not CSS @apply) ensures Tailwind's
// content scanner finds every class and generates the correct CSS.

export const buttonVariants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost:     'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  success:   'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
};

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const badgeVariants = {
  urgent:      'bg-red-100 text-red-800 ring-red-200',
  important:   'bg-yellow-100 text-yellow-800 ring-yellow-200',
  normal:      'bg-green-100 text-green-800 ring-green-200',
  pending:     'bg-gray-100 text-gray-700 ring-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 ring-blue-200',
  printed:     'bg-purple-100 text-purple-800 ring-purple-200',
  completed:   'bg-green-100 text-green-800 ring-green-200',
  admin:       'bg-indigo-100 text-indigo-800',
  teacher:     'bg-teal-100 text-teal-800',
  homeroom_teacher: 'bg-purple-100 text-purple-800',
  secretary:   'bg-pink-100 text-pink-800',
  default:     'bg-gray-100 text-gray-700',
};

export const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const sidebarColors = {
  admin:     'from-indigo-800 to-indigo-900',
  secretary: 'from-pink-800 to-pink-900',
  teacher:   'from-primary-800 to-primary-900',
};
