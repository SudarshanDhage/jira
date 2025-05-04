"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FeatureForm from '@/components/features/FeatureForm'
import FeatureReview from '@/components/features/FeatureReview'
import FeaturePlanView from '@/components/features/FeaturePlanView'
import { Button } from '@/components/ui/button'
import { generateFeatureImplementation } from '@/lib/gemini'
import { createFeaturePlan, SingleFeaturePlan } from '@/lib/firestore'
import { ArrowLeft, Loader2 } from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

type StepType = 'input' | 'review' | 'generating-plan' | 'complete'

const CreateFeaturePage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<StepType>('input')
  const [isLoading, setIsLoading] = useState(false)
  const [_featureInput, setFeatureInput] = useState('')
  const [featureData, setFeatureData] = useState<{
    title: string;
    description: string;
  } | null>(null)
  const [featurePlan, setFeaturePlan] = useState<SingleFeaturePlan | null>(null)
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('features')
  }, [setActiveSection])
  
  // Handle feature input submission
  const handleFeatureSubmit = async (feature: string) => {
    try {
      setIsLoading(true)
      setFeatureInput(feature)
      
      // Generate feature implementation plan
      const implementation = await generateFeatureImplementation(feature)
      
      // Set feature data for review
      setFeatureData({
        title: implementation.feature.title,
        description: implementation.feature.description
      })
      
      // Proceed to review step
      setCurrentStep('review')
    } catch (error) {
      console.error('Error generating feature implementation:', error)
      alert('An error occurred while generating the feature implementation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle feature data edit
  const handleFeatureEdit = (title: string, description: string) => {
    setFeatureData({
      title,
      description
    })
  }
  
  // Generate final implementation plan
  const generateImplementationPlan = async () => {
    if (!featureData) return
    
    try {
      setCurrentStep('generating-plan')
      setIsLoading(true)
      
      // Generate implementation plan with Gemini AI
      const implementation = await generateFeatureImplementation(
        JSON.stringify({
          title: featureData.title,
          description: featureData.description
        })
      )
      
      // Create feature plan
      const newFeaturePlan: Omit<SingleFeaturePlan, 'id' | 'createdAt'> = {
        feature: {
          title: featureData.title,
          description: featureData.description
        },
        developerPlan: implementation.developerPlan,
        aiPlan: implementation.aiPlan
      }
      
      // Save to Firestore
      const createdPlan = await createFeaturePlan(newFeaturePlan)
      
      // Set feature plan for display
      setFeaturePlan({
        ...newFeaturePlan,
        id: createdPlan.id,
        createdAt: Date.now()
      })
      
      // Navigate to complete step
      setCurrentStep('complete')
    } catch (error) {
      console.error('Error generating implementation plan:', error)
      alert('An error occurred while generating the implementation plan. Please try again.')
      setCurrentStep('review')
    } finally {
      setIsLoading(false)
    }
  }
  
  const renderContent = () => {
    // Define content for each step
    const stepContent = {
      'input': (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-2">
              Create Feature Implementation Plan
            </h1>
            <p className="text-[#6B778C]">
              Describe the feature you want to implement in detail
            </p>
          </div>
          <FeatureForm 
            onSubmit={handleFeatureSubmit}
            isLoading={isLoading}
          />
        </div>
      ),
      
      'review': featureData && (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-2">
              Review Feature
            </h1>
            <p className="text-[#6B778C]">
              Review and edit the AI-generated feature description
            </p>
          </div>
          <FeatureReview
            featureTitle={featureData.title}
            featureDescription={featureData.description}
            onApprove={generateImplementationPlan}
            onEdit={handleFeatureEdit}
            isProcessing={isLoading}
          />
        </div>
      ),
      
      'generating-plan': (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-2">
              Generating Implementation Plan
            </h1>
            <p className="text-[#6B778C]">
              Almost there! Creating your implementation plan...
            </p>
          </div>
          <div className="w-full h-[70vh] flex flex-col items-center justify-center">
            <div className="text-center">
              <Loader2 size={48} className="mx-auto mb-4 animate-spin text-[#6554C0]" />
              <h2 className="text-xl font-medium text-[#172B4D] mb-2">Generating Implementation Plan</h2>
              <p className="text-[#6B778C]">
                Creating detailed implementation plans for developers and AI assistants...
              </p>
            </div>
          </div>
        </div>
      ),
      
      'complete': featurePlan && (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-2">
              Implementation Plan Created
            </h1>
            <p className="text-[#6B778C]">
              Your feature implementation plan has been created successfully
            </p>
          </div>
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => router.push('/features')}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Features
              </Button>
            </div>
            
            <FeaturePlanView featurePlan={featurePlan} />
          </div>
        </div>
      )
    }
    
    // Return the content for the current step or null
    return stepContent[currentStep] || null
  }
  
  return (
    <PageWithSidebar pageTitle="Feature Plans">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default CreateFeaturePage 