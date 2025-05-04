"use client"

import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  MessageCircle, 
  Link as LinkIcon, 
  ThumbsUp,
  Activity,
  ChevronDown,
  ChevronUp,
  Settings,
  Pin,
  FileEdit,
  Share,
  MoreHorizontal,
  Eye,
  Lock,
  Plus,
  AppWindow
} from 'lucide-react';
import { TaskModalProps } from './types';

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask
}) => {
  const [description, setDescription] = useState('');
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [developmentExpanded, setDevelopmentExpanded] = useState(false);
  const [automationExpanded, setAutomationExpanded] = useState(false);
  const [hoveringSeparator, setHoveringSeparator] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  
  if (!isOpen || !task) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto p-8 z-50">
      <div className="bg-white rounded-sm shadow-xl max-w-4xl w-full max-h-full overflow-hidden mt-6 flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-[#DFE1E6]">
          <div className="flex items-center">
            <button className="flex items-center text-[#42526E] hover:underline">
              <span className="text-sm">Add epic</span>
            </button>
            <span className="mx-2 text-[#6B778C]">/</span>
            <div className="flex items-center">
              <span className="text-sm text-[#0052CC] font-medium">COM-1</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="flex items-center justify-center w-8 h-8 text-[#42526E] hover:bg-[#F4F5F7] rounded-sm">
              <Lock size={16} className="text-[#6B778C]" />
            </button>
            <div className="ml-1">
              <button className="flex items-center justify-center w-8 h-8 rounded-sm hover:bg-[#F4F5F7]">
                <Eye size={16} className="text-[#6B778C]" />
              </button>
            </div>
            <div className="ml-1">
              <button className="flex items-center justify-center w-8 h-8 text-[#6B778C] hover:bg-[#F4F5F7] rounded-sm">
                <ThumbsUp size={16} />
              </button>
            </div>
            <div className="ml-1">
              <button className="flex items-center justify-center w-8 h-8 text-[#6B778C] hover:bg-[#F4F5F7] rounded-sm">
                <Share size={16} />
              </button>
            </div>
            <div className="ml-1">
              <button className="flex items-center justify-center w-8 h-8 text-[#6B778C] hover:bg-[#F4F5F7] rounded-sm">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="ml-1">
              <button 
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 text-[#6B778C] hover:bg-[#F4F5F7] rounded-sm"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex relative" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {/* Left Content Area */}
          <div className="flex-grow p-6 pr-2 overflow-y-auto">
            {/* Task Title with Add and Apps buttons */}
            <div className="mb-4">
              <h2 className="text-xl font-medium text-[#172B4D] mb-3">{task?.content || "hyiy"}</h2>
              <div className="flex items-center mb-6">
                <button className="flex items-center justify-center h-8 px-3 rounded border border-[#6554C0] bg-white text-[#6554C0] hover:bg-[#F4F5F7] mr-2">
                  <Plus size={16} className="mr-1" />
                  <span className="text-sm">Add</span>
                </button>
                <button className="flex items-center justify-center h-8 px-3 rounded border border-[#DFE1E6] bg-white text-[#42526E] hover:bg-[#F4F5F7]">
                  <AppWindow size={16} className="mr-1" />
                  <span className="text-sm">Apps</span>
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#172B4D] mb-1">Description</h3>
              <p className="text-sm text-[#6B778C]">Add a description...</p>
            </div>
            
            {/* Activity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#172B4D] mb-3">Activity</h3>
              
              {/* Activity Tabs */}
              <div className="mb-4">
                <div className="inline-flex border border-[#DFE1E6] rounded">
                  <button 
                    className={`py-1 px-3 text-sm bg-white text-[#42526E] ${activeTab === 'all' ? 'font-medium' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`py-1 px-3 text-sm bg-white ${activeTab === 'comments' ? 'text-[#0052CC] border-b-2 border-[#0052CC]' : 'text-[#42526E]'}`}
                    onClick={() => setActiveTab('comments')}
                  >
                    Comments
                  </button>
                  <button 
                    className={`py-1 px-3 text-sm bg-white text-[#42526E] ${activeTab === 'history' ? 'font-medium' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    History
                  </button>
                  <button 
                    className={`py-1 px-3 text-sm bg-white text-[#42526E] ${activeTab === 'worklog' ? 'font-medium' : ''}`}
                    onClick={() => setActiveTab('worklog')}
                  >
                    Work log
                  </button>
                </div>
              </div>
              
              {/* Comment Box with Built-in Suggestions */}
              <div className="mb-3 border border-[#DFE1E6] rounded-sm overflow-hidden">
                <div className="flex items-start p-3 pb-0">
                  <div className="w-8 h-8 bg-[#0055CC] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-xs text-white font-medium">SD</span>
                  </div>
                  <div className="flex-grow">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full text-sm text-[#172B4D] border-none outline-none resize-none mb-2 min-h-[80px]"
                    />
                    
                    {/* Comment Suggestions */}
                    <div className="flex flex-wrap border-t border-[#DFE1E6] py-2">
                      <button className="text-sm bg-[#FAFBFC] text-[#42526E] border border-[#DFE1E6] rounded py-1.5 px-3 hover:bg-[#F4F5F7] mr-2 mb-2">
                        Who is working on this...?
                      </button>
                      <button className="text-sm bg-[#FAFBFC] text-[#42526E] border border-[#DFE1E6] rounded py-1.5 px-3 hover:bg-[#F4F5F7] mr-2 mb-2">
                        Can I get more info...?
                      </button>
                      <button className="text-sm bg-[#FAFBFC] text-[#42526E] border border-[#DFE1E6] rounded py-1.5 px-3 hover:bg-[#F4F5F7] mb-2">
                        Status update?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pro Tip */}
              <div className="text-xs text-[#6B778C]">
                Pro tip: press <span className="inline-block px-1.5 py-0.5 bg-[#F4F5F7] border border-[#DFE1E6] rounded text-[#42526E] font-medium">M</span> to comment
              </div>
            </div>
          </div>
          
          {/* Central blue separator that shows on hover */}
          <div 
            className="w-0.5 cursor-col-resize hover:bg-[#0052CC] group absolute top-0 bottom-0 left-[calc(100%-300px-0.25px)]"
            onMouseEnter={() => setHoveringSeparator(true)}
            onMouseLeave={() => setHoveringSeparator(false)}
          >
            <div className={`w-full h-full ${hoveringSeparator ? 'bg-[#0052CC]' : 'bg-transparent'} transition-colors duration-150`}></div>
          </div>
          
          {/* Sidebar */}
          <div className="w-[300px] flex-shrink-0 overflow-y-auto border-l border-[#DFE1E6]">
            {/* Status dropdown and Improve work item button */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#DFE1E6]">
              <div className="flex items-center">
                <span className="text-sm text-[#42526E] mr-2">To Do</span>
                <ChevronDown size={16} className="text-[#42526E]" />
              </div>
              <button className="flex items-center h-8 px-3 rounded-sm text-[#42526E] hover:bg-[#F4F5F7] border border-[#DFE1E6]">
                <span className="text-sm">Improve work item</span>
              </button>
            </div>

            {/* Pinned Fields */}
            <div className="px-4 py-3 border-b border-[#DFE1E6]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-[#42526E]">Pinned fields</h3>
                <button className="text-[#42526E] hover:bg-[#F4F5F7] rounded-sm p-1">
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-[#6B778C]">
                Click on the <span className="inline-block mx-1">⭐</span> next to a field label to start pinning.
              </p>
            </div>
            
            {/* Details Section */}
            <div className="border-b border-[#DFE1E6]">
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#F4F5F7]"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
              >
                <h3 className="text-sm font-medium text-[#42526E]">Details</h3>
                <div className="flex items-center">
                  <button className="text-[#42526E] hover:bg-[#DFE1E6] rounded-sm p-1 mr-1">
                    <Settings size={14} />
                  </button>
                  {detailsExpanded ? <ChevronUp size={14} className="text-[#42526E]" /> : <ChevronDown size={14} className="text-[#42526E]" />}
                </div>
              </div>
              
              {detailsExpanded && (
                <div className="px-4 pb-3">
                  {/* Assignee */}
                  <div className="py-2 flex justify-between items-center hover:bg-[#F4F5F7] rounded-sm group px-2">
                    <div className="text-sm text-[#6B778C] flex items-center">
                      Assignee 
                      <button className="ml-2 opacity-0 group-hover:opacity-100">
                        <Pin size={12} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#EBECF0] rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs text-[#42526E] font-medium">U</span>
                      </div>
                      <span className="text-sm text-[#42526E]">Unassigned</span>
                    </div>
                  </div>
                  <div className="py-1 px-2">
                    <a href="#" className="text-sm text-[#0052CC] hover:underline">Assign to me</a>
                  </div>
                  
                  {/* Labels */}
                  <div className="py-2 flex justify-between items-center hover:bg-[#F4F5F7] rounded-sm group px-2">
                    <div className="text-sm text-[#6B778C] flex items-center">
                      Labels
                      <button className="ml-2 opacity-0 group-hover:opacity-100">
                        <Pin size={12} />
                      </button>
                    </div>
                    <div className="text-sm text-[#42526E]">None</div>
                  </div>
                  
                  {/* Parent */}
                  <div className="py-2 flex justify-between items-center hover:bg-[#F4F5F7] rounded-sm group px-2">
                    <div className="text-sm text-[#6B778C] flex items-center">
                      Parent
                      <button className="ml-2 opacity-0 group-hover:opacity-100">
                        <Pin size={12} />
                      </button>
                    </div>
                    <div className="text-sm text-[#42526E]">None</div>
                  </div>
                  
                  {/* Due date */}
                  <div className="py-2 flex justify-between items-center hover:bg-[#F4F5F7] rounded-sm group px-2">
                    <div className="text-sm text-[#6B778C] flex items-center">
                      Due date
                      <button className="ml-2 opacity-0 group-hover:opacity-100">
                        <Pin size={12} />
                      </button>
                    </div>
                    <div className="text-sm text-[#42526E]">None</div>
                  </div>
                  
                  {/* Team */}
                  <div className="py-2 flex justify-between items-center hover:bg-[#F4F5F7] rounded-sm group px-2">
                    <div className="text-sm text-[#6B778C] flex items-center">
                      Team
                      <button className="ml-2 opacity-0 group-hover:opacity-100">
                        <Pin size={12} />
                      </button>
                    </div>
                    <div className="text-sm text-[#42526E]">None</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Development Section */}
            <div className="border-b border-[#DFE1E6]">
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#F4F5F7]"
                onClick={() => setDevelopmentExpanded(!developmentExpanded)}
              >
                <h3 className="text-sm font-medium text-[#42526E]">Development</h3>
                {developmentExpanded ? <ChevronUp size={14} className="text-[#42526E]" /> : <ChevronDown size={14} className="text-[#42526E]" />}
              </div>
              
              {developmentExpanded && (
                <div className="px-4 pb-3">
                  <div className="py-1 px-2">
                    <button className="flex items-center text-sm text-[#0052CC] hover:underline">
                      <span className="mr-1">🔄</span> Create branch
                    </button>
                  </div>
                  <div className="py-1 px-2">
                    <button className="flex items-center text-sm text-[#0052CC] hover:underline">
                      <span className="mr-1">🔄</span> Create commit
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Reporter Section */}
            <div className="px-4 py-3 border-b border-[#DFE1E6]">
              <div className="flex justify-between items-center hover:bg-[#F4F5F7] rounded-sm group py-2 px-2">
                <div className="text-sm text-[#6B778C] flex items-center">
                  Reporter
                  <button className="ml-2 opacity-0 group-hover:opacity-100">
                    <Pin size={12} />
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-[#00B8D9] rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-white font-medium">SD</span>
                  </div>
                  <span className="text-sm text-[#42526E]">Sudarshan Bhagawan Dhage</span>
                </div>
              </div>
            </div>
            
            {/* Automation Section */}
            <div className="border-b border-[#DFE1E6]">
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#F4F5F7]"
                onClick={() => setAutomationExpanded(!automationExpanded)}
              >
                <h3 className="text-sm font-medium text-[#42526E]">Automation</h3>
                {automationExpanded ? <ChevronUp size={14} className="text-[#42526E]" /> : <ChevronDown size={14} className="text-[#42526E]" />}
              </div>
              
              {automationExpanded && (
                <div className="px-4 pb-3">
                  <div className="py-2 px-2">
                    <span className="text-sm text-[#42526E]">Rule executions</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Created Info */}
            <div className="px-4 py-3 text-xs text-[#6B778C] border-b border-[#DFE1E6]">
              Created 2 days ago
            </div>
            
            {/* Configure Button */}
            <div className="px-4 py-3 flex justify-end items-center">
              <button className="text-[#42526E] hover:bg-[#F4F5F7] rounded-sm p-1">
                <Settings size={14} />
              </button>
              <span className="text-xs text-[#6B778C] ml-1">Configure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal; 