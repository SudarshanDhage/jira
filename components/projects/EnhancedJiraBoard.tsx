"use client"

import React, { useEffect, useState, useRef } from 'react'
import { MoreHorizontal, Clock, MessageSquare, GitCommit, ChevronDown, ChevronUp } from 'lucide-react'
import { Column, Task, Comment } from '@/components/board/types'

// Inline UI components
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ size = 'md', className, children, ...props }) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-base'
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={`flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  );
};

interface EnhancedJiraBoardProps {
  columns: Column[]
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
}

const EnhancedJiraBoard: React.FC<EnhancedJiraBoardProps> = ({ columns, setColumns }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commitId, setCommitId] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showCommitForm, setShowCommitForm] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Calculate column width based on the number of columns and container width
  useEffect(() => {
    const calculateColumnWidth = () => {
      if (!boardRef.current) return;
      const containerWidth = boardRef.current.offsetWidth;
      const columnCount = columns.length;
      const minColumnWidth = 280; // Minimum column width
      const padding = 16; // Padding on both sides
      
      // Calculate optimal column width while maintaining minimum
      const optimalWidth = Math.max(
        minColumnWidth,
        Math.floor((containerWidth - (padding * 2) - (columnCount * 8)) / columnCount)
      );
      
      // Apply the width to all column elements
      const columnElements = boardRef.current.querySelectorAll('.jira-column');
      columnElements.forEach((el) => {
        (el as HTMLElement).style.width = `${optimalWidth}px`;
      });
    };
    
    calculateColumnWidth();
    
    // Add resize listener
    window.addEventListener('resize', calculateColumnWidth);
    return () => window.removeEventListener('resize', calculateColumnWidth);
  }, [columns.length]);
  
  const handleDragStart = (e: React.DragEvent, task: Task, columnId: string) => {
    setDraggedTask(task);
    setDraggedFromColumn(columnId);
    
    // Set data transfer for better cross-browser compatibility
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    // For better drag-and-drop visuals
    if (e.dataTransfer.setDragImage) {
      const ghostElement = e.currentTarget.cloneNode(true) as HTMLElement;
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      ghostElement.style.opacity = '0.8';
      ghostElement.style.transform = 'rotate(2deg)';
      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, 20, 20);
      
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
    }
    
    // Add dragging class to task
    const taskElement = e.currentTarget as HTMLElement;
    taskElement.classList.add('opacity-50');
  };
  
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };
  
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    if (draggedTask && draggedFromColumn) {
      // Only update state if dropping in a different column
      if (columnId !== draggedFromColumn) {
        // Create updated columns
        const updatedColumns = columns.map(column => {
          // Remove from source column
          if (column.id === draggedFromColumn) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== draggedTask.id)
            };
          }
          
          // Add to target column
          if (column.id === columnId) {
            // Update the task to reflect its new status
            const updatedTask = {
              ...draggedTask,
              status: columnId
            };
            
            return {
              ...column,
              tasks: [...column.tasks, updatedTask]
            };
          }
          
          return column;
        });
        
        setColumns(updatedColumns);
      }
    }
    
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    // Reset the opacity for the dragged task
    const taskElement = e.currentTarget as HTMLElement;
    taskElement.classList.remove('opacity-50');
    
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    // Initialize commit ID if it exists
    if (task.commitId) {
      setCommitId(task.commitId);
    } else {
      setCommitId('');
    }
    // Reset states
    setShowComments(false);
    setShowCommentForm(false);
    setShowCommitForm(false);
  };

  const handleAddComment = () => {
    if (!selectedTask || !commentText.trim()) return;
    
    // Create new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: commentText,
      author: 'User', // Could be replaced with actual user name
      timestamp: Date.now()
    };
    
    // Add comment to the task
    const updatedTask = {
      ...selectedTask,
      comments: [...(selectedTask.comments || []), newComment]
    };
    
    // Update the task in columns
    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === selectedTask.id ? updatedTask : task
      )
    }));
    
    setColumns(updatedColumns);
    setSelectedTask(updatedTask);
    setCommentText('');
  };

  const handleUpdateCommitId = () => {
    if (!selectedTask) return;
    
    // Update commit ID
    const updatedTask = {
      ...selectedTask,
      commitId: commitId
    };
    
    // Update the task in columns
    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === selectedTask.id ? updatedTask : task
      )
    }));
    
    setColumns(updatedColumns);
    setSelectedTask(updatedTask);
  };

  const handleCommitIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommitId(e.target.value);
  };

  const handleCommentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Board content */}
      <div 
        ref={boardRef}
        className="flex p-4 bg-white w-full h-full"
      >
        {columns.map(column => (
          <div 
            key={column.id} 
            className={`jira-column flex-shrink-0 mx-2 flex flex-col h-full
              ${dragOverColumn === column.id ? 'bg-[#F8F9FA]' : ''}
              transition-colors duration-100`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column header - fixed */}
            <div className="bg-[#F4F5F7] rounded-t p-2 mb-2 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-[#42526E]">{column.title}</h3>
                <span className="ml-2 text-xs bg-[#DFE1E6] px-2 py-0.5 rounded-full text-[#42526E]">
                  {column.tasks.length}
                </span>
              </div>
              <div className="flex items-center">
                <button className="text-[#6B778C] hover:text-[#42526E] p-1">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
            
            {/* Column tasks - scrollable */}
            <div className="space-y-2 min-h-[50px] pb-2 overflow-y-auto flex-1 pr-1" style={{ maxHeight: 'calc(100% - 40px)' }}>
              {column.tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`bg-white border rounded-sm shadow-sm p-3 cursor-move hover:bg-[#F4F5F7]
                    ${draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'}
                    transform transition-transform duration-100 ease-in-out hover:translate-y-[-2px] hover:shadow-md`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="text-sm font-medium text-[#172B4D] mb-2">
                    {task.content}
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-medium text-[#42526E] bg-[#DFE1E6] px-1.5 py-0.5 rounded">
                      {task.taskId}
                    </span>
                    {task.sprintName && (
                      <span className="text-xs bg-[#E3FCEF] text-[#00875A] px-2 py-0.5 rounded-full">
                        {task.sprintName}
                      </span>
                    )}
                    {task.priority && (
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                        task.priority === 'high' 
                          ? 'bg-[#E5493A]' 
                          : task.priority === 'medium' 
                          ? 'bg-[#FF8B00]' 
                          : 'bg-[#4CAF50]'
                      }`}>
                        {task.priority || 'medium'}
                      </span>
                    )}
                    {task.estimatedHours && (
                      <span className="text-xs text-[#6B778C] flex items-center">
                        <Clock size={12} className="mr-1" />
                        {task.estimatedHours}h
                      </span>
                    )}
                    {/* Show comment count if there are any */}
                    {task.comments && task.comments.length > 0 && (
                      <span className="text-xs text-[#6B778C] flex items-center">
                        <MessageSquare size={12} className="mr-1" />
                        {task.comments.length}
                      </span>
                    )}
                    {/* Show commit ID indicator if exists */}
                    {task.commitId && (
                      <span className="text-xs text-[#6B778C] flex items-center">
                        <GitCommit size={12} className="mr-1" />
                      </span>
                    )}
                    {task.description && (
                      <span className="text-xs text-[#6B778C] block w-full mt-1 line-clamp-2">
                        {task.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Empty column state with drop indicator */}
              {column.tasks.length === 0 && (
                <div className={`h-16 border-2 border-dashed rounded flex items-center justify-center
                  ${dragOverColumn === column.id ? 'border-[#4C9AFF] bg-[#DEEBFF]' : 'border-[#DFE1E6]'}
                  transition-colors duration-100`}>
                  <span className="text-xs text-[#6B778C]">
                    {dragOverColumn === column.id 
                      ? 'Drop to add task here'
                      : 'No tasks yet'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Task preview modal - would be replaced with a proper modal in a real implementation */}
      {selectedTask && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div 
            className="bg-white rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-xs font-medium text-[#42526E] bg-[#DFE1E6] px-1.5 py-0.5 rounded mr-2">
                  {selectedTask.taskId}
                </span>
                <h2 className="text-xl font-medium text-[#172B4D]">{selectedTask.content}</h2>
              </div>
              
              {selectedTask.sprintName && (
                <div className="mb-4">
                  <span className="text-sm text-[#6B778C] font-medium">Sprint:</span>
                  <span className="ml-2 text-sm bg-[#E3FCEF] text-[#00875A] px-2 py-0.5 rounded-full">
                    {selectedTask.sprintName}
                  </span>
                </div>
              )}

              {selectedTask.estimatedHours && (
                <div className="mb-4">
                  <span className="text-sm text-[#6B778C] font-medium">Estimated time:</span>
                  <span className="ml-2 text-sm text-[#172B4D]">
                    {selectedTask.estimatedHours} hours
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#6B778C] mb-2">Description</h3>
                <p className="text-sm text-[#172B4D]">{selectedTask.description || 'No description provided.'}</p>
              </div>

              {selectedTask.implementation && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] mb-2">Implementation Details</h3>
                  <p className="text-sm text-[#172B4D] whitespace-pre-line">{selectedTask.implementation}</p>
                </div>
              )}

              {selectedTask.acceptanceCriteria && selectedTask.acceptanceCriteria.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] mb-2">Acceptance Criteria</h3>
                  <ul className="list-disc pl-5">
                    {selectedTask.acceptanceCriteria.map((criteria, index) => (
                      <li key={index} className="text-sm text-[#172B4D] mb-1">{criteria}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTask.dependencies && selectedTask.dependencies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] mb-2">Dependencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.dependencies.map((dep, index) => (
                      <span key={index} className="text-xs bg-[#DEEBFF] text-[#0052CC] px-2 py-1 rounded">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments section - if there are comments, show them with a toggle */}
              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <div className="mb-4 mt-6 border-t border-[#DFE1E6] pt-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer text-[#42526E] hover:text-[#172B4D]"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <h3 className="text-sm font-medium flex items-center">
                      <MessageSquare size={16} className="mr-2" />
                      Comments ({selectedTask.comments.length})
                    </h3>
                    {showComments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  
                  {showComments && (
                    <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
                      {selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="bg-[#F8F9FA] p-3 rounded border border-[#DFE1E6]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-[#42526E]">{comment.author}</span>
                            <span className="text-xs text-[#6B778C]">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#172B4D]">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Action buttons section at the bottom */}
              <div className="mt-6 pt-4 border-t border-[#DFE1E6]">
                <div className="flex flex-wrap gap-3 mb-4">
                  <button 
                    className="flex items-center gap-1 text-sm bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#42526E] px-3 py-2 rounded-md transition-colors"
                    onClick={() => {
                      setShowCommentForm(!showCommentForm);
                      setShowCommitForm(false);
                    }}
                  >
                    <MessageSquare size={16} />
                    {showCommentForm ? 'Cancel' : 'Add Comment'}
                  </button>
                  
                  <button 
                    className="flex items-center gap-1 text-sm bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#42526E] px-3 py-2 rounded-md transition-colors"
                    onClick={() => {
                      setShowCommitForm(!showCommitForm);
                      setShowCommentForm(false);
                    }}
                  >
                    <GitCommit size={16} />
                    {showCommitForm ? 'Cancel' : (selectedTask.commitId ? 'Update Commit ID' : 'Add Commit ID')}
                  </button>
                </div>
                
                {/* Comment form */}
                {showCommentForm && (
                  <div className="mb-6 bg-[#F8F9FA] p-4 rounded border border-[#DFE1E6]">
                    <h3 className="text-sm font-medium text-[#172B4D] mb-3 flex items-center">
                      <MessageSquare size={16} className="mr-2" />
                      Add New Comment
                    </h3>
                    <Textarea 
                      placeholder="Type your comment here..."
                      value={commentText}
                      onChange={handleCommentTextChange}
                      className="text-sm min-h-[100px] mb-3"
                    />
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        className="bg-[#0052CC] hover:bg-[#0747A6] text-white"
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                      >
                        Add Comment
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Commit ID form */}
                {showCommitForm && (
                  <div className="mb-6 bg-[#F8F9FA] p-4 rounded border border-[#DFE1E6]">
                    <h3 className="text-sm font-medium text-[#172B4D] mb-3 flex items-center">
                      <GitCommit size={16} className="mr-2" />
                      {selectedTask.commitId ? 'Update Commit ID' : 'Add Commit ID'}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Input 
                        placeholder="Enter the commit ID for this task" 
                        value={commitId}
                        onChange={handleCommitIdChange}
                        className="text-sm"
                      />
                      <Button 
                        size="sm" 
                        className="bg-[#0052CC] hover:bg-[#0747A6] text-white whitespace-nowrap"
                        onClick={handleUpdateCommitId}
                      >
                        Save
                      </Button>
                    </div>
                    {selectedTask.commitId && (
                      <p className="text-xs text-[#6B778C]">
                        Current commit: <span className="font-mono bg-[#DFE1E6] px-1 py-0.5 rounded">{selectedTask.commitId}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="px-4 py-2 bg-[#0052CC] text-white rounded hover:bg-[#0065FF] text-sm font-medium"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedJiraBoard; 