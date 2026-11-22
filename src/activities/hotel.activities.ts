import type { SupplierHotel } from "../suppliers/mockData";
import type { HotelOffer } from "../services/hotel.service";

import { compareHotelOffers } from "../services/hotel.service";

const SUPPLIER_API_BASE_URL =
  process.env.SUPPLIER_API_BASE_URL || "http://localhost:3000";

// Generic supplier API caller
async function fetchSupplierHotels(
  endpoint: string,
  city: string,
): Promise<SupplierHotel[]> {
  const url = new URL(endpoint, SUPPLIER_API_BASE_URL);

  url.searchParams.set("city", city);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Supplier API failed: ${response.status}`);
  }

  return (await response.json()) as SupplierHotel[];
}

// Activity 1: Fetch Supplier A
export async function fetchSupplierAHotels(
  city: string,
): Promise<SupplierHotel[]> {
  console.log(`Fetching Supplier A hotels for ${city}`);

  return fetchSupplierHotels("/supplierA/hotels", city);
}

// Activity 2: Fetch Supplier B
export async function fetchSupplierBHotels(
  city: string,
): Promise<SupplierHotel[]> {
  console.log(`Fetching Supplier B hotels for ${city}`);

  return fetchSupplierHotels("/supplierB/hotels", city);
}

// Activity 3: Compare hotel offers
export async function compareOffers(
  supplierAHotels: SupplierHotel[],
  supplierBHotels: SupplierHotel[],
): Promise<HotelOffer[]> {
  console.log("Comparing hotel offers...");

  return compareHotelOffers(supplierAHotels, supplierBHotels);
}
