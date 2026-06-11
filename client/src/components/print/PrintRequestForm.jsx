import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import FileSection from './FileSection';
import { usePrintRequestForm } from '../../hooks/usePrintRequestForm';
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
  const { subjects, classes, selectedClasses, files, setFiles, libraryFiles, selectedLibraryFile, setSelectedLibraryFile, submitting, totalCopies, toggleClass, onSubmit } = usePrintRequestForm();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { priority: 'normal' } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label className="label">Subject *</label>
        <select {...register('subject_id')} className="input">
          <option value="">Select subject...</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {errors.subject_id && <p className="text-red-500 text-xs mt-1">{errors.subject_id.message}</p>}
      </div>

      <div>
        <label className="label">Priority *</label>
        <div className="grid grid-cols-3 gap-3">
          {['normal', 'important', 'urgent'].map((p) => (
            <label key={p} className="cursor-pointer">
              <input {...register('priority')} type="radio" value={p} className="peer sr-only" />
              <div className={`rounded-xl border-2 p-3 text-center text-sm font-medium transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 ${p === 'urgent' ? 'peer-checked:!border-red-500 peer-checked:!bg-red-50' : ''} ${p === 'important' ? 'peer-checked:!border-yellow-500 peer-checked:!bg-yellow-50' : ''}`}>
                {p === 'urgent' ? '🚨' : p === 'important' ? '⚠️' : '📄'} {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            </label>
          ))}
        </div>
      </div>

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

      <div>
        <label className="label">Select Classes *</label>
        {classes.length === 0 ? <p className="text-sm text-gray-400">No classes assigned to you yet.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {classes.map((cls) => {
              const isSelected = selectedClasses.find((c) => c.id === cls.id);
              return (
                <button key={cls.id} type="button" onClick={() => toggleClass(cls)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="font-semibold text-sm text-gray-900">{cls.name}</p>
                  <p className="text-xs text-gray-500">{cls.student_count} students</p>
                </button>
              );
            })}
          </div>
        )}
        {selectedClasses.length > 0 && (
          <div className="mt-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-sm font-medium text-primary-800">Total Copies: <span className="text-2xl font-bold">{totalCopies}</span></p>
            <p className="text-xs text-primary-600 mt-0.5">Classes: {selectedClasses.map((c) => c.name).join(', ')}</p>
          </div>
        )}
      </div>

      <div>
        <label className="label">Notes for Secretary</label>
        <textarea {...register('notes')} rows={3} className="input resize-none" placeholder="Any additional instructions..." />
      </div>

      <FileSection files={files} setFiles={setFiles} libraryFiles={libraryFiles} selectedLibraryFile={selectedLibraryFile} setSelectedLibraryFile={setSelectedLibraryFile} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">Submit Print Request</Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/teacher/print-requests')}>Cancel</Button>
      </div>
    </form>
  );
}
