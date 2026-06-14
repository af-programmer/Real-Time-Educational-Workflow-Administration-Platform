import Modal from './Modal';
import ProfileTab from './profile/ProfileTab';
import EditProfileTab from './profile/EditProfileTab';
import ChangePasswordTab from './profile/ChangePasswordTab';
import { useProfileModal } from '../../hooks/useProfileModal';

const TABS = ['Profile', 'Edit', 'Change Password'];

export default function ProfileModal({ isOpen, onClose }) {
  const {
    user, tab, setTab, pwStep, setPwStep, saving, currentPw, setCurrentPw,
    avatarFile, uploadingAvatar, fileInputRef, currentAvatar,
    handleSaveProfile, handleAvatarChange, handleAvatarUpload,
    handleVerifyStep, handleChangePassword, handleClose,
  } = useProfileModal(onClose);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="My Profile">
      <div className="flex border-b border-gray-200 -mx-6 px-6 mb-4">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === i ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && <ProfileTab user={user} currentAvatar={currentAvatar} />}
      {tab === 1 && (
        <EditProfileTab
          user={user} currentAvatar={currentAvatar} avatarFile={avatarFile}
          fileInputRef={fileInputRef} saving={saving} uploadingAvatar={uploadingAvatar}
          onAvatarChange={handleAvatarChange} onAvatarUpload={handleAvatarUpload} onSubmit={handleSaveProfile}
        />
      )}
      {tab === 2 && (
        <ChangePasswordTab
          saving={saving} pwStep={pwStep} setPwStep={setPwStep} setCurrentPw={setCurrentPw}
          onVerifyStep={handleVerifyStep} onChangePassword={handleChangePassword}
        />
      )}
    </Modal>
  );
}
