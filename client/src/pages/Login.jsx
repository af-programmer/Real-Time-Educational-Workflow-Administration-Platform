import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthActions } from '../hooks/useAuth';
import Button from '../components/common/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function Login() {
  const { login, loading } = useAuthActions();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white text-3xl font-bold mb-4">
            E
          </div>
          <h1 className="text-3xl font-bold text-white">EduFlow</h1>
          <p className="text-white/60 mt-2">School Management & Print Automation</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit((d) => login(d.email, d.password))} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="you@school.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                {...register('password')}
                type="password"
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Demo Accounts</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium text-indigo-600">Admin:</span> admin@eduflow.com</p>
              <p><span className="font-medium text-pink-600">Secretary:</span> secretary@eduflow.com</p>
              <p><span className="font-medium text-teal-600">Teacher:</span> teacher1@eduflow.com</p>
              <p className="text-gray-400 mt-1">Password: Password123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
