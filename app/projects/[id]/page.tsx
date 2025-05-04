import React from 'react'
import ProjectDetailClient from '@/components/projects/ProjectDetailClient'
import { Loader2 } from 'lucide-react'

// Define params type according to Next.js 15 dynamic route pattern
type ProjectParams = {
  id: string
}

// Server component that safely passes the ID to the client component
export default async function ProjectDetailPage({
  params
}: {
  params: Promise<ProjectParams>
}) {
  // Properly await the params object to access id
  const { id } = await params
  
  return (
    <React.Suspense fallback={
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 size={48} className="animate-spin text-[#0052CC]" />
        </div>
      </div>
    }>
      <ProjectDetailClient projectId={id} />
    </React.Suspense>
  )
} 