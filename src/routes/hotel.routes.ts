import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { getTemporalClient } from "../config/temporal";

const router = Router();

const TASK_QUEUE = "hotel-task-queue";

router.get("/hotels", async (req: Request, res: Response) => {
  const city = req.query.city;

  // Validate city
  if (typeof city !== "string" || !city.trim()) {
    return res.status(400).json({
      success: false,
      message: "City parameter is required",
    });
  }

  try {
    const client = await getTemporalClient();

    const normalizedCity = city.trim().toLowerCase();

    console.log(`Starting workflow for ${normalizedCity}`);

    // Start Temporal workflow and wait for result
    const hotels = await client.workflow.execute("hotelOfferWorkflow", {
      taskQueue: TASK_QUEUE,

      workflowId: `hotel-offers-${normalizedCity}-${randomUUID()}`,

      args: [normalizedCity],
    });

    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Hotel API error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotel offers",
    });
  }
});

export default router;
