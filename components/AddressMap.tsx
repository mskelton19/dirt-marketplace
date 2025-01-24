import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"

if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  console.error('Mapbox access token is missing. Please check your environment variables.');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

interface AddressMapProps {
  onAddressChange: (address: string, coordinates?: [number, number]) => void
  address: string
  initialCoordinates?: [number, number] | null
  userZipCode: string
}

export function AddressMap({ onAddressChange, address, initialCoordinates, userZipCode }: AddressMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [lng, setLng] = useState(initialCoordinates ? initialCoordinates[0] : -98.5795)
  const [lat, setLat] = useState(initialCoordinates ? initialCoordinates[1] : 39.8283)
  const [zoom, setZoom] = useState(12)
  const [mapError, setMapError] = useState<string | null>(null)

  const calculateZoomLevel = useCallback((latitude: number): number => {
    const baseZoom = 12;
    const latitudeAdjustment = Math.abs(latitude) / 90;
    return Math.max(baseZoom - latitudeAdjustment * 2, 9);
  }, []);

  const updateMarker = useCallback((longitude: number, latitude: number) => {
    setLng(longitude);
    setLat(latitude);
    const newZoom = calculateZoomLevel(latitude);
    setZoom(newZoom);
    if (marker.current) {
      marker.current.setLngLat([longitude, latitude]);
    }
    if (map.current) {
      map.current.easeTo({ 
        center: [longitude, latitude], 
        zoom: newZoom, 
        duration: 1000 // Animation duration in milliseconds
      });
    }
  }, [calculateZoomLevel]);

  const reverseGeocode = useCallback(async (coordinates: [number, number]) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        onAddressChange(address, coordinates);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  }, [onAddressChange]);

  const geocodeZipCode = useCallback(async (zipCode: string): Promise<[number, number] | null> => {
    console.log('Geocoding zip code:', zipCode);
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zipCode)}.json?access_token=${mapboxgl.accessToken}&types=postcode&country=US`);
      const data = await response.json();
      console.log('Geocoding response:', data);
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].center as [number, number];
        return coordinates;
      }
      console.warn('No results found for zip code:', zipCode);
    } catch (error) {
      console.error('Error geocoding zip code:', error);
    }
    return null;
  }, []);

  const geocodeAddress = useCallback(async (addressToGeocode: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressToGeocode)}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].center as [number, number];
        return coordinates;
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
    return null;
  }, []);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!mapboxgl.accessToken) {
          throw new Error('Mapbox access token is missing');
        }

        console.log('Initializing map with zip code:', userZipCode);
        let coordinates = await geocodeZipCode(userZipCode);
        console.log('Geocoded coordinates:', coordinates);
        
        if (!coordinates && initialCoordinates) {
          coordinates = initialCoordinates;
          console.log('Using initial coordinates:', coordinates);
        }

        if (!coordinates) {
          throw new Error('Failed to geocode zip code and no initial coordinates provided');
        }

        setLng(coordinates[0]);
        setLat(coordinates[1]);
        const calculatedZoom = calculateZoomLevel(coordinates[1]);
        setZoom(calculatedZoom);

        if (map.current) return; // initialize map only once

        if (!mapContainer.current) {
          throw new Error('Map container is not available');
        }

        console.log('Creating map with center:', [coordinates[0], coordinates[1]], 'and zoom:', calculatedZoom);
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [coordinates[0], coordinates[1]],
          zoom: calculatedZoom
        });

        map.current.on('load', () => {
          if (!map.current) return;

          marker.current = new mapboxgl.Marker({
            draggable: true
          })
            .setLngLat([coordinates[0], coordinates[1]])
            .addTo(map.current);

          marker.current.on('dragend', () => {
            if (!marker.current) return;
            const lngLat = marker.current.getLngLat();
            updateMarker(lngLat.lng, lngLat.lat);
            reverseGeocode([lngLat.lng, lngLat.lat]);
          });

          map.current.on('click', (e) => {
            updateMarker(e.lngLat.lng, e.lngLat.lat);
            reverseGeocode([e.lngLat.lng, e.lngLat.lat]);
          });

          map.current.on('zoom', () => {
            if (map.current) {
              setZoom(map.current.getZoom());
            }
          });
        });

        setMapError(null);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    initializeMap();
  }, [userZipCode, initialCoordinates, calculateZoomLevel, geocodeZipCode, updateMarker, reverseGeocode]);

  useEffect(() => {
    const updateAddressOnMap = async () => {
      if (address) {
        const coordinates = await geocodeAddress(address);
        if (coordinates) {
          updateMarker(coordinates[0], coordinates[1]);
        }
      }
    };

    updateAddressOnMap();
  }, [address, geocodeAddress, updateMarker]);

  const handleZoomIn = useCallback(() => {
    if (map.current) {
      map.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (map.current) {
      map.current.zoomOut();
    }
  }, []);

  if (mapError) {
    return <div className="text-red-500">Error loading map: {mapError}</div>;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-md" />
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button onClick={handleZoomIn} size="icon" variant="secondary">
          <Plus className="h-4 w-4" />
        </Button>
        <Button onClick={handleZoomOut} size="icon" variant="secondary">
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

