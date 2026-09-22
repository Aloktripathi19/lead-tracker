import { useState } from "react";
import type { FormEvent } from "react";
import type { NewLead } from "../types/lead";

interface Props {
  onCreate: (lead: NewLead) => Promise<void>;
}

export default function LeadForm({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <h2>Add Lead</h2>
      <div className="form-row">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Lead"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
