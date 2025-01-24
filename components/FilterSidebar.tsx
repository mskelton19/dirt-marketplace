import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from 'lucide-react'
import { MaterialType, ListingStatus } from "@/types/listing"

interface FilterSidebarProps {
  transactionFilter: 'all' | 'import' | 'export'
  setTransactionFilter: (value: 'all' | 'import' | 'export') => void
  materialFilter: MaterialType | 'all'
  setMaterialFilter: (value: MaterialType | 'all') => void
  quantityFilter: string
  setQuantityFilter: (value: string) => void
  statusFilter: ListingStatus | 'all'
  setStatusFilter: (value: ListingStatus | 'all') => void
}

export function FilterSidebar({
  transactionFilter,
  setTransactionFilter,
  materialFilter,
  setMaterialFilter,
  quantityFilter,
  setQuantityFilter,
  statusFilter,
  setStatusFilter
}: FilterSidebarProps) {
  const clearFilters = () => {
    setTransactionFilter('all');
    setMaterialFilter('all');
    setQuantityFilter('all');
    setStatusFilter('all');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2">Transaction Type</Label>
        <div className="flex rounded-md shadow-sm" role="group">
          <Button
            variant={transactionFilter === 'all' ? 'default' : 'outline'}
            className="rounded-l-md rounded-r-none flex-1"
            onClick={() => setTransactionFilter('all')}
          >
            All
          </Button>
          <Button
            variant={transactionFilter === 'import' ? 'default' : 'outline'}
            className="rounded-none border-x-0 flex-1"
            onClick={() => setTransactionFilter('import')}
          >
            Import
          </Button>
          <Button
            variant={transactionFilter === 'export' ? 'default' : 'outline'}
            className="rounded-r-md rounded-l-none flex-1"
            onClick={() => setTransactionFilter('export')}
          >
            Export
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="material-filter" className="text-sm font-medium mb-2">Material</Label>
        <Select value={materialFilter} onValueChange={(value) => setMaterialFilter(value as MaterialType | 'all')}>
          <SelectTrigger id="material-filter">
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Materials</SelectItem>
            <SelectItem value="Topsoil">Topsoil</SelectItem>
            <SelectItem value="Structural Fill">Structural Fill</SelectItem>
            <SelectItem value="Crushed Rock">Crushed Rock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity-filter" className="text-sm font-medium mb-2">Quantity</Label>
        <Select value={quantityFilter} onValueChange={setQuantityFilter}>
          <SelectTrigger id="quantity-filter">
            <SelectValue placeholder="Select quantity range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quantities</SelectItem>
            <SelectItem value="0-100">0 - 100</SelectItem>
            <SelectItem value="101-500">101 - 500</SelectItem>
            <SelectItem value="501-1000">501 - 1000</SelectItem>
            <SelectItem value="1001+">1001+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status-filter" className="text-sm font-medium mb-2">Status</Label>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ListingStatus | 'all')}>
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={clearFilters} 
        variant="outline" 
        className="w-full mt-4"
      >
        Clear Filters
      </Button>
    </div>
  )

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop view */}
      <Card className="hidden md:flex flex-col h-full">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          <FilterContent />
        </CardContent>
      </Card>
    </>
  )
}

