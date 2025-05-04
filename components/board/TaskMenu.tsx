"use client"

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Task } from './types';

interface TaskMenuProps {
  taskId: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onDelete: (taskId: string) => void;
  onChangeStatus: (taskId: string, newStatus: string) => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({
  taskId,
  menuRef,
  onDelete,
  onChangeStatus
}) => {
  return (
    <div 
      ref={menuRef}
      className="absolute z-10 top-12 right-0 bg-white shadow-lg border border-[#DFE1E6] rounded-sm w-[240px] overflow-hidden"
    >
      <div className="py-2 border-b border-[#DFE1E6]">
        <button 
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]"
          onClick={() => {}}
        >
          <span>Change status</span>
          <ChevronRight size={14} />
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]">
          <span>Copy link</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]">
          <span>Copy key</span>
        </button>
      </div>
      <div className="py-2 border-b border-[#DFE1E6]">
        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]">
          <span>Add flag</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]">
          <span>Add label</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]">
          <span>Link work item</span>
        </button>
      </div>
      <div className="py-2">
        <button className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]">
          <span>Archive</span>
        </button>
        <button 
          className="flex items-center w-full px-4 py-2 text-sm text-left text-[#42526E] hover:bg-[#F4F5F7]"
          onClick={() => onDelete(taskId)}
        >
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskMenu; 