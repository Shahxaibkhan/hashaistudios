/**
 * Haversine distance calculation and delivery fee utilities
 * All distances in kilometers, all fees in PKR (integers)
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the great-circle distance between two points on Earth
 * using the Haversine formula.
 *
 * @param lat1 - Latitude of point 1 (degrees)
 * @param lng1 - Longitude of point 1 (degrees)
 * @param lat2 - Latitude of point 2 (degrees)
 * @param lng2 - Longitude of point 2 (degrees)
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Calculate delivery fee based on distance
 *
 * @param distanceKm - Distance in kilometers
 * @param baseFee - Base delivery fee in PKR
 * @param feePerKm - Additional fee per kilometer in PKR
 * @returns Total delivery fee in PKR (rounded to nearest integer)
 */
export function calculateDeliveryFee(
  distanceKm: number,
  baseFee: number,
  feePerKm: number
): number {
  const fee = baseFee + distanceKm * feePerKm;
  return Math.round(fee);
}

/**
 * Check if a delivery location is within the restaurant's delivery radius
 *
 * @param restaurantLat - Restaurant latitude
 * @param restaurantLng - Restaurant longitude
 * @param deliveryLat - Delivery location latitude
 * @param deliveryLng - Delivery location longitude
 * @param radiusKm - Maximum delivery radius in kilometers
 * @returns Whether the location is within range
 */
export function isWithinDeliveryRadius(
  restaurantLat: number,
  restaurantLng: number,
  deliveryLat: number,
  deliveryLng: number,
  radiusKm: number
): boolean {
  const distance = haversineDistance(
    restaurantLat,
    restaurantLng,
    deliveryLat,
    deliveryLng
  );
  return distance <= radiusKm;
}

/**
 * Get delivery information for a given location
 *
 * @param restaurantLat - Restaurant latitude
 * @param restaurantLng - Restaurant longitude
 * @param deliveryLat - Delivery location latitude
 * @param deliveryLng - Delivery location longitude
 * @param baseFee - Base delivery fee in PKR
 * @param feePerKm - Fee per kilometer in PKR
 * @param radiusKm - Maximum delivery radius in kilometers
 * @returns Delivery info object
 */
export function getDeliveryInfo(
  restaurantLat: number,
  restaurantLng: number,
  deliveryLat: number,
  deliveryLng: number,
  baseFee: number,
  feePerKm: number,
  radiusKm: number
): {
  distanceKm: number;
  fee: number;
  isWithinRadius: boolean;
} {
  const distanceKm = haversineDistance(
    restaurantLat,
    restaurantLng,
    deliveryLat,
    deliveryLng
  );

  return {
    distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
    fee: calculateDeliveryFee(distanceKm, baseFee, feePerKm),
    isWithinRadius: distanceKm <= radiusKm,
  };
}
