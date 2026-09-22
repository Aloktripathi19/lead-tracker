import type { Lead, LeadStatus, NewLead } from "../types/lead";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchLeads(search: string, status: string): Promise<Lead[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);

  const res = await fetch(`${API_URL}/leads?${params.toString()}`);
  return handleResponse<Lead[]>(res);
}

export async function createLead(lead: NewLead): Promise<Lead> {
  const res = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  return handleResponse<Lead>(res);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const res = await fetch(`${API_URL}/leads/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Lead>(res);
}
