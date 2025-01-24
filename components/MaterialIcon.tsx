import React from 'react'
import { Shovel, Gem, Waves, Building2 } from 'lucide-react'

interface MaterialIconProps {
  type: string
  className?: string
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ type, className }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'soil':
        return <Shovel className={className} />
      case 'gravel':
        return <Gem className={className} />
      case 'sand':
        return <Waves className={className} />
      case 'concrete':
        return <Building2 className={className} />
      default:
        return null
    }
  }

  return getIcon()
}

export default MaterialIcon

