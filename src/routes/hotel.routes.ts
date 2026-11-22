import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { getTemporalClient } from "../config/temporal";
import { connectRedis } from "../config/redis";
import {
  getHotelsFromRedis,
  saveHotelsToRedis,
} from "../services/redis.service";

const router = Router();

const TASK_QUEUE = "hotel-task-queue";

router.get("/hotels", async (req: Request, res: Response) => {
  const city = req.query.city;

  if (typeof city !== "string" || !city.trim()) {
    return res.status(400).json({
      success: false,
      message: "City parameter is required",
    });
  }

  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  const min = minPrice === undefined ? undefined : Number(minPrice);

  const max = maxPrice === undefined ? undefined : Number(maxPrice);

  if (
    (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
    (max !== undefined && (!Number.isFinite(max) || max < 0))
  ) {
    return res.status(400).json({
      success: false,
      message: "Prices must be valid non-negative numbers",
    });
  }

  if (min !== undefined && max !== undefined && min > max) {
    return res.status(400).json({
      success: false,
      message: "minPrice cannot be greater than maxPrice",
    });
  }

  try {
    await connectRedis();

    const normalizedCity = city.trim().toLowerCase();

    // Check whether city data already exists in Redis
    const cachedHotels = await getHotelsFromRedis(normalizedCity);

    if (cachedHotels.length === 0) {
      const client = await getTemporalClient();

      const hotels = await client.workflow.execute("hotelOfferWorkflow", {
        taskQueue: TASK_QUEUE,
        workflowId: `hotel-offers-${normalizedCity}-${randomUUID()}`,
        args: [normalizedCity],
      });

      // Save deduplicated results in Redis
      await saveHotelsToRedis(normalizedCity, hotels);
    }

    // Redis performs the price filtering
    const filteredHotels = await getHotelsFromRedis(normalizedCity, min, max);

    return res.status(200).json(filteredHotels);
  } catch (error) {
    console.error("Hotel API error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotel offers",
    });
  }
});

export default router;
