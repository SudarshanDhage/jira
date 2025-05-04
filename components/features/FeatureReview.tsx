"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Edit, Loader2 } from 'lucide-react'

interface FeatureReviewProps {
  featureTitle: string
  featureDescription: string
  onApprove: () => void
  onEdit: (title: string, description: string) => void
  isProcessing?: boolean
}

const FeatureReview: React.FC<FeatureReviewProps> = ({ 
  featureTitle,
  featureDescription,
  onApprove,
  onEdit,
  isProcessing = false
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(featureTitle)
  const [description, setDescription] = useState(featureDescription)

  const handleEdit = () => {
    if (isEditing) {
      onEdit(title, description)
    }
    setIsEditing(!isEditing)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#172B4D]">Review Feature</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEdit}
            disabled={isProcessing}
          >
            <Edit size={16} className="mr-2" />
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </div>
        <CardDescription>
          Review the AI-generated feature description or edit it to better match your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#172B4D] mb-1">
              Feature Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#DFE1E6] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-transparent"
              />
            ) : (
              <div className="p-3 bg-[#F4F5F7] rounded-md border border-[#DFE1E6]">
                <p className="text-[#172B4D] font-medium">{title}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#172B4D] mb-1">
              Feature Description
            </label>
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px]"
              />
            ) : (
              <div className="p-3 bg-[#F4F5F7] rounded-md border border-[#DFE1E6] min-h-[150px]">
                <p className="text-[#42526E] whitespace-pre-line">{description}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="jiraPurple" 
          onClick={onApprove}
          disabled={isEditing || isProcessing}
          className="px-6"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <span>Create Implementation Plan</span>
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FeatureReview 