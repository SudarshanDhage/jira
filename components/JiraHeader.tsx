"use client"

import React from 'react'
import Link from 'next/link'
import { Bell, Settings, HelpCircle, LayoutGrid, Search, Plus, Gem, Workflow, Zap, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import JiraSidebar from './JiraSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

const JiraHeader: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center h-[48px] w-full bg-white border-b border-[#EBECF0] shadow-sm px-2 lg:px-4 z-30">
        {/* Left section with panel-right-close, layout grid and Jira logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          {/* Panel Toggle button */}
          <button 
            className="flex items-center justify-center w-10 h-full text-[#42526E] hover:bg-[#F4F5F7]"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <PanelLeftClose size={18} strokeWidth={1.5} /> : <PanelLeftOpen size={18} strokeWidth={1.5} />}
          </button>
          
          {/* Apps button */}
          <button className="flex items-center justify-center w-10 h-full text-[#42526E] hover:bg-[#F4F5F7]">
            <LayoutGrid size={18} strokeWidth={1.5} />
          </button>
          
          {/* Jira Logo and Text */}
          <Link href="/" className="flex items-center h-full px-3 hover:bg-[#F4F5F7]">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" 
              alt="Jira Logo" 
              width="20" 
              height="20" 
              className="mr-2"
            />
            <span className="text-[#42526E] font-medium text-[14px] whitespace-nowrap">Jira</span>
          </Link>
        </div>
        
        {/* Center section with search bar only */}
        <div className="flex flex-1 justify-center mx-4">
          <div className="relative w-full max-w-[500px] flex items-center">
            <div className="absolute left-3 text-[#7A869A]">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="h-[32px] w-full rounded-md border border-[#DFE1E6] bg-white px-9 py-1 text-sm text-[#42526E] placeholder-[#7A869A] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Right section with action buttons and profile */}
        <div className="flex-shrink-0 flex items-center h-full justify-end gap-2 md:gap-3 ml-auto">
          {/* Create button */}
          <button className="flex-shrink-0 flex items-center justify-center h-[32px] bg-[#0052CC] hover:bg-[#0065FF] text-white rounded px-2 md:px-3">
            <Plus size={16} className="md:mr-1" />
            <span className="text-sm font-medium hidden md:inline">Create</span>
          </button>

          {/* Sprint Generation Button - NEW */}
          <div className="relative flex-shrink-0">
            <Link 
              href="/projects/create" 
              className="flex items-center justify-center h-[32px] bg-[#00875A] hover:bg-[#006644] text-white rounded px-2 md:px-3"
            >
              <Workflow size={16} className="md:mr-1" />
              <span className="text-sm font-medium hidden md:inline">Project Sprint</span>
            </Link>
            <Badge 
              variant="new" 
              size="sm" 
              className="absolute -top-2 -right-2"
            >
              New
            </Badge>
          </div>

          {/* Feature Implementation Button - NEW */}
          <div className="relative flex-shrink-0">
            <Link 
              href="/features/create" 
              className="flex items-center justify-center h-[32px] bg-[#6554C0] hover:bg-[#5243AA] text-white rounded px-2 md:px-3"
            >
              <Zap size={16} className="md:mr-1" />
              <span className="text-sm font-medium hidden md:inline">Feature Plan</span>
            </Link>
            <Badge 
              variant="feature" 
              size="sm" 
              className="absolute -top-2 -right-2"
            >
              New
            </Badge>
          </div>
          
          {/* Premium trial button with blue outline - perfect rectangle */}
          <button className="hidden md:flex items-center justify-center h-[32px] border-2 border-[#4C9AFF] hover:bg-[#F4F5F7] text-[#42526E] rounded-none mr-2 md:mr-3 px-2 md:px-3">
            <Gem size={16} className="text-[#6554C0] mr-1" />
            <span className="text-sm font-medium">Premium trial</span>
          </button>
          
          {/* Notifications */}
          <button className="flex items-center justify-center w-8 h-full text-[#42526E] hover:bg-[#F4F5F7]">
            <Bell size={18} strokeWidth={1.5} />
          </button>
          
          {/* Help */}
          <button className="hidden md:flex items-center justify-center w-8 h-full text-[#42526E] hover:bg-[#F4F5F7]">
            <HelpCircle size={18} strokeWidth={1.5} />
          </button>
          
          {/* Settings */}
          <button className="flex items-center justify-center w-8 h-full text-[#42526E] hover:bg-[#F4F5F7]">
            <Settings size={18} strokeWidth={1.5} />
          </button>
          
          {/* Profile Avatar */}
          <div className="flex items-center h-full pl-2">
            <Avatar className="cursor-pointer h-8 w-8 border border-transparent hover:border-[#EBECF0]">
              <AvatarFallback className="bg-[#0055CC] text-white text-xs font-medium">
                US
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      {/* Sidebar Component - moved to absolute positioning for proper scrolling */}
      {sidebarOpen && (
        <div className="absolute top-[48px] left-0 bottom-0 z-20">
          <JiraSidebar isOpen={sidebarOpen} />
        </div>
      )}
    </>
  )
}

export default JiraHeader