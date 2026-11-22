import express from "express";

import supplierRoutes from "./routes/supplier.routes";
import hotelRoutes from "./routes/hotel.routes";

const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    message: "Hotel Offer Orchestrator is running",
  });
});

// Main hotel API
app.use("/api", hotelRoutes);

// Mock supplier APIs
app.use("/", supplierRoutes);

export default app;
