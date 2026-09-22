export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost", "Won"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

export interface NewLead {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}
