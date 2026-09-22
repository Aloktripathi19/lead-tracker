import { Router, Request, Response } from "express";
import { Lead, LEAD_STATUSES } from "../models/Lead";

const router = Router();

// GET /api/leads?search=&status=
router.get("/", async (req: Request, res: Response) => {
  const { search, status } = req.query;
  const filter: Record<string, unknown> = {};

  if (search && typeof search === "string") {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  if (status && typeof status === "string" && LEAD_STATUSES.includes(status as any)) {
    filter.status = status;
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.json(leads);
});

// POST /api/leads
router.post("/", async (req: Request, res: Response) => {
  const { name, email, phone, status } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "name, email and phone are required" });
  }

  if (status && !LEAD_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status must be one of ${LEAD_STATUSES.join(", ")}` });
  }

  const lead = await Lead.create({ name, email, phone, status });
  res.status(201).json(lead);
});

// PATCH /api/leads/:id/status
router.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status || !LEAD_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status must be one of ${LEAD_STATUSES.join(", ")}` });
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  res.json(lead);
});

export default router;
