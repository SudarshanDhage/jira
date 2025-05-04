"use client"

import React, { useState } from 'react';
import { 
  Globe, 
  AlignLeft, 
  Calendar, 
  ListChecks, 
  FileText, 
  Target, 
  LayoutDashboard, 
  Code, 
  Archive, 
  FileStack, 
  Link,
  Maximize2,
  Share2,
  Zap,
  Plus,
  Search,
  User,
  Filter,
  ChevronDown,
  LayoutPanelLeft,
  LayoutGrid,
  MoreHorizontal
} from 'lucide-react';
import JiraBoardContent from './board/JiraBoardContent';
import EmptyStateView from './board/EmptyStateView';
import { useSidebar } from '@/contexts/SidebarContext';

type ViewType = 'board' | 'summary' | 'timeline' | 'calendar' | 'list' | 'forms' | 'goals' | 'code' | 'archived' | 'pages';

/**
 * JiraBoard Component
 * 
 * This is the main component that renders the entire Jira board UI,
 * including the project header, navigation tabs, toolbar, and board content.
 * 
 * It uses a modular approach with smaller specialized components for better
 * maintainability and separation of concerns.
 */
const JiraBoard: React.FC = () => {
  const { sidebarOpen } = useSidebar();
  const [activeView, setActiveView] = useState<ViewType>('board');
  
  return (
    <div className="bg-white w-full">
      {/* Project header with tabs */}
      <div className="border-b border-[#EBECF0]">
        <div className="px-6 pt-3 pb-0">
          <div className="flex justify-between mb-4">
            <div>
              <div className="mb-3">
                <span className="text-[#42526E] text-xs font-medium uppercase">Projects</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#FFAB00] rounded mr-2 flex items-center justify-center border border-[#DFE1E6]">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" 
                    alt="Company Logo" 
                    width="16" 
                    height="16" 
                  />
                </div>
                <span className="text-[#172B4D] text-2xl font-medium">Company</span>
                <button className="ml-2 text-[#6B778C] hover:text-[#42526E]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#DFE1E6] hover:bg-[#F4F5F7]">
                <Maximize2 size={16} className="text-[#42526E]" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#DFE1E6] hover:bg-[#F4F5F7]">
                <Share2 size={16} className="text-[#42526E]" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#DFE1E6] hover:bg-[#F4F5F7]">
                <Zap size={16} className="text-[#42526E]" />
              </button>
            </div>
          </div>
          
          {/* Navigation tabs */}
          <div className="flex border-b border-[#EBECF0] overflow-x-auto no-scrollbar">
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'summary' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('summary')}
            >
              <Globe size={14} className="mr-2" />
              <span className="text-sm font-medium">Summary</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'timeline' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('timeline')}
            >
              <AlignLeft size={14} className="mr-2" />
              <span className="text-sm font-medium">Timeline</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'board' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('board')}
            >
              <LayoutDashboard size={14} className="mr-2" />
              <span className="text-sm font-medium">Board</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'calendar' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('calendar')}
            >
              <Calendar size={14} className="mr-2" />
              <span className="text-sm font-medium">Calendar</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'list' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('list')}
            >
              <ListChecks size={14} className="mr-2" />
              <span className="text-sm font-medium">List</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'forms' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('forms')}
            >
              <FileText size={14} className="mr-2" />
              <span className="text-sm font-medium">Forms</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'goals' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('goals')}
            >
              <Target size={14} className="mr-2" />
              <span className="text-sm font-medium">Goals</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'code' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('code')}
            >
              <Code size={14} className="mr-2" />
              <span className="text-sm font-medium">Code</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'archived' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('archived')}
            >
              <Archive size={14} className="mr-2" />
              <span className="text-sm font-medium">Archived work items</span>
            </button>
            <button 
              className={`flex items-center py-3 px-3 whitespace-nowrap ${
                activeView === 'pages' 
                  ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                  : 'text-[#42526E] hover:text-[#0052CC] hover:bg-[#F4F5F7]'
              }`}
              onClick={() => setActiveView('pages')}
            >
              <FileStack size={14} className="mr-2" />
              <span className="text-sm font-medium">Pages</span>
            </button>
            <div className="flex items-center py-3 px-3 text-[#42526E] whitespace-nowrap">
              <Link size={14} className="mr-2" />
              <span className="text-sm font-medium">Shortcuts</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
            <button className="ml-auto py-3 px-3 text-[#42526E] hover:bg-[#F4F5F7] flex-shrink-0">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Board toolbar - only show for board view */}
      {activeView === 'board' && (
        <div className="flex items-center px-6 py-3 border-b border-[#EBECF0] overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search board"
                className="h-[32px] w-[180px] px-8 py-1 text-sm border border-[#DFE1E6] rounded-sm bg-[#FAFBFC] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-transparent"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-[#42526E]" />
            </div>
            
            <div className="flex items-center">
              <button className="flex items-center h-[32px] px-2 py-1 border border-[#DFE1E6] rounded-sm bg-[#FAFBFC] hover:bg-[#F4F5F7]">
                <User size={14} className="text-[#42526E] mr-1" />
                <div className="w-6 h-6 bg-[#0055CC] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">US</span>
                </div>
              </button>
            </div>
            
            <button className="flex items-center h-[32px] px-2 py-1 border border-[#DFE1E6] rounded-sm bg-[#FAFBFC] hover:bg-[#F4F5F7]">
              <Filter size={14} className="text-[#42526E] mr-1" />
              <span className="text-sm text-[#42526E]">Filter</span>
            </button>
          </div>
          
          <div className="ml-auto flex items-center space-x-2">
            <button className="flex items-center h-[32px] px-2 py-1 border border-[#DFE1E6] rounded-sm bg-[#FAFBFC] hover:bg-[#F4F5F7]">
              <span className="text-sm text-[#42526E] font-medium">Group</span>
              <ChevronDown size={14} className="ml-1 text-[#42526E]" />
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#F4F5F7] border border-[#DFE1E6]">
              <LayoutPanelLeft size={16} className="text-[#42526E]" />
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#F4F5F7] border border-[#DFE1E6]">
              <LayoutGrid size={16} className="text-[#42526E]" />
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#F4F5F7] border border-[#DFE1E6]">
              <MoreHorizontal size={16} className="text-[#42526E]" />
            </button>
          </div>
        </div>
      )}
      
      {/* View content based on selected tab */}
      {activeView === 'board' ? (
        <JiraBoardContent 
          _sidebarOpen={sidebarOpen} 
          data={{ columns: [] }}
          onReorder={() => {}} 
        />
      ) : (
        <EmptyStateView viewType={activeView as any} />
      )}
    </div>
  );
};

export default JiraBoard; 