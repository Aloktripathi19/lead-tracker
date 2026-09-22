import { Schema, model, Document } from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost", "Won"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: Date;
}

const leadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  status: { type: String, enum: LEAD_STATUSES, default: "New" },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = model<ILead>("Lead", leadSchema);
