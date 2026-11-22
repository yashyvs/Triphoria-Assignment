import { redisClient } from "../config/redis";
import type { HotelOffer } from "./hotel.service";

const getHotelKey = (city: string) => `hotels:${city.trim().toLowerCase()}`;

export async function saveHotelsToRedis(
  city: string,
  hotels: HotelOffer[],
): Promise<void> {
  const key = getHotelKey(city);

  const pipeline = redisClient.multi();

  pipeline.del(key);

  if (hotels.length > 0) {
    pipeline.zAdd(
      key,
      hotels.map((hotel) => ({
        score: hotel.price,
        value: JSON.stringify(hotel),
      })),
    );
  }

  // Keep cached data for one hour
  pipeline.expire(key, 3600);

  await pipeline.exec();
}

export async function getHotelsFromRedis(
  city: string,
  minPrice?: number,
  maxPrice?: number,
): Promise<HotelOffer[]> {
  const key = getHotelKey(city);

  const min = minPrice ?? "-inf";
  const max = maxPrice ?? "+inf";

  const results = await redisClient.zRangeByScore(key, min, max);

  return results.map((hotel) => JSON.parse(hotel) as HotelOffer);
}
