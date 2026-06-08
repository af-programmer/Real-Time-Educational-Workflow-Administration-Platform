import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import { teacherApi, libraryApi, printRequestsApi } from '../../api/printRequestsApi';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const schema = z.object({
  subject_id: z.string().min(1, 'Subject is required'),
  priority: z.enum(['normal', 'important', 'urgent']),
  lesson_date: z.string().min(1, 'Lesson date is required'),
  lesson_time: z.string().optional(),
  notes: z.string().optional(),
});

function FileSection({ files, setFiles, libraryFiles, selectedLibraryFile, setSelectedLibraryFile }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="label mb-0">Files *</label>
        {libraryFiles.length > 0 && (
          <button type="button" onClick={() => setShowLibrary(!showLibrary)}
            className="text-xs text-primary-600 hover:text-primary-800">
            📚 {showLibrary ? 'Hide Library' : 'Pick from Library'}
          </button>
        )}
      </div>
      {showLibrary && (
        <div className="mb-3 border border-gray-200 rounded-xl max-h-48 overflow-y-auto">
          {libraryFiles.map((f) => (
            <button key={f.id} type="button"
              onClick={() => { setSelectedLibraryFile(f); setShowLibrary(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-0 ${selectedLibraryFile?.id === f.id ? 'bg-primary-50' : ''}`}>
              <span>📄</span>
              <div>
                <p className="font-medium text-gray-900">{f.original_name}</p>
                <p className="text-xs text-gray-400">{f.subject_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {selectedLibraryFile && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl border border-primary-200 mb-2">
          <span>📚</span>
          <span className="text-sm text-primary-800 flex-1 truncate">{selectedLibraryFile.original_name}</span>
          <button type="button" onClick={() => setSelectedLibraryFile(null)}
            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none">&times;</button>
        </div>
      )}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files)])}
          className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-3xl mb-2">📎</div>
          <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PDF, Images, Word, PowerPoint (max 10MB)</p>
        </label>
      </div>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <span>📄</span>
              <span className="flex-1 truncate">{f.name}</span>
              <button type="button" onClick={() => removeFile(i)}
                className="text-red-500 hover:text-red-700 font-bold text-base leading-none">&times;</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PrintRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [files, setFiles] = useState([]);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [selectedLibraryFile, setSelectedLibraryFile] = useState(location.state?.libraryFile || null);
  const [submitting, setSubmitting] = useState(false);
  const totalCopies = selectedClasses.reduce((sum, cls) => sum + cls.student_count, 0);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'normal' },
  });

  useEffect(() => {
    teacherApi.getMySubjects().then((r) => setSubjects(r.data.data || [])).catch(() => {});
    teacherApi.getMyClasses().then((r) => setClasses(r.data.data || [])).catch(() => {});
    libraryApi.getAll().then((r) => setLibraryFiles(r.data.files || [])).catch(() => {});
  }, []);

  const toggleClass = (cls) => setSelectedClasses((prev) =>
    prev.find((c) => c.id === cls.id) ? prev.filter((c) => c.id !== cls.id) : [...prev, cls]
  );

  const onSubmit = async (data) => {
    if (!selectedClasses.length) { toast.error('Please select at least one class.'); return; }
    if (!files.length && !selectedLibraryFile) { toast.error('Please attach a file or select from library.'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      formData.append('class_ids', JSON.stringify(selectedClasses.map((c) => c.id)));
      files.forEach((f) => formData.append('files', f));
      if (selectedLibraryFile) formData.append('library_file_id', selectedLibraryFile.id);
      await printRequestsApi.create(formData);
      toast.success('Print request submitted!');
      navigate('/teacher/print-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    } finally { setSubmitting(false); }
  };

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
              <div className={`rounded-xl border-2 p-3 text-center text-sm font-medium transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50
                ${p === 'urgent' ? 'peer-checked:!border-red-500 peer-checked:!bg-red-50' : ''}
                ${p === 'important' ? 'peer-checked:!border-yellow-500 peer-checked:!bg-yellow-50' : ''}`}>
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

      <FileSection files={files} setFiles={setFiles} libraryFiles={libraryFiles}
        selectedLibraryFile={selectedLibraryFile} setSelectedLibraryFile={setSelectedLibraryFile} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">Submit Print Request</Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/teacher/print-requests')}>Cancel</Button>
      </div>
    </form>
  );
}
