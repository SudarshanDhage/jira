"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Star } from 'lucide-react'

interface TechStackItem {
  name: string
  recommended: boolean
  reason: string
}

interface TechStackCategory {
  items: TechStackItem[]
  selected: string
}

interface TechStackData {
  [key: string]: TechStackItem[]
}

interface TechStackSelectionProps {
  techStackData: TechStackData
  selections: Record<string, string>
  onSelectionChange: (category: string, selection: string) => void
}

const TechStackSelection: React.FC<TechStackSelectionProps> = ({
  techStackData,
  selections,
  onSelectionChange
}) => {
  const categories = Object.keys(techStackData)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#172B4D] mb-4">Select Technology Stack</h2>
      
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-md font-medium text-[#172B4D] mb-3 capitalize">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStackData[category].map(item => {
              const isSelected = selections[category] === item.name
              return (
                <Card 
                  key={item.name}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'border-[#0052CC] ring-1 ring-[#0052CC]' : 'hover:border-[#0052CC]'
                  }`}
                  onClick={() => onSelectionChange(category, item.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-medium text-[#172B4D]">{item.name}</h4>
                          {item.recommended && (
                            <div className="ml-2 text-[#FF8B00]">
                              <Star size={14} fill="#FF8B00" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#6B778C]">{item.reason}</p>
                      </div>
                      {isSelected && (
                        <div className="text-[#0052CC]">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TechStackSelection 