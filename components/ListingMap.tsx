'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Phone, Mail, Edit, Trash, CheckCircle, User } from 'lucide-react'
import MaterialIcon from './MaterialIcon'
import ReactDOMServer from 'react-dom/server';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

interface Listing {
  id: string
  name: string
  type: string
  quantity: number
  latitude: number
  longitude: number
  address: string
  distance?: number
  isAvailable: boolean
  status: 'ACTIVE' | 'COMPLETED' | 'DELETED'
  user: {
    email: string
    phone: string
    firstName: string
    lastName?: string
  }
}

interface ListingMapProps {
  listings: Listing[] | undefined
  userZipCode: string | null
  activeTab: 'available' | 'user'
  onEdit?: (listing: Listing) => void
  onDelete?: (listingId: string) => void
  onMarkComplete?: (listingId: string) => void
}

const getMarkerColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'soil':
      return '#8B4513'
    case 'gravel':
      return '#E5E7EB'
    case 'sand':
      return '#F4A460'
    case 'concrete':
      return '#A9A9A9'
    default:
      return '#4CAF50'
  }
}

const ListingMap: React.FC<ListingMapProps> = ({ listings, userZipCode, activeTab, onEdit, onDelete, onMarkComplete }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [openPopup, setOpenPopup] = useState<mapboxgl.Popup | null>(null);

  const renderMaterialIcon = (type: string) => {
    const iconComponent = <MaterialIcon type={type} className="w-6 h-6" />;
    return ReactDOMServer.renderToString(iconComponent);
  };

  const handleEdit = useCallback((listingId: string) => {
    const listing = listings?.find(l => l.id === listingId);
    if (listing && onEdit) {
      onEdit(listing);
    }
  }, [listings, onEdit]);

  const handleDelete = useCallback((listingId: string) => {
    if (onDelete) {
      onDelete(listingId);
    }
  }, [onDelete]);

  const handleComplete = useCallback((listingId: string) => {
    if (onMarkComplete) {
      onMarkComplete(listingId);
    }
  }, [onMarkComplete]);

  useEffect(() => {
    // Add the global functions for edit, delete, and complete
    (window as any).editListing = handleEdit;
    (window as any).deleteListing = handleDelete;
    (window as any).completeListing = handleComplete;

    return () => {
      // Clean up the global functions
      delete (window as any).editListing;
      delete (window as any).deleteListing;
      delete (window as any).completeListing;
    };
  }, [handleEdit, handleDelete, handleComplete]);

  const createPopupContent = (listing: Listing, activeTab: 'available' | 'user') => {
    const getColorScheme = (type: string | undefined): string => {
      switch (type?.toLowerCase()) {
        case 'soil':
          return 'bg-gradient-to-br from-[#8B4513]/20 to-[#8B4513]/30 border-[#8B4513]/40 text-[#3d1d00]'
        case 'gravel':
          return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-900'
        case 'sand':
          return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900'
        case 'concrete':
          return 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-900'
        default:
          return 'bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-900'
      }
    };

    const formatPhoneNumber = (phoneNumber: string) => {
      const cleaned = ('' + phoneNumber).replace(/\D/g, '')
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`
      }
      return phoneNumber
    };

    const iconHtml = (icon: React.ReactElement) => {
      return ReactDOMServer.renderToString(icon);
    };

    const colorScheme = getColorScheme(listing.type);

    return `
      <div class="rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${colorScheme} flex flex-col h-full">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <span class="material-icon">${renderMaterialIcon(listing.type)}</span>
              <h3 class="text-lg font-semibold ml-2">${listing.type || 'Unknown'}</h3>
            </div>
            <div class="text-xl font-bold bg-white bg-opacity-75 px-3 py-1 rounded-full shadow">
              ${listing.quantity} <span class="text-sm font-normal">CY</span>
            </div>
          </div>

          ${activeTab === 'user' && listing.status === 'ACTIVE' ? `
            <div class="mb-4">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span class="w-2 h-2 mr-1 bg-green-400 rounded-full"></span>
                Active
              </span>
            </div>
          ` : ''}

          <div class="space-y-2 text-sm">
            <p class="flex items-start">
              ${iconHtml(<MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />)}
              <span class="font-normal">
                ${listing.name}
                ${listing.distance !== undefined ? `<span class="block text-xs text-gray-600">${listing.distance.toFixed(1)} miles away</span>` : ''}
              </span>
            </p>
            <p class="flex items-center">
              ${iconHtml(<Phone className="w-4 h-4 mr-2 flex-shrink-0" />)}
              <a href="tel:${listing.user.phone}" class="hover:underline">
                ${formatPhoneNumber(listing.user.phone)}
              </a>
            </p>
            <p class="flex items-center">
              ${iconHtml(<Mail className="w-4 h-4 mr-2 flex-shrink-0" />)}
              <a href="mailto:${listing.user.email}" class="hover:underline truncate">
                ${listing.user.email}
              </a>
            </p>
            <p class="flex items-center">
              ${iconHtml(<User className="w-4 h-4 mr-2 flex-shrink-0" />)}
              <span class="${activeTab === 'user' ? "font-medium" : ""}">${listing.user.firstName}</span>
            </p>
          </div>

          ${activeTab === 'user' && listing.status === 'ACTIVE' ? `
            <div class="mt-4 flex flex-wrap justify-between gap-2 pt-4 border-t border-current border-opacity-10">
              <button onclick="editListing('${listing.id}')" class="flex items-center text-inherit hover:opacity-75">
                ${iconHtml(<Edit className="w-4 h-4 mr-2" />)}
                Edit
              </button>
              <button onclick="deleteListing('${listing.id}')" class="flex items-center text-inherit hover:opacity-75">
                ${iconHtml(<Trash className="w-4 h-4 mr-2" />)}
                Delete
              </button>
              <button onclick="completeListing('${listing.id}')" class="flex items-center text-inherit hover:opacity-75">
                ${iconHtml(<CheckCircle className="w-4 h-4 mr-2" />)}
                Complete
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  };


  useEffect(() => {
    if (map.current || !mapContainer.current) return
    
    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token is missing. Please check your environment variables.')
      return
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-98.5795, 39.8283],
      zoom: 3
    })

    map.current.on('load', () => {
      setMapInitialized(true)
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInitialized || !map.current || !userZipCode) return

    const geocodeZipCode = async () => {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${userZipCode}.json?access_token=${mapboxgl.accessToken}`)
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          map.current?.flyTo({
            center: [lng, lat],
            zoom: 10
          })
        }
      } catch (error) {
        console.error('Error geocoding zip code:', error)
      }
    }

    geocodeZipCode()
  }, [mapInitialized, userZipCode])

  useEffect(() => {
    if (!mapInitialized || !map.current || !listings || listings.length === 0) return

    const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
    existingMarkers.forEach(marker => marker.remove())

    const bounds = new mapboxgl.LngLatBounds()

    listings.forEach((listing) => {
      const el = document.createElement('div')
      el.className = 'marker'
      el.style.backgroundColor = getMarkerColor(listing.type)
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        className: 'custom-popup',
        maxWidth: '300px'
      })

      popup.setHTML(createPopupContent(listing, activeTab))

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.longitude, listing.latitude])
        .setPopup(popup)
        .addTo(map.current!)

      marker.getElement().addEventListener('click', () => {
        if (openPopup && openPopup !== popup) {
          openPopup.remove();
        }
        setOpenPopup(popup);
      });

      bounds.extend([listing.longitude, listing.latitude])
    })

    if (!bounds.isEmpty() && !userZipCode) {
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [listings, mapInitialized, userZipCode, openPopup, activeTab, onEdit, onDelete, onMarkComplete])

  const popupStyle = `
<style>
  .custom-popup .mapboxgl-popup-content {
    padding: 0;
    border-radius: 0.5rem;
    overflow: hidden;
    width: 300px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .custom-popup .mapboxgl-popup-close-button {
    font-size: 14px;
    padding: 4px;
    right: 8px;
    top: 8px;
    color: #666;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background: white;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
    z-index: 3;
  }
  .custom-popup .mapboxgl-popup-close-button:hover {
    color: #333;
    background: #f0f0f0;
  }
  .material-icon svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  .icon svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custom-popup a {
    color: inherit;
    text-decoration: none;
  }
  .custom-popup a:hover {
    text-decoration: underline;
  }
  .custom-popup button {
    font-size: 14px;
    padding: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
    color: inherit;
  }
  .custom-popup button:hover {
    opacity: 0.75;
  }
  .custom-popup button .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
`

  return (
    <>
      <div ref={mapContainer} className="w-full h-[500px]" />
      <div dangerouslySetInnerHTML={{ __html: popupStyle }} />
    </>
  )
}

export default ListingMap

