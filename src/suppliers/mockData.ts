export interface SupplierHotel {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
}

export const supplierAHotels: SupplierHotel[] = [
  {
    hotelId: "a1",
    name: "Holtin",
    price: 6000,
    city: "delhi",
    commissionPct: 10,
  },
  {
    hotelId: "a2",
    name: "Radison",
    price: 5900,
    city: "delhi",
    commissionPct: 13,
  },
  {
    hotelId: "a3",
    name: "Taj",
    price: 12000,
    city: "delhi",
    commissionPct: 15,
  },
  {
    hotelId: "a4",
    name: "The Leela",
    price: 15000,
    city: "delhi",
    commissionPct: 12,
  },
];

export const supplierBHotels: SupplierHotel[] = [
  {
    hotelId: "b1",
    name: "Holtin",
    price: 5340,
    city: "delhi",
    commissionPct: 20,
  },
  {
    hotelId: "b2",
    name: "Radison",
    price: 6200,
    city: "delhi",
    commissionPct: 12,
  },
  {
    hotelId: "b3",
    name: "Hyatt",
    price: 9000,
    city: "delhi",
    commissionPct: 18,
  },
  {
    hotelId: "b4",
    name: "The Oberoi",
    price: 18000,
    city: "delhi",
    commissionPct: 15,
  },
];
