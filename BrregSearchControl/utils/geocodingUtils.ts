import { GeocodeResult, ForretningsAdresse } from '../types/company';

export const geocodeAddress = async (
  address: ForretningsAdresse, 
  country: string
): Promise<GeocodeResult | null> => {
  try {
    const fullAddress = [
      ...(address.adresse || []),
      address.postnummer,
      address.poststed,
      country
    ].filter(Boolean).join(', ');
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    // error.message
    return null;
  }
};
