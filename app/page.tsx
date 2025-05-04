"use client"

import { useEffect, useState } from 'react'
import JiraBoard from '@/components/JiraBoard'
import { getProjects } from '@/lib/firestore'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useSidebar } from '@/contexts/SidebarContext'
import EmptyStateView from '@/components/board/EmptyStateView'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { sidebarOpen, activeSection, setActiveSection } = useSidebar()

  useEffect(() => {
    // Focus on loading projects instead of managing activeSection state
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, []) // Remove activeSection dependency to prevent re-runs

  // Render appropriate content based on loading state only
  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
          <Loader2 size={32} className="animate-spin text-[#0052CC]" />
        </div>
      )
    }

    // No projects state
    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
          <h1 className="text-2xl font-semibold text-[#172B4D] mb-4">Welcome to AI Project Planner</h1>
          <p className="text-center text-[#6B778C] mb-8 max-w-lg">
            Start by creating your first project sprint plan or feature implementation plan.
          </p>
          <div className="flex gap-4">
            <Link href="/projects/create">
              <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                <Plus size={16} className="mr-2" />
                Create Project Sprint
              </Button>
            </Link>
            <Link href="/features/create">
              <Button variant="outline" className="text-[#0052CC] border-[#0052CC]">
                <Plus size={16} className="mr-2" />
                Create Feature Plan
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    // Always return the Jira board for projects view
    return <JiraBoard />
  }

  return (
    <div className={`h-full ${sidebarOpen ? 'ml-[240px]' : ''} transition-all duration-200`}>
      {renderContent()}
    </div>
  )
}