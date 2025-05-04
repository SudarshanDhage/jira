"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Grip, X } from 'lucide-react'
import { Feature } from '@/lib/firestore'

interface FeatureCardProps {
  feature: Feature
  isDraggable?: boolean
  onRemove?: () => void
  onDragStart?: (e: React.DragEvent, feature: Feature) => void
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  feature, 
  isDraggable = false,
  onRemove,
  onDragStart 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStart) {
      onDragStart(e, feature)
    }
  }

  return (
    <Card 
      className="mb-3 relative"
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {isDraggable && (
            <div className="mt-1 cursor-grab">
              <Grip size={16} className="text-[#6B778C]" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#172B4D] mb-1">{feature.name}</h4>
            <p className="text-xs text-[#6B778C]">{feature.description}</p>
          </div>
          {onRemove && (
            <button 
              onClick={onRemove}
              className="text-[#6B778C] hover:text-[#42526E] p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FeatureCard 