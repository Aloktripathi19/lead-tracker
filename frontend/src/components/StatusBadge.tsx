import type { LeadStatus } from "../types/lead";

const COLORS: Record<LeadStatus, string> = {
  New: "#6b7280",
  Contacted: "#2563eb",
  Qualified: "#0891b2",
  Won: "#16a34a",
  Lost: "#dc2626",
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className="status-badge" style={{ backgroundColor: COLORS[status] }}>
      {status}
    </span>
  );
}
