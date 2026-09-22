import { useEffect, useState, useCallback } from "react";
import "./App.css";
import LeadForm from "./components/LeadForm";
import LeadList from "./components/LeadList";
import SearchBar from "./components/SearchBar";
import { fetchLeads, createLead, updateLeadStatus } from "./api/leads";
import type { Lead, LeadStatus, NewLead } from "./types/lead";

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLeads(search, status);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(loadLeads, 300);
    return () => clearTimeout(timeout);
  }, [loadLeads]);

  async function handleCreate(lead: NewLead) {
    await createLead(lead);
    await loadLeads();
  }

  async function handleStatusChange(id: string, newStatus: LeadStatus) {
    const previous = leads;
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l)));
    try {
      await updateLeadStatus(id, newStatus);
    } catch (err) {
      setLeads(previous);
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Lead Tracker</h1>
      </header>

      <LeadForm onCreate={handleCreate} />

      <SearchBar search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />

      {error && <p className="error">{error}</p>}

      <LeadList leads={leads} loading={loading} onStatusChange={handleStatusChange} />
    </div>
  );
}

export default App;
