"use client"

import './globals.css'
import JiraHeader from '@/components/JiraHeader'
import { Inter } from 'next/font/google'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>Jira</title>
        <link rel="icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" />
      </head>
      <body className="min-h-screen bg-[#F4F5F7]">
        <SidebarProvider>
          <JiraHeader />
          <div id="main-content" className="absolute top-[48px] left-0 right-0 bottom-0 overflow-auto">
            {children}
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
