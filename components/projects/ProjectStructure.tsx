"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Feature, Project } from '@/lib/firestore'
import { ArrowRight, Loader2, Plus, RefreshCw } from 'lucide-react'
import FeatureCard from './FeatureCard'
import { generateProjectStructure } from '@/lib/gemini'

interface ProjectStructureProps {
  projectData: Project
  onUpdateFeatures: (coreFeatures: Feature[], suggestedFeatures: Feature[]) => void
  onNext: () => void
  onRegenerate?: () => Promise<void>
  isRegenerating?: boolean
  isNextLoading?: boolean
}

const ProjectStructure: React.FC<ProjectStructureProps> = ({ 
  projectData,
  onUpdateFeatures,
  onNext,
  onRegenerate,
  isRegenerating = false,
  isNextLoading = false
}) => {
  const [coreFeatures, setCoreFeatures] = useState<Feature[]>(projectData.coreFeatures)
  const [suggestedFeatures, setSuggestedFeatures] = useState<Feature[]>(projectData.suggestedFeatures)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [draggedFeature, setDraggedFeature] = useState<Feature | null>(null)

  const handleDragStart = (e: React.DragEvent, feature: Feature, isSuggested: boolean) => {
    setDraggedFeature({ ...feature })
    e.dataTransfer.setData('text/plain', JSON.stringify({ feature, isSuggested }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDropOnCore = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    if (!data) return
    
    const { feature, isSuggested } = JSON.parse(data)
    
    if (isSuggested) {
      // Add to core features
      const newCoreFeatures = [...coreFeatures, feature]
      
      // Remove from suggested features
      const newSuggestedFeatures = suggestedFeatures.filter(f => f.id !== feature.id)
      
      setCoreFeatures(newCoreFeatures)
      setSuggestedFeatures(newSuggestedFeatures)
      onUpdateFeatures(newCoreFeatures, newSuggestedFeatures)
    }
  }

  const handleDropOnSuggested = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    if (!data) return
    
    const { feature, isSuggested } = JSON.parse(data)
    
    if (!isSuggested) {
      // Add to suggested features
      const newSuggestedFeatures = [...suggestedFeatures, feature]
      
      // Remove from core features
      const newCoreFeatures = coreFeatures.filter(f => f.id !== feature.id)
      
      setCoreFeatures(newCoreFeatures)
      setSuggestedFeatures(newSuggestedFeatures)
      onUpdateFeatures(newCoreFeatures, newSuggestedFeatures)
    }
  }

  const handleRemoveFromCore = (feature: Feature) => {
    const newCoreFeatures = coreFeatures.filter(f => f.id !== feature.id)
    const newSuggestedFeatures = [...suggestedFeatures, feature]
    
    setCoreFeatures(newCoreFeatures)
    setSuggestedFeatures(newSuggestedFeatures)
    onUpdateFeatures(newCoreFeatures, newSuggestedFeatures)
  }

  const handleRemoveFromSuggested = (feature: Feature) => {
    const newSuggestedFeatures = suggestedFeatures.filter(f => f.id !== feature.id)
    setSuggestedFeatures(newSuggestedFeatures)
    onUpdateFeatures(coreFeatures, newSuggestedFeatures)
  }

  const generateMoreSuggestions = async () => {
    try {
      setIsFetchingMore(true)
      
      // Generate additional features based on current core features
      const updatedProjectData = {
        ...projectData,
        coreFeatures,
        suggestedFeatures: []
      }
      
      const response = await generateProjectStructure(JSON.stringify(updatedProjectData))
      
      // Combine existing suggestions with new ones, avoiding duplicates
      const existingIds = new Set([...coreFeatures, ...suggestedFeatures].map(f => f.id))
      const newSuggestions = response.suggestedFeatures.filter(
        (feature: Feature) => !existingIds.has(feature.id)
      )
      
      const updatedSuggestions = [...suggestedFeatures, ...newSuggestions]
      setSuggestedFeatures(updatedSuggestions)
      onUpdateFeatures(coreFeatures, updatedSuggestions)
    } catch (error) {
      console.error('Error generating more suggestions:', error)
    } finally {
      setIsFetchingMore(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-[#172B4D]">{projectData.title}</CardTitle>
            <CardDescription className="mt-1">
              {projectData.description}
            </CardDescription>
          </div>
          {onRegenerate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <RefreshCw size={16} className="mr-2" />
              )}
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Core Features */}
          <div 
            className="flex-1 border border-[#DFE1E6] rounded-lg p-4 bg-white"
            onDragOver={handleDragOver}
            onDrop={handleDropOnCore}
          >
            <h3 className="text-md font-semibold text-[#172B4D] mb-3">Core Features</h3>
            <Separator className="mb-4" />
            <div className="min-h-[200px]">
              {coreFeatures.length === 0 ? (
                <div className="text-center py-8 text-[#6B778C] text-sm">
                  <p>Drag and drop suggested features here to add them to your core features.</p>
                </div>
              ) : (
                <div>
                  {coreFeatures.map(feature => (
                    <FeatureCard 
                      key={feature.id} 
                      feature={feature}
                      isDraggable={true}
                      onRemove={() => handleRemoveFromCore(feature)}
                      onDragStart={(e) => handleDragStart(e, feature, false)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Suggested Features */}
          <div 
            className="flex-1 border border-[#DFE1E6] rounded-lg p-4 bg-white"
            onDragOver={handleDragOver}
            onDrop={handleDropOnSuggested}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-[#172B4D]">Suggested Features</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateMoreSuggestions}
                disabled={isFetchingMore}
              >
                {isFetchingMore ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <Plus size={14} className="mr-1" />
                )}
                More Suggestions
              </Button>
            </div>
            <Separator className="mb-4" />
            <div className="min-h-[200px]">
              {suggestedFeatures.length === 0 ? (
                <div className="text-center py-8 text-[#6B778C] text-sm">
                  <p>{isFetchingMore ? 'Generating more suggestions...' : 'No suggested features available.'}</p>
                </div>
              ) : (
                <div>
                  {suggestedFeatures.map(feature => (
                    <FeatureCard 
                      key={feature.id} 
                      feature={feature}
                      isDraggable={true}
                      onRemove={() => handleRemoveFromSuggested(feature)}
                      onDragStart={(e) => handleDragStart(e, feature, true)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="jira" 
          onClick={onNext}
          className="px-6"
          disabled={coreFeatures.length === 0 || isNextLoading}
        >
          {isNextLoading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              <span>Loading Tech Stack...</span>
            </>
          ) : (
            <>
              <span>Continue to Tech Stack</span>
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProjectStructure 