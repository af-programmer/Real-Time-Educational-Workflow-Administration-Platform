import { useState, useEffect, useCallback } from 'react';
import { gradesApi } from '../api/gradesApi';
import toast from 'react-hot-toast';

export function useMyClasses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gradesApi.getMyClasses()
      .then((res) => setData(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useGradeActions() {
  const [submitting, setSubmitting] = useState(false);

  const submitGrade = useCallback(async (payload, onSuccess) => {
    setSubmitting(true);
    try {
      const { class_id, ...data } = payload;
      await gradesApi.create(data);
      toast.success('Grade saved.');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save grade.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateGrade = useCallback(async (id, payload, onSuccess) => {
    setSubmitting(true);
    try {
      await gradesApi.update(id, payload);
      toast.success('Grade updated.');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update grade.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitGrade, updateGrade, submitting };
}
