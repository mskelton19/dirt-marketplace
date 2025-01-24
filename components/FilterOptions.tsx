import React from 'react';
import { FilterOptions, ListingStatus } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FilterOptionsProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  showStatusFilter?: boolean;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ filters, onFilterChange, showStatusFilter = false }) => {
  const handleChange = (key: keyof FilterOptions, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="materialType">Material Type</Label>
        <Select
          value={filters.materialType}
          onValueChange={(value) => handleChange('materialType', value)}
        >
          <SelectTrigger id="materialType">
            <SelectValue placeholder="Select material type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Materials</SelectItem>
            <SelectItem value="bricks">Bricks</SelectItem>
            <SelectItem value="concrete">Concrete</SelectItem>
            <SelectItem value="steel">Steel</SelectItem>
            {/* Add more material types as needed */}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="minQuantity">Minimum Quantity</Label>
        <Input
          id="minQuantity"
          type="number"
          value={filters.minQuantity}
          onChange={(e) => handleChange('minQuantity', parseInt(e.target.value))}
          min={0}
        />
      </div>
      <div>
        <Label>Maximum Distance (miles)</Label>
        <Slider
          value={[filters.maxDistance]}
          onValueChange={(value) => handleChange('maxDistance', value[0])}
          max={100}
          step={1}
        />
        <span>{filters.maxDistance} miles</span>
      </div>
      {showStatusFilter && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleChange('status', value as ListingStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;

