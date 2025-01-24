import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Listing } from '../types';

interface MapProps {
  listings: Listing[];
}

const Map: React.FC<MapProps> = ({ listings }) => {
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 10
  });
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="400px"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          latitude={listing.latitude}
          longitude={listing.longitude}
        >
          <button
            className="marker-btn"
            onClick={(e) => {
              e.preventDefault();
              setSelectedListing(listing);
            }}
          >
            <img src="/marker.png" alt="Material Marker" />
          </button>
        </Marker>
      ))}

      {selectedListing && (
        <Popup
          latitude={selectedListing.latitude}
          longitude={selectedListing.longitude}
          onClose={() => setSelectedListing(null)}
        >
          <div>
            <h3>{selectedListing.name}</h3>
            <p>Quantity: {selectedListing.quantity} {selectedListing.unit}</p>
            <p>Price: ${selectedListing.price}</p>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;

