import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usersApi } from '../../api/usersApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function CreateUserModal({ isOpen, onClose, classes, onCreated }) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const selectedRole = watch('role', '');
  const isHomeroom = watch('is_homeroom', false);

  const handleClose = () => { onClose(); reset(); };

  const createUser = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        is_homeroom: data.is_homeroom === true || data.is_homeroom === 'true',
        homeroom_class_ids: data.is_homeroom
          ? (Array.isArray(data.homeroom_class_ids)
              ? data.homeroom_class_ids.map(Number)
              : data.homeroom_class_ids ? [Number(data.homeroom_class_ids)] : [])
          : [],
      };
      delete payload.homeroom_class_id;
      await usersApi.create(payload);
      toast.success('User created!');
      handleClose();
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New User">
      <form onSubmit={handleSubmit(createUser)} className="space-y-4">
        <div>
          <label className="label">Full Name *</label>
          <input {...register('name', { required: true })} className="input" placeholder="John Doe" />
        </div>
        <div>
          <label className="label">Email *</label>
          <input {...register('email', { required: true })} type="email" className="input" />
        </div>
        <div>
          <label className="label">Password *</label>
          <input {...register('password', { required: true, minLength: 8 })} type="password" className="input" />
        </div>
        <div>
          <label className="label">Role *</label>
          <select {...register('role', { required: true })} className="input">
            <option value="">Select role...</option>
            <option value="teacher">Teacher</option>
            <option value="secretary">Secretary</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {selectedRole === 'teacher' && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('is_homeroom')} className="rounded border-gray-300 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Homeroom Teacher (מחנכ/ת)</span>
            </label>
            {isHomeroom && (
              <div>
                <label className="label">Homeroom Classes *</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {classes.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" value={c.id} {...register('homeroom_class_ids')} className="rounded border-gray-300 text-primary-600" />
                      <span className="text-sm text-gray-700">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div>
          <label className="label">Phone</label>
          <input {...register('phone')} type="tel" className="input" placeholder="+1 555..." />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create User</Button>
        </div>
      </form>
    </Modal>
  );
}
