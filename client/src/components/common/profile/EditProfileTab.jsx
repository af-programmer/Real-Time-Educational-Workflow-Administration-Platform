import { useForm } from 'react-hook-form';
import Button from '../Button';

export default function EditProfileTab({ user, currentAvatar, avatarFile, fileInputRef, saving, uploadingAvatar, onAvatarChange, onAvatarUpload, onSubmit }) {
  const { register, handleSubmit } = useForm({
    values: { name: user?.name || '', phone: user?.phone || '', phone2: user?.phone2 || '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Choose Photo
            </Button>
            {avatarFile && (
              <Button type="button" size="sm" loading={uploadingAvatar} onClick={onAvatarUpload}>
                Upload
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="label">Full Name</label>
        <input {...register('name', { required: true, minLength: 2 })} className="input" />
      </div>
      <div>
        <label className="label">Phone</label>
        <input {...register('phone')} type="tel" className="input" placeholder="+1 555..." />
      </div>
      <div>
        <label className="label">Phone 2</label>
        <input {...register('phone2')} type="tel" className="input" placeholder="+1 555..." />
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={saving}>Save Changes</Button>
      </div>
    </form>
  );
}
