import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { teachersApi } from '../api/usersApi';
import { libraryApi, printRequestsApi } from '../api/printRequestsApi';
import toast from 'react-hot-toast';

export function usePrintRequestForm() {
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

  useEffect(() => {
    teachersApi.getMySubjects().then((r) => setSubjects(r.data.data || [])).catch(() => {});
    teachersApi.getMyClasses().then((r) => setClasses(r.data.data || [])).catch(() => {});
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

  return { subjects, classes, selectedClasses, files, setFiles, libraryFiles, selectedLibraryFile, setSelectedLibraryFile, submitting, totalCopies, toggleClass, onSubmit };
}
