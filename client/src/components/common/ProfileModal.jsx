import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import useAuthStore from '../../store/authStore';
import apiFetch from '../../api/apiFetch';
import { usersApi } from '../../api/usersApi';
import toast from 'react-hot-toast';

const TABS = ['Profile', 'Edit', 'Change Password'];

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [pwStep, setPwStep] = useState(1);
  const [currentPw, setCurrentPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const { register: regEdit, handleSubmit: hsEdit } = useForm({
    values: { name: user?.name || '', phone: user?.phone || '', phone2: user?.phone2 || '' },
  });

  const { register: regPw1, handleSubmit: hsPw1, reset: resetPw1 } = useForm();
  const { register: regPw2, handleSubmit: hsPw2, reset: resetPw2, watch: watchPw2 } = useForm();
  const newPw = watchPw2('newPassword', '');

  const handleSaveProfile = async (data) => {
    setSaving(true);
    try {
      const res = await apiFetch.put('/users/me', { name: data.name, phone: data.phone, phone2: data.phone2 });
      updateUser({ name: res.data.data.name, phone: res.data.data.phone, phone2: res.data.data.phone2 });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const res = await usersApi.uploadAvatar(formData);
      updateUser({ avatar_url: res.data.data.avatar_url });
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleVerifyStep = async (data) => {
    setSaving(true);
    try {
      await apiFetch.post('/auth/verify-password', { password: data.currentPassword });
      setCurrentPw(data.currentPassword);
      setPwStep(2);
    } catch (err) {
      if (err.status === 401) {
        toast.error('Current password is incorrect.');
      } else {
        toast.error(err.message || 'Verification failed.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await apiFetch.post('/auth/change-password', {
        currentPassword: currentPw,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPw1();
      resetPw2();
      setPwStep(1);
      setCurrentPw('');
    } catch (err) {
      if (err.status === 401) {
        toast.error('Current password is incorrect.');
        setPwStep(1);
        setCurrentPw('');
        resetPw1();
      } else {
        toast.error(err.message || 'Failed to change password.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPwStep(1);
    setCurrentPw('');
    setTab(0);
    setAvatarPreview(null);
    setAvatarFile(null);
    resetPw1();
    resetPw2();
    onClose();
  };

  const roleLabel = user?.role === 'Educator'
    ? 'EDUCATOR'
    : user?.role === 'teacher'
      ? 'Professional Teacher'
      : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '');

  const roleVariant = user?.role === 'Educator'
    ? 'Educator'
    : user?.role === 'teacher'
      ? 'professional_teacher'
      : (user?.role || 'default');

  const currentAvatar = avatarPreview || (user?.avatar_url ? `${apiBase}${user.avatar_url}` : null);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="My Profile">
      <div className="flex border-b border-gray-200 -mx-6 px-6 mb-4">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === i
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt={user?.name}
                className="h-16 w-16 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-2xl font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm pt-1">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Role</p>
              <Badge label={roleLabel} variant={roleVariant} />
            </div>
            {user?.phone && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Phone</p>
                <p className="text-gray-700">{user.phone}</p>
              </div>
            )}
            {user?.phone2 && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Phone 2</p>
                <p className="text-gray-700">{user.phone2}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 1 && (
        <form onSubmit={hsEdit(handleSaveProfile)} className="space-y-4">
          {/* Avatar upload */}
          <div>
            <label className="label">Profile Photo</label>
            <div className="flex items-center gap-4 mt-1">
              {currentAvatar ? (
                <img src={currentAvatar} alt="avatar" className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-primary-700 text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Choose Photo
                </Button>
                {avatarFile && (
                  <Button type="button" size="sm" loading={uploadingAvatar} onClick={handleAvatarUpload}>
                    Upload
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="label">Full Name</label>
            <input {...regEdit('name', { required: true, minLength: 2 })} className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...regEdit('phone')} type="tel" className="input" placeholder="+1 555..." />
          </div>
          <div>
            <label className="label">Phone 2</label>
            <input {...regEdit('phone2')} type="tel" className="input" placeholder="+1 555..." />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      )}

      {tab === 2 && (
        <div>
          {pwStep === 1 ? (
            <form onSubmit={hsPw1(handleVerifyStep)} className="space-y-4">
              <p className="text-sm text-gray-500">Enter your current password to continue.</p>
              <div>
                <label className="label">Current Password</label>
                <input
                  {...regPw1('currentPassword', { required: true })}
                  type="password"
                  className="input"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={saving}>Next</Button>
              </div>
            </form>
          ) : (
            <form onSubmit={hsPw2(handleChangePassword)} className="space-y-4">
              <p className="text-sm text-gray-500">Choose a strong new password (minimum 8 characters).</p>
              <div>
                <label className="label">New Password</label>
                <input
                  {...regPw2('newPassword', { required: true, minLength: 8 })}
                  type="password"
                  className="input"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input
                  {...regPw2('confirmPassword', {
                    required: true,
                    validate: (v) => v === newPw || 'Passwords do not match',
                  })}
                  type="password"
                  className="input"
                  autoComplete="new-password"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => { setPwStep(1); setCurrentPw(''); resetPw1(); }}
                >
                  Back
                </Button>
                <Button type="submit" loading={saving}>Change Password</Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
