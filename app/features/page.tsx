"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SingleFeaturePlan, getFeaturePlans } from '@/lib/firestore'
import { Zap, Plus, ChevronRight, ListFilter, Bot, User } from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

const FeaturePlanCard: React.FC<{ featurePlan: SingleFeaturePlan }> = ({ featurePlan }) => {
  const { id, feature, developerPlan, aiPlan, createdAt } = featurePlan
  
  // Count tasks in both plans
  const developerTaskCount = developerPlan.tasks.length
  const aiTaskCount = aiPlan.tasks.length
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-[#172B4D]">{feature.title}</CardTitle>
            <CardDescription className="mt-1">
              {feature.description.length > 150 
                ? `${feature.description.substring(0, 150)}...` 
                : feature.description}
            </CardDescription>
          </div>
          <div className="text-sm text-[#6B778C]">
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col p-3 bg-[#F4F5F7] rounded-md">
            <div className="flex items-center mb-2">
              <User size={16} className="text-[#0052CC] mr-2" />
              <h4 className="text-sm font-medium text-[#172B4D]">Developer Plan</h4>
            </div>
            <p className="text-xs text-[#6B778C] mb-2">
              {developerTaskCount} tasks for manual implementation
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {developerPlan.tasks.slice(0, 3).map((task: any, index: number) => (
                <div 
                  key={index} 
                  className="px-3 py-1 bg-[#DEEBFF] text-[#0052CC] text-xs rounded-full"
                >
                  {task.title}
                </div>
              ))}
              {developerTaskCount > 3 && (
                <div className="px-3 py-1 bg-[#DEEBFF] text-[#0052CC] text-xs rounded-full">
                  +{developerTaskCount - 3} more
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col p-3 bg-[#F8F2FF] rounded-md">
            <div className="flex items-center mb-2">
              <Bot size={16} className="text-[#6554C0] mr-2" />
              <h4 className="text-sm font-medium text-[#172B4D]">AI Assistant Plan</h4>
            </div>
            <p className="text-xs text-[#6B778C] mb-2">
              {aiTaskCount} optimized tasks for AI implementation
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {aiPlan.tasks.slice(0, 3).map((task: any, index: number) => (
                <div 
                  key={index} 
                  className="px-3 py-1 bg-[#F0E6FF] text-[#6554C0] text-xs rounded-full"
                >
                  {task.title}
                </div>
              ))}
              {aiTaskCount > 3 && (
                <div className="px-3 py-1 bg-[#F0E6FF] text-[#6554C0] text-xs rounded-full">
                  +{aiTaskCount - 3} more
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end py-3">
        <Link href={`/features/${id}`}>
          <Button variant="ghost" size="sm" className="text-[#6554C0]">
            View Implementation Plan
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

const FeaturesPage = () => {
  const [featurePlans, setFeaturePlans] = useState<SingleFeaturePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('features')
    
    const fetchFeaturePlans = async () => {
      try {
        const plansData = await getFeaturePlans()
        setFeaturePlans(plansData)
      } catch (error) {
        console.error('Error fetching feature plans:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFeaturePlans()
  }, [setActiveSection])
  
  const featureContent = (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#172B4D]">Feature Plans</h1>
          <p className="text-[#6B778C]">Implement features with detailed AI-generated plans</p>
        </div>
        <Link href="/features/create">
          <Button variant="jiraPurple">
            <Zap size={16} className="mr-2" />
            New Feature Plan
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6554C0]"></div>
        </div>
      ) : featurePlans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <Zap size={48} className="text-[#6554C0] mb-4" />
              <h3 className="text-lg font-medium text-[#172B4D] mb-2">No Feature Plans Yet</h3>
              <p className="text-[#6B778C] mb-6 max-w-md mx-auto">
                Create your first feature implementation plan. The AI will generate detailed steps for both developers and AI assistants.
              </p>
              <Link href="/features/create">
                <Button variant="jiraPurple">
                  <Plus size={16} className="mr-2" />
                  Create First Feature Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="mb-4 flex items-center">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search features..."
                  className="w-full px-4 py-2 pl-10 rounded-md border border-[#DFE1E6] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B778C]">
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M21 21L15.5 15.5M15.5 15.5C17.0913 13.9087 18 11.8436 18 9.5C18 7.15642 17.0913 5.09133 15.5 3.5C13.9087 1.90867 11.8436 1 9.5 1C7.15642 1 5.09133 1.90867 3.5 3.5C1.90867 5.09133 1 7.15642 1 9.5C1 11.8436 1.90867 13.9087 3.5 15.5C5.09133 17.0913 7.15642 18 9.5 18C11.8436 18 13.9087 17.0913 15.5 15.5Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <Button variant="outline" size="sm" className="flex items-center">
                <ListFilter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div>
            {featurePlans.map((plan) => (
              <FeaturePlanCard key={plan.id} featurePlan={plan} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
  
  return (
    <PageWithSidebar pageTitle="Feature Plans">
      {featureContent}
    </PageWithSidebar>
  )
}

export default FeaturesPage 