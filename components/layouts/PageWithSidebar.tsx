"use client"

import React, { ReactNode } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import EmptyStateView from '@/components/board/EmptyStateView'

interface PageWithSidebarProps {
  children: ReactNode;
  pageTitle?: string;
}

const PageWithSidebar: React.FC<PageWithSidebarProps> = ({ 
  children,
  pageTitle = 'Home'
}) => {
  const { activeSection, sidebarOpen } = useSidebar();
  
  // Determine if we should render the main content or an EmptyStateView
  const shouldRenderMainContent = () => {
    // Always show main content for specific routes regardless of sidebar selection
    if (pageTitle === 'Sprint Projects' && activeSection === 'sprints') {
      return true;
    }
    
    if (pageTitle === 'Feature Plans' && activeSection === 'features') {
      return true;
    }
    
    if (pageTitle === 'Home' && activeSection === 'company') {
      return true;
    }
    
    return false;
  };
  
  // For sections with corresponding EmptyStateView types
  const sectionToViewType: Record<string, any> = {
    summary: 'summary',
    timeline: 'timeline',
    calendar: 'calendar', 
    list: 'list',
    forms: 'forms',
    goals: 'goals',
    code: 'code',
    archived: 'archived',
    allprojects: 'allprojects',
    plans: 'pages',
    foryou: 'foryou',
    recent: 'recent',
    starred: 'starred',
    apps: 'apps',
    explore: 'explore',
    filters: 'filters',
    dashboards: 'dashboards',
    teams: 'teams',
    customize: 'customize',
    feedback: 'feedback',
    projects: 'projects'
  };
  
  return (
    <div className={`h-full ${sidebarOpen ? 'ml-[240px]' : ''} transition-all duration-200`}>
      {shouldRenderMainContent() ? (
        children
      ) : (
        <EmptyStateView 
          viewType={sectionToViewType[activeSection] || activeSection} 
        />
      )}
    </div>
  );
};

export default PageWithSidebar; 