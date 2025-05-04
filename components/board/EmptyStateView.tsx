import React from 'react';
import { Search, FileText, Calendar, Target, Code, Archive, AlignLeft, HelpCircle, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateViewProps {
  viewType: 'summary' | 'timeline' | 'calendar' | 'list' | 'forms' | 'goals' | 'code' | 'archived' | 'pages' | 'allprojects' | string;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ viewType }) => {
  // Configuration for different empty states
  const emptyStateConfig: Record<string, any> = {
    summary: {
      icon: <Search className="w-12 h-12 text-gray-300" />,
      title: 'Project summary is empty',
      description: 'Add project data to view summary information and key metrics.',
      actionText: 'Configure Summary',
    },
    timeline: {
      icon: <AlignLeft className="w-12 h-12 text-gray-300" />,
      title: 'Timeline view is empty',
      description: 'Create tasks with dates to visualize your project timeline.',
      actionText: 'Create Timeline',
    },
    calendar: {
      icon: <Calendar className="w-12 h-12 text-gray-300" />,
      title: 'Calendar view is empty',
      description: 'Add tasks with due dates to see them in the calendar.',
      actionText: 'Add Due Dates',
    },
    list: {
      icon: <FileText className="w-12 h-12 text-gray-300" />,
      title: 'List view is empty',
      description: 'Create tasks to see them in a list format.',
      actionText: 'Create Tasks',
    },
    forms: {
      icon: <FileText className="w-12 h-12 text-gray-300" />,
      title: 'No forms available',
      description: 'Create forms to collect structured data for your project.',
      actionText: 'Create Form',
    },
    goals: {
      icon: <Target className="w-12 h-12 text-gray-300" />,
      title: 'No goals set',
      description: 'Define project goals to track your progress.',
      actionText: 'Set Goals',
    },
    code: {
      icon: <Code className="w-12 h-12 text-gray-300" />,
      title: 'No code repositories linked',
      description: 'Connect your code repositories to see them here.',
      actionText: 'Link Repository',
    },
    archived: {
      icon: <Archive className="w-12 h-12 text-gray-300" />,
      title: 'There are no archived work items',
      description: 'Any archived work items in your project will appear here.',
      actionText: 'More about archiving work items',
    },
    pages: {
      icon: <FileText className="w-12 h-12 text-gray-300" />,
      title: 'No pages created',
      description: 'Create documentation pages for your project.',
      actionText: 'Create Page',
    },
    allprojects: {
      icon: <FolderKanban className="w-12 h-12 text-gray-300" />,
      title: 'No projects found',
      description: 'Create a new project or sprint plan to get started.',
      actionText: 'Create Project',
    }
  };

  // Default fallback configuration for any undefined view types
  const defaultConfig = {
    icon: <HelpCircle className="w-12 h-12 text-gray-300" />,
    title: `${viewType.charAt(0).toUpperCase() + viewType.slice(1)} view`,
    description: 'This section is currently under development.',
    actionText: 'Go back',
  };

  // Use the specific config if it exists, otherwise use the default
  const config = emptyStateConfig[viewType] || defaultConfig;

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-220px)] text-center p-6">
      <div className="relative mb-8">
        {/* Main Icon Background */}
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          {config.icon}
        </div>
        
        {/* Question marks around the icon */}
        <div className="absolute -top-2 -left-10">
          <HelpCircle className="w-8 h-8 text-gray-200" />
        </div>
        <div className="absolute -top-8 right-0">
          <HelpCircle className="w-10 h-10 text-gray-200" />
        </div>
        <div className="absolute bottom-0 -right-8">
          <HelpCircle className="w-6 h-6 text-gray-200" />
        </div>
      </div>
      
      <h2 className="text-xl font-medium text-gray-800 mb-2">{config.title}</h2>
      <p className="text-gray-500 max-w-md mb-6">{config.description}</p>
      
      <Button 
        variant="outline" 
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
      >
        {config.actionText}
      </Button>
    </div>
  );
};

export default EmptyStateView; 