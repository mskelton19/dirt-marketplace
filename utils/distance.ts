export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d * 0.621371); // Convert to miles and round
  }
  
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  export async function getCoordinatesFromZipCode(zipCode: string): Promise<[number, number] | null> {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?access_token=${accessToken}&country=US&types=postcode`);
    const data = await response.json();
  
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return [latitude, longitude];
    }
  
    return null;
  }
  
  