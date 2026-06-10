import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ClassesStudents from '../../components/common/ClassesStudents';
import Spinner from '../../components/common/Spinner';

export default function HomeroomGrades() {
  const [classIds, setClassIds] = useState(null);

  useEffect(() => {
    axiosInstance.get('/teachers/me')
      .then((r) => setClassIds((r.data.data?.homeroomClasses || []).map((c) => c.id)))
      .catch(() => setClassIds([]));
  }, []);

  if (classIds === null) return <Spinner className="py-20" />;
  if (!classIds.length) return <p className="text-gray-400 text-sm py-10 text-center">No homeroom class assigned.</p>;

  return <ClassesStudents filterClassIds={classIds} readOnly />;
}
