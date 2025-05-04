"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getFeaturePlan, SingleFeaturePlan } from '@/lib/firestore'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FeaturePlanView from '@/components/features/FeaturePlanView'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

interface FeatureDetailClientProps {
  featureId: string
}

const FeatureDetailClient: React.FC<FeatureDetailClientProps> = ({ featureId }) => {
  const router = useRouter()
  const [featurePlan, setFeaturePlan] = useState<SingleFeaturePlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('features')
    
    const fetchFeatureData = async () => {
      if (!featureId) return
      
      try {
        setIsLoading(true)
        
        // Fetch feature plan details
        const planData = await getFeaturePlan(featureId)
        setFeaturePlan(planData)
      } catch (error) {
        console.error('Error fetching feature plan:', error)
        alert('Error loading feature plan. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFeatureData()
  }, [featureId, setActiveSection])
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <Loader2 size={48} className="animate-spin text-[#6554C0]" />
          </div>
        </div>
      )
    }
    
    if (!featurePlan) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-[#172B4D] mb-2">Feature Plan Not Found</h2>
            <p className="text-[#6B778C] mb-6">
              The feature plan you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/features">
              <Button variant="jiraPurple">
                <ArrowLeft size={16} className="mr-2" />
                Back to Features
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/features')}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Features
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D]">{featurePlan.feature.title}</h1>
          </div>
          <p className="text-[#6B778C] max-w-3xl mb-6">{featurePlan.feature.description}</p>
          
          <FeaturePlanView featurePlan={featurePlan} />
        </div>
      </div>
    )
  }
  
  return (
    <PageWithSidebar pageTitle="Feature Plans">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default FeatureDetailClient 