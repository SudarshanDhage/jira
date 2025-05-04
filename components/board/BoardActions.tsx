"use client"

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Project, getProjects, SingleFeaturePlan, getFeaturePlans, getProject, getFeaturePlan } from '@/lib/firestore'
import { Workflow, Zap, Plus, Loader2, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Task } from './types'
import { Checkbox } from '@/components/ui/checkbox'

interface BoardActionsProps {
  onAddToBoard: (task: Task) => void;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  expanded: boolean;
  features: {
    id: string;
    name: string;
    description: string;
    selected: boolean;
  }[];
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  expanded: boolean;
  tasks: {
    id: string;
    name: string;
    description: string;
    selected: boolean;
  }[];
}

const BoardActions: React.FC<BoardActionsProps> = ({ onAddToBoard }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([])
  const [featureItems, setFeatureItems] = useState<FeatureItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Fetch high-level list of projects or features
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        if (activeTab === 'projects') {
          const projectData = await getProjects()
          setProjectItems(projectData.map(p => ({
            id: p.id!,
            title: p.title,
            description: p.description,
            selected: false,
            expanded: false,
            features: []
          })))
        } else {
          const featureData = await getFeaturePlans()
          setFeatureItems(featureData.map(f => ({
            id: f.id!,
            title: f.feature.title,
            description: f.feature.description,
            selected: false,
            expanded: false,
            tasks: []
          })))
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [activeTab])

  // Fetch details when a project/feature is expanded
  const fetchDetails = async (id: string, type: 'project' | 'feature') => {
    setIsDetailLoading(true)
    setExpandedId(id)
    
    try {
      if (type === 'project') {
        const projectData = await getProject(id)
        
        // Update the project with its features
        setProjectItems(prev => prev.map(p => {
          if (p.id === id) {
            const features = [
              ...(projectData.coreFeatures || []),
              ...(projectData.suggestedFeatures || [])
            ].map(f => ({
              id: f.id,
              name: f.name,
              description: f.description,
              selected: false
            }))
            
            return {
              ...p,
              expanded: true,
              features
            }
          }
          return p
        }))
      } else {
        const featureData = await getFeaturePlan(id)
        
        // Combine development and AI tasks
        const allTasks = [
          ...featureData.developerPlan.tasks.map((t: any) => ({
            id: `dev-${t.id || Math.random().toString(36).substr(2, 9)}`,
            name: t.title || t.description,
            description: t.details || '',
            selected: false
          })),
          ...featureData.aiPlan.tasks.map((t: any) => ({
            id: `ai-${t.id || Math.random().toString(36).substr(2, 9)}`,
            name: t.title || t.description,
            description: t.details || '',
            selected: false
          }))
        ]
        
        // Update the feature with its tasks
        setFeatureItems(prev => prev.map(f => {
          if (f.id === id) {
            return {
              ...f,
              expanded: true,
              tasks: allTasks
            }
          }
          return f
        }))
      }
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error)
    } finally {
      setIsDetailLoading(false)
    }
  }

  // Toggle expansion of a project/feature
  const toggleExpand = async (id: string, type: 'project' | 'feature') => {
    if (type === 'project') {
      const project = projectItems.find(p => p.id === id)
      if (!project?.expanded && project?.features.length === 0) {
        await fetchDetails(id, type)
      } else {
        setProjectItems(prev => prev.map(p => 
          p.id === id ? { ...p, expanded: !p.expanded } : p
        ))
      }
    } else {
      const feature = featureItems.find(f => f.id === id)
      if (!feature?.expanded && feature?.tasks.length === 0) {
        await fetchDetails(id, type)
      } else {
        setFeatureItems(prev => prev.map(f => 
          f.id === id ? { ...f, expanded: !f.expanded } : f
        ))
      }
    }
  }

  // Toggle selection of a project/feature
  const toggleItemSelection = (id: string, type: 'project' | 'feature') => {
    if (type === 'project') {
      setProjectItems(prev => prev.map(p => {
        if (p.id === id) {
          return { ...p, selected: !p.selected }
        }
        return p
      }))
    } else {
      setFeatureItems(prev => prev.map(f => {
        if (f.id === id) {
          return { ...f, selected: !f.selected }
        }
        return f
      }))
    }
  }

  // Toggle selection of a child item (feature of project or task of feature)
  const toggleChildSelection = (parentId: string, childId: string, type: 'project' | 'feature') => {
    if (type === 'project') {
      setProjectItems(prev => prev.map(p => {
        if (p.id === parentId) {
          return {
            ...p,
            features: p.features.map(f => 
              f.id === childId ? { ...f, selected: !f.selected } : f
            )
          }
        }
        return p
      }))
    } else {
      setFeatureItems(prev => prev.map(f => {
        if (f.id === parentId) {
          return {
            ...f,
            tasks: f.tasks.map(t => 
              t.id === childId ? { ...t, selected: !t.selected } : t
            )
          }
        }
        return f
      }))
    }
  }

  // Add selected items to the board
  const addSelectedToBoard = () => {
    if (activeTab === 'projects') {
      // First, add selected parent projects
      projectItems.forEach(project => {
        if (project.selected) {
          addProjectToBoard(project.id, project.title)
        }
        
        // Then add any selected features under projects
        project.features.forEach(feature => {
          if (feature.selected) {
            addFeatureToProjectBoard(project.id, project.title, feature.id, feature.name)
          }
        })
      })
    } else {
      // First, add selected parent features
      featureItems.forEach(feature => {
        if (feature.selected) {
          addFeatureToBoard(feature.id, feature.title)
        }
        
        // Then add any selected tasks under features
        feature.tasks.forEach(task => {
          if (task.selected) {
            addTaskToFeatureBoard(feature.id, feature.title, task.id, task.name)
          }
        })
      })
    }
    
    setIsOpen(false)
  }

  // Helper functions to create and add tasks to the board
  const addProjectToBoard = (projectId: string, title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content: title,
      isCompleted: false,
      taskId: `COM-P-${projectId.substring(0, 5)}`,
      type: 'project',
      linkedId: projectId,
      linkedTitle: title
    }
    
    onAddToBoard(newTask)
  }

  const addFeatureToBoard = (featureId: string, title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content: title,
      isCompleted: false,
      taskId: `COM-F-${featureId.substring(0, 5)}`,
      type: 'feature',
      linkedId: featureId,
      linkedTitle: title
    }
    
    onAddToBoard(newTask)
  }

  const addFeatureToProjectBoard = (projectId: string, projectTitle: string, featureId: string, featureTitle: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content: `${projectTitle}: ${featureTitle}`,
      isCompleted: false,
      taskId: `COM-PF-${projectId.substring(0, 3)}-${featureId.substring(0, 3)}`,
      type: 'feature',
      linkedId: featureId,
      linkedTitle: featureTitle
    }
    
    onAddToBoard(newTask)
  }

  const addTaskToFeatureBoard = (featureId: string, featureTitle: string, taskId: string, taskTitle: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      content: `${featureTitle}: ${taskTitle}`,
      isCompleted: false,
      taskId: `COM-FT-${featureId.substring(0, 3)}-${taskId.substring(0, 3)}`,
      type: 'feature',
      linkedId: featureId,
      linkedTitle: featureTitle
    }
    
    onAddToBoard(newTask)
  }

  const filteredProjects = projectItems.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFeatures = featureItems.filter(feature => 
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center h-[32px] px-2 py-1 border border-[#DFE1E6] rounded-sm bg-[#FAFBFC] hover:bg-[#F4F5F7]"
        >
          <Plus size={14} className="text-[#42526E] mr-1" />
          <span className="text-sm text-[#42526E]">Add to Board</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add to Board</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 max-h-[calc(90vh-180px)] overflow-hidden flex flex-col">
          <Tabs defaultValue="projects" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="projects" className="flex items-center">
                <Workflow size={14} className="mr-2 text-[#00875A]" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center">
                <Zap size={14} className="mr-2 text-[#6554C0]" />
                Features
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full px-3 py-2 border border-[#DFE1E6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C9AFF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
              <TabsContent value="projects" className="mt-2 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-[#0052CC]" />
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-8 text-[#6B778C]">
                    {searchTerm ? 'No projects match your search' : 'No projects available'}
                  </div>
                ) : (
                  <div>
                    {filteredProjects.map(project => (
                      <div 
                        key={project.id} 
                        className="border-b border-[#F4F5F7] last:border-b-0"
                      >
                        <div className="flex items-center justify-between p-3 hover:bg-[#F4F5F7]">
                          <div className="flex items-center flex-1">
                            <Checkbox 
                              id={`project-${project.id}`}
                              checked={project.selected}
                              onCheckedChange={() => toggleItemSelection(project.id, 'project')}
                              className="mr-3 data-[state=checked]:bg-[#00875A] data-[state=checked]:text-[#FFFFFF]"
                            />
                            <div>
                              <label
                                htmlFor={`project-${project.id}`}
                                className="text-sm font-medium text-[#172B4D] cursor-pointer"
                              >
                                {project.title}
                              </label>
                              <p className="text-xs text-[#6B778C] mt-1 line-clamp-1">
                                {project.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleExpand(project.id, 'project')}
                            className="text-[#6B778C] p-2 hover:bg-[#EBECF0] rounded"
                          >
                            {isDetailLoading && expandedId === project.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : project.expanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                        
                        {/* Features sub-items */}
                        {project.expanded && project.features.length > 0 && (
                          <div className="pl-10 pb-2 bg-[#FAFAFA]">
                            {project.features.map(feature => (
                              <div 
                                key={feature.id} 
                                className="flex items-center px-3 py-2 hover:bg-[#F4F5F7]"
                              >
                                <Checkbox 
                                  id={`feature-${feature.id}`}
                                  checked={feature.selected}
                                  onCheckedChange={() => toggleChildSelection(project.id, feature.id, 'project')}
                                  className="mr-3 data-[state=checked]:bg-[#6554C0] data-[state=checked]:text-[#FFFFFF]"
                                />
                                <div>
                                  <label
                                    htmlFor={`feature-${feature.id}`}
                                    className="text-sm font-medium text-[#172B4D] cursor-pointer"
                                  >
                                    {feature.name}
                                  </label>
                                  <p className="text-xs text-[#6B778C] mt-1 line-clamp-1">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="features" className="mt-2 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-[#6554C0]" />
                  </div>
                ) : filteredFeatures.length === 0 ? (
                  <div className="text-center py-8 text-[#6B778C]">
                    {searchTerm ? 'No features match your search' : 'No features available'}
                  </div>
                ) : (
                  <div>
                    {filteredFeatures.map(feature => (
                      <div 
                        key={feature.id} 
                        className="border-b border-[#F4F5F7] last:border-b-0"
                      >
                        <div className="flex items-center justify-between p-3 hover:bg-[#F4F5F7]">
                          <div className="flex items-center flex-1">
                            <Checkbox 
                              id={`feature-${feature.id}`}
                              checked={feature.selected}
                              onCheckedChange={() => toggleItemSelection(feature.id, 'feature')}
                              className="mr-3 data-[state=checked]:bg-[#6554C0] data-[state=checked]:text-[#FFFFFF]"
                            />
                            <div>
                              <label
                                htmlFor={`feature-${feature.id}`}
                                className="text-sm font-medium text-[#172B4D] cursor-pointer"
                              >
                                {feature.title}
                              </label>
                              <p className="text-xs text-[#6B778C] mt-1 line-clamp-1">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleExpand(feature.id, 'feature')}
                            className="text-[#6B778C] p-2 hover:bg-[#EBECF0] rounded"
                          >
                            {isDetailLoading && expandedId === feature.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : feature.expanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                        
                        {/* Tasks sub-items */}
                        {feature.expanded && feature.tasks.length > 0 && (
                          <div className="pl-10 pb-2 bg-[#FAFAFA]">
                            {feature.tasks.map(task => (
                              <div 
                                key={task.id} 
                                className="flex items-center px-3 py-2 hover:bg-[#F4F5F7]"
                              >
                                <Checkbox 
                                  id={`task-${task.id}`}
                                  checked={task.selected}
                                  onCheckedChange={() => toggleChildSelection(feature.id, task.id, 'feature')}
                                  className="mr-3 data-[state=checked]:bg-[#4C9AFF] data-[state=checked]:text-[#FFFFFF]"
                                />
                                <div>
                                  <label
                                    htmlFor={`task-${task.id}`}
                                    className="text-sm font-medium text-[#172B4D] cursor-pointer"
                                  >
                                    {task.name}
                                  </label>
                                  {task.description && (
                                    <p className="text-xs text-[#6B778C] mt-1 line-clamp-1">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <DialogFooter className="mt-4 pt-4 border-t border-[#F4F5F7]">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={addSelectedToBoard}
            size="sm"
            className="bg-[#0052CC] hover:bg-[#0065FF] text-white flex items-center"
          >
            <CheckSquare size={16} className="mr-2" />
            Add Selected to Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BoardActions 