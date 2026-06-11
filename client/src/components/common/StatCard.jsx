import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon, color, to, alert = false }) {
  const Card = to ? Link : 'div';
  return (
    <Card to={to} className={`card p-5 flex items-center gap-4 ${to ? 'hover:shadow-md transition-shadow cursor-pointer' : ''} ${alert ? 'ring-2 ring-red-400' : ''}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      {alert && value > 0 && (
        <span className="ml-auto flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
      )}
    </Card>
  );
}
