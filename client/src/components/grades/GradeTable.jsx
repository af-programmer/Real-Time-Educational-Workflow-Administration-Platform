import { format } from 'date-fns';
import Table from '../common/Table';
import Badge from '../common/Badge';

function gradeColor(grade, maxGrade) {
  const pct = (grade / maxGrade) * 100;
  if (pct >= 85) return 'text-green-600 font-bold';
  if (pct >= 70) return 'text-blue-600 font-semibold';
  if (pct >= 55) return 'text-yellow-600';
  return 'text-red-600';
}

export default function GradeTable({ grades, loading }) {
  const columns = [
    { key: 'student_name', header: 'Student' },
    { key: 'subject_name', header: 'Subject' },
    { key: 'class_name', header: 'Class' },
    {
      key: 'grade', header: 'Grade',
      render: (grade, row) => (
        <span className={gradeColor(grade, row.max_grade)}>
          {grade} / {row.max_grade}
        </span>
      ),
    },
    {
      key: 'exam_type', header: 'Type',
      render: (type) => <span className="capitalize text-xs bg-gray-100 rounded-full px-2 py-0.5">{type}</span>,
    },
    {
      key: 'date', header: 'Date',
      render: (date) => format(new Date(date), 'dd MMM yyyy'),
    },
    {
      key: 'notes', header: 'Notes',
      render: (notes) => notes
        ? <span className="text-xs text-gray-500 line-clamp-1 max-w-[150px]">{notes}</span>
        : <span className="text-gray-300">—</span>,
    },
  ];

  return <Table columns={columns} data={grades} loading={loading} emptyMessage="No grades recorded yet." />;
}
