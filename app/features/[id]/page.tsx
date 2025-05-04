import React from 'react'
import FeatureDetailClient from '@/components/features/FeatureDetailClient'
import { Loader2 } from 'lucide-react'

// Server component that safely passes the ID to the client component
export default function FeatureDetailPage({ params }: { params: { id: string } }) {
  return (
    <React.Suspense fallback={
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 size={48} className="animate-spin text-[#6554C0]" />
        </div>
      </div>
    }>
      <FeatureDetailClient featureId={params.id} />
    </React.Suspense>
  )
} 