import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../common/Button';
import { useGradeActions } from '../../hooks/useGrades';

const schema = z.object({
  class_id: z.string().optional(),
  student_id: z.string().min(1, 'Student required'),
  subject_id: z.string().min(1, 'Subject required'),
  grade: z.coerce.number().min(0).max(200),
  max_grade: z.coerce.number().min(1).max(200).default(100),
  date: z.string().min(1, 'Date required'),
  exam_type: z.string().default('test'),
  notes: z.string().optional(),
});

export default function GradeEntry({ classes, subjects, onSuccess }) {
  const { submitGrade, submitting } = useGradeActions();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { max_grade: 100, exam_type: 'test' },
  });

  const selectedClassId = watch('class_id');
  const selectedClass = classes.find((c) => c.id === parseInt(selectedClassId));

  const onSubmit = (data) => {
    submitGrade(data, () => {
      reset();
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Class selector (UI only - filters students) */}
      <div>
        <label className="label">Class</label>
        <select {...register('class_id')} className="input">
          <option value="">Select class...</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Student */}
      <div>
        <label className="label">Student *</label>
        <select {...register('student_id')} className="input">
          <option value="">Select student...</option>
          {(selectedClass?.students || []).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id.message}</p>}
      </div>

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

      {/* Grade & Max Grade */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Grade *</label>
          <input {...register('grade')} type="number" step="0.5" min="0" max="200" className="input" placeholder="85" />
          {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
        </div>
        <div>
          <label className="label">Max Grade</label>
          <input {...register('max_grade')} type="number" step="0.5" min="1" max="200" className="input" />
        </div>
      </div>

      {/* Date & Exam Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Date *</label>
          <input {...register('date')} type="date" className="input" />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="label">Exam Type</label>
          <select {...register('exam_type')} className="input">
            <option value="test">Test</option>
            <option value="quiz">Quiz</option>
            <option value="exam">Final Exam</option>
            <option value="project">Project</option>
            <option value="homework">Homework</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <input {...register('notes')} type="text" className="input" placeholder="Optional comment..." />
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        Save Grade
      </Button>
    </form>
  );
}
