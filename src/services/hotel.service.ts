import { SupplierHotel } from "../suppliers/mockData";

export type SupplierName = "Supplier A" | "Supplier B";

export interface HotelOffer {
  name: string;
  price: number;
  supplier: SupplierName;
  commissionPct: number;
}

export const compareHotelOffers = (
  supplierAHotels: SupplierHotel[],
  supplierBHotels: SupplierHotel[],
): HotelOffer[] => {
  const hotelMap = new Map<string, HotelOffer>();

  // Process Supplier A
  for (const hotel of supplierAHotels) {
    const key = hotel.name.trim().toLowerCase();

    const currentOffer: HotelOffer = {
      name: hotel.name,
      price: hotel.price,
      supplier: "Supplier A",
      commissionPct: hotel.commissionPct,
    };

    const existingOffer = hotelMap.get(key);

    if (!existingOffer || currentOffer.price < existingOffer.price) {
      hotelMap.set(key, currentOffer);
    }
  }

  // Process Supplier B
  for (const hotel of supplierBHotels) {
    const key = hotel.name.trim().toLowerCase();

    const currentOffer: HotelOffer = {
      name: hotel.name,
      price: hotel.price,
      supplier: "Supplier B",
      commissionPct: hotel.commissionPct,
    };

    const existingOffer = hotelMap.get(key);

    if (!existingOffer || currentOffer.price < existingOffer.price) {
      hotelMap.set(key, currentOffer);
    }
  }

  return Array.from(hotelMap.values());
};
