"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Project, getProjects, getSprintPlans } from '@/lib/firestore'
import { Workflow, Plus, ChevronRight, Code, ListFilter } from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

interface ProjectWithPlansProps {
  project: Project
}

const ProjectWithPlans: React.FC<ProjectWithPlansProps> = ({ project }) => {
  const [hasPlans, setHasPlans] = useState(false)
  
  useEffect(() => {
    const checkPlans = async () => {
      if (!project.id) return
      
      try {
        const plans = await getSprintPlans(project.id)
        setHasPlans(plans.length > 0)
      } catch (error) {
        console.error('Error getting sprint plans:', error)
      }
    }
    
    checkPlans()
  }, [project.id])
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-[#172B4D]">{project.title}</CardTitle>
            <CardDescription className="mt-1">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex items-center text-sm text-[#6B778C]">
            <span className="mr-2">{project.coreFeatures.length} Features</span>
            <div className="h-4 w-px bg-[#DFE1E6]"></div>
            <span className="mx-2">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          {project.coreFeatures.slice(0, 5).map((feature) => (
            <div 
              key={feature.id} 
              className="px-3 py-1 bg-[#F4F5F7] text-[#42526E] text-xs rounded-full"
            >
              {feature.name}
            </div>
          ))}
          {project.coreFeatures.length > 5 && (
            <div className="px-3 py-1 bg-[#F4F5F7] text-[#42526E] text-xs rounded-full">
              +{project.coreFeatures.length - 5} more
            </div>
          )}
        </div>
        
        {project.techStack && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-[#6B778C] mb-2">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(project.techStack).map(([category, tech]: [string, any]) => (
                <div 
                  key={category} 
                  className="px-3 py-1 bg-[#DEEBFF] text-[#0052CC] text-xs rounded-full flex items-center"
                >
                  <Code size={12} className="mr-1" />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between py-3">
        <div className="flex items-center">
          <Workflow size={16} className="text-[#00875A] mr-2" />
          <span className="text-sm text-[#42526E]">
            {hasPlans ? 'Sprint plans available' : 'No sprint plans yet'}
          </span>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button variant="ghost" size="sm" className="text-[#0052CC]">
            View Details
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('sprints')
    
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [setActiveSection])
  
  const projectContent = (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#172B4D]">Sprint Projects</h1>
          <p className="text-[#6B778C]">Manage and track your AI-generated project plans</p>
        </div>
        <Link href="/projects/create">
          <Button variant="jiraGreen">
            <Workflow size={16} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0052CC]"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <Workflow size={48} className="text-[#00875A] mb-4" />
              <h3 className="text-lg font-medium text-[#172B4D] mb-2">No Projects Yet</h3>
              <p className="text-[#6B778C] mb-6 max-w-md mx-auto">
                Start by creating a new project with your ideas. The AI will help you structure your project and create sprint plans.
              </p>
              <Link href="/projects/create">
                <Button variant="jiraGreen">
                  <Plus size={16} className="mr-2" />
                  Create First Project
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
                  placeholder="Search projects..."
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
            {projects.map((project) => (
              <ProjectWithPlans key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
  
  return (
    <PageWithSidebar pageTitle="Sprint Projects">
      {projectContent}
    </PageWithSidebar>
  )
}

export default ProjectsPage 