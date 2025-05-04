"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, Loader2 } from 'lucide-react'

interface ProjectIdeaFormProps {
  onSubmit: (idea: string) => Promise<void>
  isLoading?: boolean
}

const ProjectIdeaForm: React.FC<ProjectIdeaFormProps> = ({ 
  onSubmit,
  isLoading = false
}) => {
  const [idea, setIdea] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return
    await onSubmit(idea)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl text-[#172B4D]">What would you like to build?</CardTitle>
          <CardDescription>
            Describe your project idea in detail. The more information you provide, the better the AI can help you plan your project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-[#F9FAFC] p-4 rounded-lg border border-[#DFE1E6] flex items-start">
              <Lightbulb size={20} className="text-[#FF8B00] mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#42526E]">
                <p className="font-medium mb-1">Tips for a great project outline:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Include the main purpose or goal of your application</li>
                  <li>Mention key user roles or types (e.g., "users should be able to sign up and create profiles")</li>
                  <li>Specify any important technical requirements or constraints</li>
                  <li>Include any specific features you know you want</li>
                  <li>Specify any integrations with external services if needed</li>
                </ul>
              </div>
            </div>
            
            <Textarea
              placeholder="Describe your project idea here... (e.g., I want to build a task management application where users can create projects, assign tasks, and track progress...)"
              className="min-h-[200px]"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            variant="jira"
            disabled={!idea.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Project Plan'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ProjectIdeaForm 