"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, Loader2 } from 'lucide-react'

interface FeatureFormProps {
  onSubmit: (feature: string) => Promise<void>
  isLoading?: boolean
}

const FeatureForm: React.FC<FeatureFormProps> = ({ 
  onSubmit,
  isLoading = false
}) => {
  const [feature, setFeature] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feature.trim()) return
    await onSubmit(feature)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl text-[#172B4D]">Feature Implementation Plan</CardTitle>
          <CardDescription>
            Describe the feature you want to implement in detail. The AI will create a detailed implementation plan for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-[#F9FAFC] p-4 rounded-lg border border-[#DFE1E6] flex items-start">
              <Lightbulb size={20} className="text-[#FF8B00] mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#42526E]">
                <p className="font-medium mb-1">Tips for a comprehensive feature description:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Clearly define what the feature does and its purpose</li>
                  <li>Specify any user interactions or workflows</li>
                  <li>Mention any UI/UX requirements</li>
                  <li>Include any data requirements or constraints</li>
                  <li>Mention any integrations with other systems if needed</li>
                </ul>
              </div>
            </div>
            
            <Textarea
              placeholder="Describe the feature you want to implement... (e.g., I need a user authentication system with sign-up, login, and password reset functionality...)"
              className="min-h-[200px]"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            variant="jiraPurple"
            disabled={!feature.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Implementation Plan'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default FeatureForm 