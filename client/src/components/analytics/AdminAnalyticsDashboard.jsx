import { useEffect, useState, useMemo } from 'react';
import analyticsApi from '../../api/analyticsApi';
import BarChart from './BarChart';
import ChartCard from './ChartCard';

export default function AdminAnalyticsDashboard() {
  const [grades, setGrades] = useState([]);
  const [prints, setPrints] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingPrints, setLoadingPrints] = useState(true);
  const [errorGrades, setErrorGrades] = useState(false);
  const [errorPrints, setErrorPrints] = useState(false);

  useEffect(() => {
    let mounted = true;
    analyticsApi.getGrades()
      .then((res) => { if (mounted) setGrades(res.data.data); })
      .catch(() => { if (mounted) setErrorGrades(true); })
      .finally(() => { if (mounted) setLoadingGrades(false); });
    analyticsApi.getPrintRequests()
      .then((res) => { if (mounted) setPrints(res.data.data); })
      .catch(() => { if (mounted) setErrorPrints(true); })
      .finally(() => { if (mounted) setLoadingPrints(false); });
    return () => { mounted = false; };
  }, []);

  const avgGrade = useMemo(() => {
    if (!grades.length) return '—';
    const totalCount = grades.reduce((s, g) => s + Number(g.count), 0);
    if (!totalCount) return '—';
    const weighted = grades.reduce((s, g) => s + Number(g.averageGrade) * Number(g.count), 0);
    return `${Math.round(weighted / totalCount)}%`;
  }, [grades]);

  const totalEntries = useMemo(() => grades.reduce((s, g) => s + Number(g.count), 0), [grades]);
  const totalPrints = useMemo(() => prints.reduce((s, p) => s + Number(p.requests), 0), [prints]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Analytics Dashboard</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Grades Analytics" subtitle="Average grade (%) per class"
          badge={avgGrade} badgeColor="text-indigo-600"
          loading={loadingGrades} error={errorGrades} empty={!grades.length}
          chart={<BarChart data={grades} valueKey="averageGrade" labelKey="className" color="#6366f1" maxValue={100} />}
          footer={totalEntries > 0 ? `Based on ${totalEntries} grade entries across ${grades.length} classes` : null}
        />
        <ChartCard
          title="Print Requests Analytics" subtitle="Request volume trend — last 6 months"
          badge={totalPrints} badgeColor="text-emerald-600"
          loading={loadingPrints} error={errorPrints} empty={!prints.length}
          chart={<BarChart data={prints} valueKey="requests" labelKey="month" color="#10b981" />}
          footer={prints.length > 0 ? `Across ${prints.length} months tracked` : null}
        />
      </div>
    </div>
  );
}
