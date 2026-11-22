import { proxyActivities } from "@temporalio/workflow";

import type * as activities from "../activities/hotel.activities";

import type { SupplierHotel } from "../suppliers/mockData";
import type { HotelOffer } from "../services/hotel.service";

const { fetchSupplierAHotels, fetchSupplierBHotels, compareOffers } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: "30 seconds",

    retry: {
      initialInterval: "1 second",
      backoffCoefficient: 2,
      maximumAttempts: 3,
    },
  });

export async function hotelOfferWorkflow(city: string): Promise<HotelOffer[]> {
  console.log(`Starting hotel workflow for ${city}`);

  // Fetch both suppliers concurrently
  const [supplierAHotels, supplierBHotels] = await Promise.all([
    fetchSupplierAHotels(city),
    fetchSupplierBHotels(city),
  ]);

  console.log("Both supplier responses received");

  // Compare and deduplicate hotels
  const finalHotels = await compareOffers(supplierAHotels, supplierBHotels);

  console.log("Hotel comparison completed");

  return finalHotels;
}
