"use client"

import React from 'react';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  onClick: () => void;
  isInTodoColumn: boolean;
}

const CreateButton: React.FC<CreateButtonProps> = ({ 
  onClick, 
  isInTodoColumn 
}) => {
  return (
    <div 
      className={`flex items-center py-1 px-2 text-[#42526E] text-sm cursor-pointer hover:text-[#0052CC] 
        ${!isInTodoColumn ? 'invisible group-hover:visible' : ''}`}
      onClick={onClick}
    >
      <Plus size={16} className="mr-2" />
      <span>Create</span>
    </div>
  );
};

export default CreateButton; 