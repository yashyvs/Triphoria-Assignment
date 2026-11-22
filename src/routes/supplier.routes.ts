import { Router, Request, Response } from "express";

import { supplierAHotels, supplierBHotels } from "../suppliers/mockData";

const router = Router();

// Supplier A
router.get("/supplierA/hotels", (req: Request, res: Response) => {
  const city = req.query.city;

  if (typeof city !== "string" || !city.trim()) {
    return res.status(400).json({
      success: false,
      message: "City parameter is required",
    });
  }

  const hotels = supplierAHotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.trim().toLowerCase(),
  );

  return res.status(200).json(hotels);
});

// Supplier B
router.get("/supplierB/hotels", (req: Request, res: Response) => {
  const city = req.query.city;

  if (typeof city !== "string" || !city.trim()) {
    return res.status(400).json({
      success: false,
      message: "City parameter is required",
    });
  }

  const hotels = supplierBHotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.trim().toLowerCase(),
  );

  return res.status(200).json(hotels);
});

export default router;
