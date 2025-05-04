"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Clock } from 'lucide-react'
import { Column, Task } from '@/components/board/types'

// Define SprintPlan interface locally to avoid import issues
interface SprintPlan {
  id?: string;
  projectId: string;
  developerPlan: any;
  aiPlan: any;
  createdAt: number;
}

// Import our refactored components
import EnhancedJiraBoard from './EnhancedJiraBoard'
import AITaskCard from './AITaskCard'
import SprintInfoCard from './SprintInfoCard'
import { mapSprintTasksToTaskObjects, createInitialColumns, updateTaskStatus } from './SprintUtils'

interface SprintPlanViewProps {
  sprintPlan: SprintPlan
}

const SprintPlanView: React.FC<SprintPlanViewProps> = ({ sprintPlan }) => {
  const [activeView, setActiveView] = useState('developer')
  const [columns, setColumns] = useState<Column[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSprint, setActiveSprint] = useState<number>(0)
  const [sprints, setSprints] = useState<any[]>([])

  // Convert the sprint plan data into the Jira board format
  useEffect(() => {
    if (!sprintPlan) return

    setIsLoading(true)
    
    try {
      // Load the appropriate sprint data based on active view
      if (activeView === 'developer') {
        if (sprintPlan.developerPlan?.sprints && sprintPlan.developerPlan.sprints.length > 0) {
          setSprints(sprintPlan.developerPlan.sprints)
          setActiveSprint(0) // Reset to first sprint when changing views
        } else {
          setSprints([])
        }
      } else {
        // For AI Assistant View
        if (sprintPlan.aiPlan?.sprints && sprintPlan.aiPlan.sprints.length > 0) {
          setSprints(sprintPlan.aiPlan.sprints)
          setActiveSprint(0) // Reset to first sprint when changing views
        } else {
          setSprints([])
        }
      }
    } catch (error) {
      console.error('Error processing sprint plan data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sprintPlan, activeView])

  // Update columns when active sprint changes
  useEffect(() => {
    if (!sprints || sprints.length === 0) return

    try {
      const currentSprint = sprints[activeSprint]
      
      // Use our utility function to map tasks
      const allTasks = mapSprintTasksToTaskObjects(currentSprint, activeView, activeSprint);
      
      // Use our utility function to create initial columns
      setColumns(createInitialColumns(allTasks));
    } catch (error) {
      console.error('Error converting sprint data to board:', error)
    }
  }, [sprints, activeSprint, activeView])

  const handlePreviousSprint = () => {
    if (activeSprint > 0) {
      setActiveSprint(activeSprint - 1)
    }
  }

  const handleNextSprint = () => {
    if (activeSprint < sprints.length - 1) {
      setActiveSprint(activeSprint + 1)
    }
  }

  const handleSprintChange = (value: string) => {
    const sprintIndex = parseInt(value, 10)
    if (!isNaN(sprintIndex) && sprintIndex >= 0 && sprintIndex < sprints.length) {
      setActiveSprint(sprintIndex)
    }
  }

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    // Use our utility function to update task status
    setColumns(updateTaskStatus(columns, taskId, newStatus));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 size={32} className="animate-spin text-[#0052CC]" />
      </div>
    )
  }

  const currentSprint = sprints[activeSprint] || {}

  return (
    <div className="mb-8 relative">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <Tabs defaultValue="developer" className="w-full" onValueChange={setActiveView}>
            <div className="flex flex-wrap items-center justify-between">
              <TabsList>
                <TabsTrigger value="developer">Developer Plan</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant Plan</TabsTrigger>
              </TabsList>
              
              {sprints.length > 0 && (
                <div className="w-[350px] mt-2 md:mt-0">
                  <Select value={activeSprint.toString()} onValueChange={handleSprintChange}>
                    <SelectTrigger className="w-full truncate">
                      <div className="flex items-center w-full truncate">
                        <span className="truncate text-sm font-medium">
                          {currentSprint.name || 'Select a sprint'}
                        </span>
                        {currentSprint.duration && (
                          <span className="ml-2 flex-shrink-0 text-xs text-[#6B778C] inline-flex items-center">
                            <Clock size={12} className="mr-1" />
                            {currentSprint.duration}
                          </span>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="w-[350px]">
                      {sprints.map((sprint, index) => (
                        <SelectItem key={`sprint-${index}-${activeView}`} value={index.toString()} className="w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{sprint.name}</span>
                            {index === activeSprint && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          
            <TabsContent value="developer" className="mt-4">
              <h3 className="text-lg font-medium text-[#172B4D] mb-4">Developer Implementation Plan</h3>
              
              {sprints.length > 0 ? (
                <>
                  {/* Use our SprintInfoCard component */}
                  <SprintInfoCard 
                    sprintName={currentSprint.name}
                    sprintFocus={currentSprint.focus}
                    currentSprintIndex={activeSprint}
                    totalSprints={sprints.length}
                    onPrevious={handlePreviousSprint}
                    onNext={handleNextSprint}
                  />
                  
                  {/* Use our EnhancedJiraBoard component */}
                  <div className="border border-[#DFE1E6] rounded-md" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
                    <EnhancedJiraBoard columns={columns} setColumns={setColumns} />
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 flex justify-center">
                    <p className="text-[#6B778C]">No sprints available for this plan</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="ai" className="mt-4">
              <h3 className="text-lg font-medium text-[#172B4D] mb-4">AI Assistant Implementation Plan</h3>
              
              {sprints.length > 0 ? (
                <>
                  {/* Use our SprintInfoCard component */}
                  <SprintInfoCard 
                    sprintName={currentSprint.name}
                    sprintFocus={currentSprint.focus}
                    currentSprintIndex={activeSprint}
                    totalSprints={sprints.length}
                    onPrevious={handlePreviousSprint}
                    onNext={handleNextSprint}
                  />
                  
                  {/* AI Assistant Tasks - Different view that emphasizes the prompts */}
                  <div className="space-y-2">
                    {/* Show task counts by status */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="bg-white border border-[#DFE1E6] rounded-md px-3 py-2 text-sm">
                        <span className="font-medium text-[#172B4D]">To Do:</span> 
                        <span className="ml-1 text-[#42526E]">{columns[0]?.tasks.length || 0}</span>
                      </div>
                      <div className="bg-white border border-[#DFE1E6] rounded-md px-3 py-2 text-sm">
                        <span className="font-medium text-[#172B4D]">In Progress:</span> 
                        <span className="ml-1 text-[#42526E]">{columns[1]?.tasks.length || 0}</span>
                      </div>
                      <div className="bg-white border border-[#DFE1E6] rounded-md px-3 py-2 text-sm">
                        <span className="font-medium text-[#172B4D]">Done:</span> 
                        <span className="ml-1 text-[#42526E]">{columns[2]?.tasks.length || 0}</span>
                      </div>
                    </div>
                    
                    {/* Display all tasks from all columns in the list view */}
                    {columns.flatMap(column => column.tasks).map((task) => (
                      <AITaskCard 
                        key={task.id}
                        task={task}
                        onStatusChange={handleTaskStatusChange}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 flex justify-center">
                    <p className="text-[#6B778C]">No sprints available for this plan</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default SprintPlanView 