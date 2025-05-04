'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type SidebarContextType = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  activeSection: 'company', // Default to company view
  setActiveSection: () => {}
})

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('company')

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, activeSection, setActiveSection }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext) 