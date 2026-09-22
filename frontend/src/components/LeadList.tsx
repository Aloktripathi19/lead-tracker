import type { Lead, LeadStatus } from "../types/lead";
import { LEAD_STATUSES } from "../types/lead";
import StatusBadge from "./StatusBadge";

interface Props {
  leads: Lead[];
  loading: boolean;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

export default function LeadList({ leads, loading, onStatusChange }: Props) {
  if (loading) return <p className="empty-state">Loading leads...</p>;
  if (leads.length === 0) return <p className="empty-state">No leads found.</p>;

  return (
    <table className="lead-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.phone}</td>
            <td>
              <div className="status-cell">
                <StatusBadge status={lead.status} />
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead._id, e.target.value as LeadStatus)}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td>{new Date(lead.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
