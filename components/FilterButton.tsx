import React from 'react'
import { Button } from "@/components/ui/button"
import { Filter } from 'lucide-react'

interface FilterButtonProps {
  onClick: () => void
  isOpen: boolean
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, isOpen }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full md:w-auto flex items-center justify-center text-gray-700"
    >
      <Filter className="mr-2 h-4 w-4" />
      {isOpen ? 'Close Filters' : 'Open Filters'}
    </Button>
  )
}

export default FilterButton

