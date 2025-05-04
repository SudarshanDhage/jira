"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, ChevronLeft, ChevronRight } from 'lucide-react'

interface SprintInfoCardProps {
  sprintName: string
  sprintFocus?: string
  currentSprintIndex: number
  totalSprints: number
  onPrevious: () => void
  onNext: () => void
}

const SprintInfoCard: React.FC<SprintInfoCardProps> = ({ 
  sprintName, 
  sprintFocus, 
  currentSprintIndex, 
  totalSprints,
  onPrevious,
  onNext
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md">{sprintName}</CardTitle>
            {sprintFocus && (
              <CardDescription className="flex items-center mt-1">
                <Target size={14} className="mr-1" />
                {sprintFocus}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B778C]">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevious}
              disabled={currentSprintIndex === 0}
              className="px-2 py-1 h-8"
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="bg-[#DFE1E6] text-[#42526E] px-2 py-1 rounded text-xs">
              {currentSprintIndex + 1} of {totalSprints}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNext}
              disabled={currentSprintIndex === totalSprints - 1}
              className="px-2 py-1 h-8"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SprintInfoCard; 