import { useState, useCallback, useEffect } from 'react'
import type { ViewState } from 'react-map-gl'

interface UseMapInitializerProps {
  initialLongitude?: number;
  initialLatitude?: number;
  initialZoom?: number;
}

export function useMapInitializer({
  initialLongitude = -98.5795,
  initialLatitude = 39.8283,
  initialZoom = 3
}: UseMapInitializerProps = {}) {
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: initialLongitude,
    latitude: initialLatitude,
    zoom: initialZoom,
  })

  const [marker, setMarker] = useState<[number, number] | null>(null)

  useEffect(() => {
    setViewState({
      longitude: initialLongitude,
      latitude: initialLatitude,
      zoom: initialZoom,
    })
  }, [initialLongitude, initialLatitude, initialZoom])

  const onMove = useCallback((evt: { viewState: Partial<ViewState> }) => {
    setViewState(evt.viewState)
  }, [])

  const onClick = useCallback((evt: { lngLat: { lng: number; lat: number } }) => {
    if (evt.lngLat && !isNaN(evt.lngLat.lng) && !isNaN(evt.lngLat.lat)) {
      setMarker([evt.lngLat.lng, evt.lngLat.lat])
    }
  }, [])

  return { viewState, onMove, marker, setMarker, onClick }
}

