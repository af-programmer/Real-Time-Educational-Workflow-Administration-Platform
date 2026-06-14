import { useState, useRef } from 'react';
import useAuthStore from '../store/authStore';
import apiFetch from '../api/apiFetch';
import { usersApi } from '../api/usersApi';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useProfileModal(onClose) {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [pwStep, setPwStep] = useState(1);
  const [currentPw, setCurrentPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  async function handleSaveProfile(data) {
    setSaving(true);
    try {
      const res = await apiFetch.put('/users/me', { name: data.name, phone: data.phone, phone2: data.phone2 });
      updateUser({ name: res.data.data.name, phone: res.data.data.phone, phone2: res.data.data.phone2 });
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message || 'Failed to update profile.'); }
    finally { setSaving(false); }
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleAvatarUpload() {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', avatarFile);
      const res = await usersApi.uploadAvatar(fd);
      updateUser({ avatar_url: res.data.data.avatar_url });
      setAvatarPreview(null); setAvatarFile(null);
      toast.success('Profile photo updated!');
    } catch (err) { toast.error(err.message || 'Failed to upload photo.'); }
    finally { setUploadingAvatar(false); }
  }

  async function handleVerifyStep(data) {
    setSaving(true);
    try {
      await apiFetch.post('/auth/verify-password', { password: data.currentPassword });
      setCurrentPw(data.currentPassword); setPwStep(2);
    } catch (err) {
      toast.error(err.status === 401 ? 'Current password is incorrect.' : err.message || 'Verification failed.');
    } finally { setSaving(false); }
  }

  async function handleChangePassword(data) {
    if (data.newPassword !== data.confirmPassword) { toast.error('Passwords do not match.'); return; }
    setSaving(true);
    try {
      await apiFetch.put('/auth/change-password', { currentPassword: currentPw, newPassword: data.newPassword });
      toast.success('Password changed successfully!'); setPwStep(1); setCurrentPw('');
    } catch (err) {
      if (err.status === 401) { toast.error('Current password is incorrect.'); setPwStep(1); setCurrentPw(''); }
      else toast.error(err.message || 'Failed to change password.');
    } finally { setSaving(false); }
  }

  function handleClose() {
    setPwStep(1); setCurrentPw(''); setTab(0); setAvatarPreview(null); setAvatarFile(null); onClose();
  }

  return {
    user, tab, setTab, pwStep, setPwStep, saving, currentPw, setCurrentPw,
    avatarFile, uploadingAvatar, fileInputRef,
    currentAvatar: avatarPreview || (user?.avatar_url ? `${API_BASE}${user.avatar_url}` : null),
    handleSaveProfile, handleAvatarChange, handleAvatarUpload, handleVerifyStep, handleChangePassword, handleClose,
  };
}
