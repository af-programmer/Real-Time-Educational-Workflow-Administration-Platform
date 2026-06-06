import { useState, useEffect, useCallback } from 'react';
import { printRequestsApi } from '../api/printRequestsApi';
import toast from 'react-hot-toast';

export function useMyPrintRequests(params = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await printRequestsApi.getMine(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, pagination, loading, error, refetch: fetch };
}

export function useAllPrintRequests(filters = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await printRequestsApi.getAll(filters);
      setData(res.data.data || []);
      setPagination(res.data.pagination);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id, status) => {
    try {
      await printRequestsApi.updateStatus(id, status);
      toast.success('Status updated.');
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return { data, pagination, loading, refetch: fetch, updateStatus };
}
