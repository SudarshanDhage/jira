"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project, SprintPlan, getProject, getSprintPlans, createSprintPlan } from '@/lib/firestore'
import { ArrowLeft, Code, Loader2, PackageCheck, Server, Database, LayoutDashboard, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SprintPlanView from '@/components/projects/SprintPlanView'
import FeatureCard from '@/components/projects/FeatureCard'
import DocumentationView from '@/components/projects/DocumentationView'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { generateSprintPlan } from '@/lib/gemini'

interface ProjectDetailClientProps {
  projectId: string
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ projectId }) => {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [sprintPlans, setSprintPlans] = useState<SprintPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('sprints')
    
    const fetchProjectData = async () => {
      if (!projectId) return
      
      try {
        setIsLoading(true)
        
        // Fetch project details
        const projectData = await getProject(projectId)
        setProject(projectData)
        
        // Fetch sprint plans
        const plansData = await getSprintPlans(projectId)
        setSprintPlans(plansData)
      } catch (error) {
        console.error('Error fetching project data:', error)
        alert('Error loading project data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjectData()
  }, [projectId, setActiveSection])
  
  // Function to handle generating a new sprint plan
  const handleGenerateSprintPlan = async () => {
    if (!project) return;
    
    try {
      setIsGeneratingPlan(true);
      
      // Generate sprint plans using Gemini AI
      const sprintPlans = await generateSprintPlan(
        { ...project }, 
        project.techStack || {}
      );
      
      // Save sprint plans to Firestore
      const newSprintPlan = await createSprintPlan({
        projectId: projectId,
        developerPlan: sprintPlans.developerSprintPlan,
        aiPlan: sprintPlans.aiSprintPlan
      });
      
      // Update local state with the new sprint plan
      setSprintPlans(prevPlans => [
        { ...newSprintPlan, createdAt: Date.now() } as SprintPlan,
        ...prevPlans
      ]);
      
      // Show success message
      alert('Sprint plan generated successfully!');
      
    } catch (error) {
      console.error('Error generating sprint plan:', error);
      alert('An error occurred while generating the sprint plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <Loader2 size={48} className="animate-spin text-[#0052CC]" />
          </div>
        </div>
      )
    }
    
    if (!project) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-[#172B4D] mb-2">Project Not Found</h2>
            <p className="text-[#6B778C] mb-6">
              The project you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/projects">
              <Button variant="jira">
                <ArrowLeft size={16} className="mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    // Tech stack icons
    const techStackIcons: Record<string, React.ReactNode> = {
      frontend: <LayoutDashboard size={20} className="text-[#0052CC]" />,
      backend: <Server size={20} className="text-[#00875A]" />,
      database: <Database size={20} className="text-[#6554C0]" />,
      authentication: <PackageCheck size={20} className="text-[#FF8B00]" />,
      additionalTools: <Code size={20} className="text-[#172B4D]" />
    }
    
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects')}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D]">{project.title}</h1>
          </div>
          <p className="text-[#6B778C] max-w-3xl">{project.description}</p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="sprint-plan">
              Sprint Plan {sprintPlans.length > 0 && `(${sprintPlans.length})`}
            </TabsTrigger>
            <TabsTrigger value="documentation">
              <FileText size={16} className="mr-1" />
              Create Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                    <CardDescription>
                      Overview of the project structure and technologies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Features summary */}
                      <div>
                        <h3 className="text-md font-medium text-[#172B4D] mb-3">Core Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.coreFeatures.map(feature => (
                            <Card key={feature.id} className="border-l-4 border-l-[#0052CC]">
                              <CardContent className="p-3">
                                <h4 className="text-sm font-medium text-[#172B4D] mb-1">{feature.name}</h4>
                                <p className="text-xs text-[#6B778C]">{feature.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sprint plan summary */}
                      {sprintPlans.length > 0 && (
                        <div>
                          <h3 className="text-md font-medium text-[#172B4D] mb-3">Sprint Plan</h3>
                          <div className="bg-[#F4F5F7] rounded-md p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <h4 className="text-sm font-medium text-[#172B4D]">
                                  {sprintPlans[0].developerPlan.sprints.length} Sprints Created
                                </h4>
                                <p className="text-xs text-[#6B778C]">
                                  Click on the Sprint Plan tab to view detailed implementation plans
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setActiveTab('sprint-plan')}
                              >
                                View Sprint Plan
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {sprintPlans[0].developerPlan.sprints.map((sprint: any, index: number) => (
                                <div 
                                  key={index} 
                                  className="px-3 py-1 bg-white border border-[#DFE1E6] text-[#42526E] text-xs rounded-full"
                                >
                                  {sprint.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tech stack sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                    <CardDescription>
                      Selected technologies for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.techStack && Object.entries(project.techStack).map(([category, tech]: [string, any]) => (
                        <div key={category}>
                          <div className="flex items-center mb-2">
                            {techStackIcons[category] || <Code size={20} className="text-[#172B4D]" />}
                            <h4 className="text-sm font-medium text-[#172B4D] ml-2 capitalize">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                          </div>
                          <Card className="border-l-4 border-l-[#0052CC]">
                            <CardContent className="p-3">
                              <div className="flex items-center mb-1">
                                <h5 className="text-sm font-medium text-[#172B4D]">{tech.name}</h5>
                                {tech.recommended && (
                                  <span className="ml-2 px-2 py-0.5 text-[10px] bg-[#FFAB00] text-white rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#6B778C]">{tech.reason}</p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Project Features</CardTitle>
                <CardDescription>
                  All features included in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...project.coreFeatures, ...project.suggestedFeatures].map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sprint-plan" className="mt-0">
            {sprintPlans.length > 0 ? (
              <div>
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateSprintPlan}
                    disabled={isGeneratingPlan}
                  >
                    {isGeneratingPlan ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>Regenerate Sprint Plan</>
                    )}
                  </Button>
                </div>
                <SprintPlanView sprintPlan={sprintPlans[0]} />
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-[#172B4D] mb-2">No Sprint Plans Available</h3>
                    <p className="text-[#6B778C] mb-6 max-w-md mx-auto">
                      This project doesn't have any sprint plans yet. Generate a new sprint plan to get started.
                    </p>
                    <Button 
                      variant="jira"
                      onClick={handleGenerateSprintPlan}
                      disabled={isGeneratingPlan}
                    >
                      {isGeneratingPlan ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Generating Sprint Plan...
                        </>
                      ) : (
                        <>Generate Sprint Plan</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="documentation" className="mt-0">
            {project ? (
              <DocumentationView 
                project={project} 
                sprintPlan={sprintPlans.length > 0 ? sprintPlans[0] : null} 
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-[#172B4D] mb-2">No Project Available</h3>
                    <p className="text-[#6B778C] mb-6 max-w-md mx-auto">
                      A project is required to generate documentation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
  return (
    <PageWithSidebar pageTitle="Sprint Projects">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default ProjectDetailClient 