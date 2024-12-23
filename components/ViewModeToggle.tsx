import React from 'react'
import { Button } from "@/components/ui/button"
import { List, MapPin } from 'lucide-react'

interface ViewModeToggleProps {
  viewMode: 'list' | 'map'
  onToggle: (mode: 'list' | 'map') => void
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onToggle }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button
        onClick={() => onToggle('list')}
        variant={viewMode === 'list' ? 'default' : 'outline'}
        className={`px-3 py-2 text-sm font-medium ${
          viewMode === 'list'
            ? 'bg-accent text-white hover:bg-accent/90'
            : 'bg-white text-gray-700 hover:text-accent hover:bg-gray-50'
        } rounded-l-lg border border-gray-200`}
      >
        <List className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">List</span>
      </Button>
      <Button
        onClick={() => onToggle('map')}
        variant={viewMode === 'map' ? 'default' : 'outline'}
        className={`px-3 py-2 text-sm font-medium ${
          viewMode === 'map'
            ? 'bg-accent text-white hover:bg-accent/90'
            : 'bg-white text-gray-700 hover:text-accent hover:bg-gray-50'
        } rounded-r-lg border border-gray-200`}
      >
        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Map</span>
      </Button>
    </div>
  )
}

export default ViewModeToggle

