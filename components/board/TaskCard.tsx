"use client"

import React from 'react';
import { 
  Square, 
  CheckSquare, 
  MoreVertical, 
  UserCircle2,
  Workflow,
  Zap,
  ArrowUpRight,
  Clock,
  CalendarCheck
} from 'lucide-react';
import { TaskCardProps } from './types';
import Link from 'next/link';

interface ExtendedTaskCardProps extends TaskCardProps {
  onTaskClick?: (task: TaskCardProps['task']) => void;
}

const TaskCard: React.FC<ExtendedTaskCardProps> = ({
  task,
  columnId,
  onDragStart,
  onDragEnd,
  onToggleCompletion,
  onMenuToggle,
  // Mark as intentionally unused but keep it for future use
  // isMenuOpen is consumed in parent component but not here
  isMenuOpen: _isMenuOpen, 
  onTaskClick
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening the modal when clicking on the menu or checkbox
    if (e.target instanceof Element) {
      const target = e.target as Element;
      const isMenuTrigger = target.closest('button');
      const isLink = target.closest('a');
      if (isMenuTrigger || isLink) return;
    }
    
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  // Determine if this is a linked task (project or feature)
  const isLinkedTask = task.type && task.linkedId;

  // Get the appropriate detail link URL and icon based on task type
  const getDetailLinkAndIcon = () => {
    if (!isLinkedTask) return { url: null, icon: null, color: null };
    
    if (task.type === 'project') {
      return { 
        url: `/projects/${task.linkedId}`,
        icon: <Workflow size={14} className="text-[#00875A]" />,
        color: 'bg-[#E3FCEF] text-[#00875A]'
      };
    } else if (task.type === 'feature') {
      return { 
        url: `/features/${task.linkedId}`,
        icon: <Zap size={14} className="text-[#6554C0]" />,
        color: 'bg-[#EAE6FF] text-[#6554C0]'
      };
    }
    
    return { url: null, icon: null, color: null };
  };
  
  const { url, icon, color } = getDetailLinkAndIcon();

  // Determine card border and background colors based on status and type
  const getCardStyle = () => {
    // Base card style for all cards
    let baseStyle = "group bg-white rounded-sm shadow-sm p-3 cursor-pointer hover:bg-[#F4F5F7] relative";
    
    // Add border styling based on type
    if (task.type === 'project') {
      baseStyle += ' border-l-4 border-l-[#00875A] border-t border-r border-b border-[#DFE1E6]';
    } else if (task.type === 'feature') {
      baseStyle += ' border-l-4 border-l-[#6554C0] border-t border-r border-b border-[#DFE1E6]';
    } else {
      baseStyle += ' border border-[#DFE1E6]';
    }
    
    // Add status-based styling
    if (task.isCompleted) {
      baseStyle += ' bg-[#F4F5F7]';
    }
    
    return baseStyle;
  };

  return (
    <div 
      draggable
      onDragStart={() => onDragStart(task)}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
      className={getCardStyle()}
    >
      {/* Card content */}
      <div className="space-y-2">
        {/* Top row with title and menu */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-[#172B4D] flex-grow">
            {task.content}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            {isLinkedTask && url && (
              <Link 
                href={url}
                onClick={(e) => e.stopPropagation()}
                className="text-[#6B778C] hover:text-[#42526E] p-1 inline-block"
                title={task.type === 'project' ? 'View Project Details' : 'View Feature Details'}
              >
                <ArrowUpRight size={14} />
              </Link>
            )}
            <button 
              className="text-[#6B778C] hover:text-[#42526E] p-1"
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle(task.id);
              }}
            >
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
        
        {/* Display type badge if it's a linked task */}
        {isLinkedTask && (
          <div className="flex items-center">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${color}`}>
              {icon}
              <span className="ml-1 font-medium">
                {task.type === 'project' ? 'Project' : 'Feature'}
              </span>
            </span>
          </div>
        )}
        
        {/* Task metadata row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompletion(task.id, columnId);
              }}
              className="text-[#42526E] hover:text-[#0052CC]"
            >
              {task.isCompleted ? (
                <CheckSquare size={16} className="text-[#0052CC]" />
              ) : (
                <Square size={16} />
              )}
            </button>
            <div className="ml-2 flex items-center">
              <span className="text-xs font-medium text-[#42526E]">{task.taskId}</span>
            </div>
          </div>
          
          {/* Task status indicators */}
          <div className="flex items-center gap-2">
            {columnId === 'inprogress' && (
              <span title="In Progress" className="text-[#0052CC]">
                <Clock size={14} />
              </span>
            )}
            {columnId === 'done' && (
              <span title="Completed" className="text-[#00875A]">
                <CalendarCheck size={14} />
              </span>
            )}
            <div className="text-[#42526E]">
              <UserCircle2 size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 