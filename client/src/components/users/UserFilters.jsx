import Button from '../common/Button';

export default function UserFilters({ filters, setFilters, onCreateClick }) {
  return (
    <div className="card p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label className="label">Role</label>
        <select
          value={filters.role}
          onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value, page: 1 }))}
          className="input"
        >
          <option value="">All Roles</option>
          <option value="teacher">Teacher</option>
          <option value="secretary">Secretary</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label className="label">Search</label>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          className="input"
          placeholder="Name or email..."
        />
      </div>
      <Button onClick={onCreateClick} className="ml-auto">+ New User</Button>
    </div>
  );
}
