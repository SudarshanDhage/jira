"use client"

import React from 'react'
import Link from 'next/link'
import { 
  Clock, 
  Star, 
  LayoutGrid, 
  ScrollText, 
  FolderKanban, 
  ListFilter, 
  BarChart3, 
  Users, 
  Target, 
  Settings2, 
  MessageSquarePlus,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Workflow,
  Zap
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useSidebar } from '@/contexts/SidebarContext'

interface JiraSidebarProps {
  isOpen: boolean
}

const JiraSidebar: React.FC<JiraSidebarProps> = ({ isOpen }) => {
  const { activeSection, setActiveSection } = useSidebar();
  
  if (!isOpen) return null

  // Function to handle navigation item clicks
  const handleNavClick = (section: string, href?: string) => {
    // Set active section
    setActiveSection(section);
    
    // If no href is provided, it's just a sidebar state change, not navigation
    if (!href) {
      // You could add additional logic here if needed
    }
  };

  return (
    <aside className="relative w-[240px] bg-white border-r border-[#EBECF0] overflow-y-auto flex flex-col h-full">
      <div className="flex flex-col flex-grow overflow-y-auto">
        {/* Top section */}
        <div className="px-3 py-2">
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'foryou' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('foryou')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <Clock size={16} />
              </div>
              <span className="text-sm font-medium">For you</span>
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center justify-between px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'recent' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('recent')}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <span className="text-sm font-medium">Recent</span>
              </div>
              <ChevronRight size={16} />
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center justify-between px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'starred' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('starred')}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Star size={16} />
                </div>
                <span className="text-sm font-medium">Starred</span>
              </div>
              <ChevronRight size={16} />
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center justify-between px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'apps' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('apps')}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <LayoutGrid size={16} />
                </div>
                <span className="text-sm font-medium">Apps</span>
              </div>
              <MoreHorizontal size={16} />
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`pl-8 flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'explore' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('explore')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <LayoutGrid size={16} />
              </div>
              <span className="text-sm font-medium">Explore more apps</span>
            </div>
          </Link>
          
          {/* AI Sprint Plans Section - NEW */}
          <div className="relative">
            <Link href="/projects">
              <div 
                className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] ${
                  activeSection === 'sprints' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
                }`}
                onClick={() => handleNavClick('sprints')}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Workflow size={16} className="text-[#00875A]" />
                </div>
                <span className="text-sm font-medium">Sprint Projects</span>
              </div>
            </Link>
            <Badge 
              variant="new" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              New
            </Badge>
          </div>
          
          {/* Feature Plans Section - NEW */}
          <div className="relative">
            <Link href="/features">
              <div 
                className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] ${
                  activeSection === 'features' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
                }`}
                onClick={() => handleNavClick('features')}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Zap size={16} className="text-[#6554C0]" />
                </div>
                <span className="text-sm font-medium">Feature Plans</span>
              </div>
            </Link>
            <Badge 
              variant="feature" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              New
            </Badge>
          </div>
          
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'plans' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('plans')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <ScrollText size={16} />
              </div>
              <span className="text-sm font-medium">Plans</span>
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center justify-between px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'projects' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('projects')}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <FolderKanban size={16} />
                </div>
                <span className="text-sm font-medium">Projects</span>
              </div>
              <div className="flex items-center">
                <Plus size={16} className="mr-1" />
                <MoreHorizontal size={16} />
              </div>
            </div>
          </Link>
        </div>
        
        {/* Recent projects section */}
        <div className="px-5 py-1 mt-1">
          <span className="text-xs text-[#6B778C] font-semibold">Recent</span>
        </div>
        
        {/* Selected project - Always shows Jira Board */}
        <div className="px-3">
          <Link href="/">
            <div className={`flex items-center px-2 py-2 rounded text-[#0052CC] bg-[#E6EFFC]`}>
              <div className="w-5 h-5 bg-blue-100 rounded mr-3 flex items-center justify-center">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" 
                  alt="Jira Logo" 
                  width="16" 
                  height="16" 
                />
              </div>
              <span className="text-sm font-medium">Jira Board</span>
            </div>
          </Link>
        </div>
        
        {/* Project navigation */}
        <div className="px-3 mt-2">
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'allprojects' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('allprojects')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center opacity-70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium">View all projects</span>
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'filters' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('filters')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center opacity-70">
                <ListFilter size={16} />
              </div>
              <span className="text-sm font-medium">Filters</span>
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'dashboards' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('dashboards')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center opacity-70">
                <BarChart3 size={16} />
              </div>
              <span className="text-sm font-medium">Dashboards</span>
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'teams' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('teams')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center opacity-70">
                <Users size={16} />
              </div>
              <span className="text-sm font-medium">Teams</span>
            </div>
          </Link>
          
          <Link href="/">
            <div 
              className={`flex items-center justify-between px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'goals' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('goals')}
            >
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center opacity-70">
                  <Target size={16} />
                </div>
                <span className="text-sm font-medium">Goals</span>
              </div>
              <div className="flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
          
          {/* Customize sidebar - moved below Goals */}
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'customize' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('customize')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center opacity-70">
                <Settings2 size={16} />
              </div>
              <span className="text-sm font-medium">Customize sidebar</span>
            </div>
          </Link>
        </div>
        
        {/* Spacer to push feedback to bottom */}
        <div className="flex-grow"></div>
        
        {/* Feedback section at bottom */}
        <div className="px-3 py-3 border-t border-[#EBECF0] mt-auto">
          <Link href="/">
            <div 
              className={`flex items-center px-2 py-2 rounded hover:bg-[#F4F5F7] text-[#42526E] cursor-pointer ${
                activeSection === 'feedback' ? 'bg-[#E6EFFC] text-[#0052CC]' : ''
              }`}
              onClick={() => handleNavClick('feedback')}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <MessageSquarePlus size={16} />
              </div>
              <span className="text-sm font-medium">Give feedback on the new sidebar</span>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default JiraSidebar 