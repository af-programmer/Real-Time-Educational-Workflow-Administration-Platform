import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';

export default function ChangePasswordTab({ saving, pwStep, setPwStep, setCurrentPw, onVerifyStep, onChangePassword }) {
  const { register: reg1, handleSubmit: hs1, reset: reset1 } = useForm();
  const { register: reg2, handleSubmit: hs2, watch, reset: reset2 } = useForm();
  const newPw = watch('newPassword', '');

  useEffect(() => {
    reset1();
    reset2();
  }, [pwStep, reset1, reset2]);

  if (pwStep === 1) {
    return (
      <form onSubmit={hs1(onVerifyStep)} className="space-y-4">
        <p className="text-sm text-gray-500">Enter your current password to continue.</p>
        <div>
          <label className="label">Current Password</label>
          <input
            {...reg1('currentPassword', { required: true })}
            type="password" className="input" autoComplete="current-password"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Next</Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={hs2(onChangePassword)} className="space-y-4" autoComplete="off">
      <p className="text-sm text-gray-500">Choose a strong new password (minimum 8 characters).</p>
      <div>
        <label className="label">New Password</label>
        <input
          {...reg2('newPassword', { required: true, minLength: 8 })}
          type="password" className="input" autoComplete="new-password"
        />
      </div>
      <div>
        <label className="label">Confirm New Password</label>
        <input
          {...reg2('confirmPassword', { required: true, validate: (v) => v === newPw || 'Passwords do not match' })}
          type="password" className="input" autoComplete="new-password"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" type="button" onClick={() => { setPwStep(1); setCurrentPw(''); }}>
          Back
        </Button>
        <Button type="submit" loading={saving}>Change Password</Button>
      </div>
    </form>
  );
}
