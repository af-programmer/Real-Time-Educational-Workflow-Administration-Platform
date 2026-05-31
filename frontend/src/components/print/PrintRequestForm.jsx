import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import { classesApi, subjectsApi } from '../../api/usersApi';
import { printRequestsApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  subject_id: z.string().min(1, 'Subject is required'),
  priority: z.enum(['normal', 'important', 'urgent']),
  lesson_date: z.string().min(1, 'Lesson date is required'),
  lesson_time: z.string().optional(),
  notes: z.string().optional(),
});

export default function PrintRequestForm() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const totalCopies = selectedClasses.reduce((sum, cls) => sum + cls.student_count, 0);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'normal' },
  });

  useEffect(() => {
    subjectsApi.getAll().then((r) => setSubjects(r.data.data || [])).catch(() => {});
    classesApi.getAll().then((r) => setClasses(r.data.data || [])).catch(() => {});
  }, []);

  const toggleClass = (cls) => {
    setSelectedClasses((prev) =>
      prev.find((c) => c.id === cls.id)
        ? prev.filter((c) => c.id !== cls.id)
        : [...prev, cls]
    );
  };

  const onSubmit = async (data) => {
    if (!selectedClasses.length) {
      toast.error('Please select at least one class.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      formData.append('class_ids', JSON.stringify(selectedClasses.map((c) => c.id)));
      files.forEach((f) => formData.append('files', f));

      await printRequestsApi.create(formData);
      toast.success('Print request submitted!');
      navigate('/teacher/print-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Subject */}
      <div>
        <label className="label">Subject *</label>
        <select {...register('subject_id')} className="input">
          <option value="">Select subject...</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.subject_id && <p className="text-red-500 text-xs mt-1">{errors.subject_id.message}</p>}
      </div>

      {/* Priority */}
      <div>
        <label className="label">Priority *</label>
        <div className="grid grid-cols-3 gap-3">
          {['normal', 'important', 'urgent'].map((p) => (
            <label key={p} className="cursor-pointer">
              <input {...register('priority')} type="radio" value={p} className="peer sr-only" />
              <div className={`rounded-xl border-2 p-3 text-center text-sm font-medium transition-all
                peer-checked:border-primary-500 peer-checked:bg-primary-50
                ${p === 'urgent' ? 'peer-checked:!border-red-500 peer-checked:!bg-red-50' : ''}
                ${p === 'important' ? 'peer-checked:!border-yellow-500 peer-checked:!bg-yellow-50' : ''}
              `}>
                {p === 'urgent' ? '🚨' : p === 'important' ? '⚠️' : '📄'}{' '}
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Lesson Date *</label>
          <input {...register('lesson_date')} type="date" className="input" />
          {errors.lesson_date && <p className="text-red-500 text-xs mt-1">{errors.lesson_date.message}</p>}
        </div>
        <div>
          <label className="label">Lesson Time</label>
          <input {...register('lesson_time')} type="time" className="input" />
        </div>
      </div>

      {/* Classes */}
      <div>
        <label className="label">Select Classes *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {classes.map((cls) => {
            const isSelected = selectedClasses.find((c) => c.id === cls.id);
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => toggleClass(cls)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-sm text-gray-900">{cls.name}</p>
                <p className="text-xs text-gray-500">{cls.student_count} students</p>
              </button>
            );
          })}
        </div>
        {selectedClasses.length > 0 && (
          <div className="mt-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-sm font-medium text-primary-800">
              Total Copies: <span className="text-2xl font-bold">{totalCopies}</span>
            </p>
            <p className="text-xs text-primary-600 mt-0.5">
              Classes: {selectedClasses.map((c) => c.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes for Secretary</label>
        <textarea {...register('notes')} rows={3} className="input resize-none"
          placeholder="Any additional instructions..." />
      </div>

      {/* File Upload */}
      <div>
        <label className="label">Upload Files (PDF, Images, Documents)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-3xl mb-2">📎</div>
            <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Images, Word, PowerPoint (max 10MB)</p>
          </label>
          {files.length > 0 && (
            <ul className="mt-3 space-y-1 text-left">
              {files.map((f, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                  <span>📄</span> {f.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">
          Submit Print Request
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/teacher/print-requests')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
