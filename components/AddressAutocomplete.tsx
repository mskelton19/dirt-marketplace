import React, { useState, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input"

interface AddressAutocompleteProps {
  onAddressSelect: (address: string) => void;
  value: string;
  onChange: (value: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export function AddressAutocomplete({ onAddressSelect, value, onChange }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length > 2) {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newValue)}.json?access_token=${MAPBOX_TOKEN}&types=address`);
        const data = await response.json();
        setSuggestions(data.features.map((feature: any) => feature.place_name));
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (address: string) => {
    onChange(address);
    setSuggestions([]);
    onAddressSelect(address);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter an address"
        className="w-full text-gray-900 placeholder:text-gray-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

