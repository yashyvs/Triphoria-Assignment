import express from "express";
import supplierRoutes from "./routes/supplier.routes";

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

// Supplier routes
app.use("/", supplierRoutes);

export default app;
