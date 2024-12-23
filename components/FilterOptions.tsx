import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FilterButton from './FilterButton'
import { Button } from "@/components/ui/button"

interface FilterOptionsProps {
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
  className?: string
  initialFilters: {
    status: string
    distance: string
    material: string
    quantity: string
  }
  disableStatus?: boolean;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange, onClearFilters, className, initialFilters, disableStatus = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const toggleFilters = () => setIsOpen(!isOpen)

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onFilterChange(filterType, value)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      ...(disableStatus ? {} : { status: 'all' }),
      distance: '10',
      material: 'all',
      quantity: 'all'
    }
    setFilters(clearedFilters)
    Object.entries(clearedFilters).forEach(([key, value]) => onFilterChange(key, value))
    onClearFilters()
  }

  const filterContent = (
    <div className={`space-y-3 bg-white rounded-lg shadow ${className} w-full p-4 sticky top-4`}>
      <div className="flex flex-col space-y-3">
        {!disableStatus && (
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-700">Status</span>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger id="status-filter" className="w-full text-sm text-gray-900 h-8">
                <SelectValue placeholder="Select status" className="text-gray-700" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-gray-900">All</SelectItem>
                <SelectItem value="ACTIVE" className="text-gray-900">Active</SelectItem>
                <SelectItem value="COMPLETED" className="text-gray-900">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <span className="mb-1 block text-xs font-medium text-gray-700">Distance</span>
          <Select value={filters.distance} onValueChange={(value) => handleFilterChange('distance', value)}>
            <SelectTrigger id="distance-filter" className="w-full text-sm text-gray-900 h-8">
              <SelectValue placeholder="Select distance" className="text-gray-700" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5" className="text-gray-900">Less than 5 miles</SelectItem>
              <SelectItem value="10" className="text-gray-900">Less than 10 miles</SelectItem>
              <SelectItem value="25" className="text-gray-900">Less than 25 miles</SelectItem>
              <SelectItem value="50" className="text-gray-900">Less than 50 miles</SelectItem>
              <SelectItem value="all" className="text-gray-900">All distances</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-gray-700">Material</span>
          <Select value={filters.material} onValueChange={(value) => handleFilterChange('material', value)}>
            <SelectTrigger id="material-filter" className="w-full text-sm text-gray-900 h-8">
              <SelectValue placeholder="Select material" className="text-gray-700" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-gray-900">All</SelectItem>
              <SelectItem value="soil" className="text-gray-900">Soil</SelectItem>
              <SelectItem value="gravel" className="text-gray-900">Gravel</SelectItem>
              <SelectItem value="sand" className="text-gray-900">Sand</SelectItem>
              <SelectItem value="concrete" className="text-gray-900">Concrete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-gray-700">Quantity</span>
          <Select value={filters.quantity} onValueChange={(value) => handleFilterChange('quantity', value)}>
            <SelectTrigger id="quantity-filter" className="w-full text-sm text-gray-900 h-8">
              <SelectValue placeholder="Select quantity range" className="text-gray-700" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-gray-900">All</SelectItem>
              <SelectItem value="0-5000" className="text-gray-900">Less than 5,000 CY</SelectItem>
              <SelectItem value="5000-10000" className="text-gray-900">5,000 - 10,000 CY</SelectItem>
              <SelectItem value="10000-25000" className="text-gray-900">10,000 - 25,000 CY</SelectItem>
              <SelectItem value="25000-50000" className="text-gray-900">25,000 - 50,000 CY</SelectItem>
              <SelectItem value="50000+" className="text-gray-900">50,000+ CY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-3">
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="w-full text-sm h-8 font-semibold text-accent hover:bg-accent/10 transition-colors duration-200 border-accent"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="md:hidden mb-4">
        <FilterButton onClick={toggleFilters} isOpen={isOpen} />
        {isOpen && (
          <div className="mt-2">
            {filterContent}
          </div>
        )}
      </div>
      <div className="hidden md:block">
        {filterContent}
      </div>
    </>
  )
}

export default FilterOptions
