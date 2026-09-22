import { LEAD_STATUSES } from "../types/lead";

interface Props {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function SearchBar({ search, status, onSearchChange, onStatusChange }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name, email or phone"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
