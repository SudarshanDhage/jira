"use client"

import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Clock, MessageSquare, GitCommit, ChevronDown, ChevronUp } from 'lucide-react'
import { Task, Comment } from '@/components/board/types'

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

interface AITaskCardProps {
  task: Task
  onStatusChange: (taskId: string, newStatus: string) => void
}

const AITaskCard: React.FC<AITaskCardProps> = ({ task, onStatusChange }) => {
  // Toast notification state
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' })
  // State for comment and commit ID functionality
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [showCommitForm, setShowCommitForm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commitId, setCommitId] = useState(task.commitId || '')

  // Function to copy prompt to clipboard with custom toast notification
  const copyPromptToClipboard = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        // Show toast notification
        setToast({ visible: true, message: 'Prompt copied to clipboard!' });
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setToast({ visible: false, message: '' });
        }, 3000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        setToast({ visible: true, message: 'Failed to copy prompt. Please try again.' });
        
        // Hide toast after 3 seconds for error message too
        setTimeout(() => {
          setToast({ visible: false, message: '' });
        }, 3000);
      });
  };

  // Function to add a comment to the task
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    // Create new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: commentText,
      author: 'User', // Could be replaced with actual user name
      timestamp: Date.now()
    };
    
    // Add comment to the task
    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), newComment]
    };
    
    // Update the task status to trigger a re-render
    onStatusChange(task.id, task.status || 'todo');
    
    // Reset state
    setCommentText('');
    setShowCommentForm(false);
    
    // Show success toast
    setToast({ visible: true, message: 'Comment added successfully!' });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  // Function to update commit ID
  const handleUpdateCommitId = () => {
    // Update commit ID
    const updatedTask = {
      ...task,
      commitId: commitId
    };
    
    // Update the task status to trigger a re-render
    onStatusChange(task.id, task.status || 'todo');
    
    // Reset state
    setShowCommitForm(false);
    
    // Show success toast
    setToast({ visible: true, message: 'Commit ID updated successfully!' });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  return (
    <>
      {/* Custom Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-8 right-8 z-50 transition-all transform translate-y-0 opacity-100 duration-300">
          <div className="bg-gradient-to-r from-[#0065FF] to-[#0052CC] text-white px-5 py-3 rounded-md shadow-xl flex items-center border border-[#4C9AFF]/30">
            <div className="bg-white/20 p-1 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-medium">{toast.message}</span>
              <div className="h-1 w-full bg-white/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full w-full bg-white origin-left animate-[shrink_3s_ease-in-out]" 
                     style={{ animation: 'shrink 3s ease-in-out forwards' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card 
        key={task.id} 
        className={`mb-4 border-l-4 ${
          task.status === 'done' 
            ? 'border-l-[#36B37E] bg-[#F4FFF9]' 
            : task.status === 'inprogress' 
              ? 'border-l-[#0052CC] bg-[#F8FAFF]' 
              : 'border-l-[#8777D9]'
        }`}
      >
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md flex items-center">
              <span className="text-xs font-medium bg-[#DFE1E6] text-[#42526E] px-2 py-0.5 rounded mr-2">
                {task.taskId}
              </span>
              {task.content}
            </CardTitle>
            <div className="flex items-center gap-2">
              {task.priority && (
                <span className={`text-xs px-2 py-0.5 rounded-full text-white flex-shrink-0 ${
                  task.priority === 'high' 
                    ? 'bg-[#E5493A]' 
                    : task.priority === 'medium' 
                    ? 'bg-[#FF8B00]' 
                    : 'bg-[#4CAF50]'
                }`}>
                  {task.priority}
                </span>
              )}
              {/* Indicators shown in the header */}
              {task.comments && task.comments.length > 0 && (
                <span className="text-xs text-[#6B778C] flex items-center">
                  <MessageSquare size={12} className="mr-1" />
                  {task.comments.length}
                </span>
              )}
              {task.commitId && (
                <span className="text-xs text-[#6B778C] flex items-center">
                  <GitCommit size={12} className="mr-1" />
                </span>
              )}
            </div>
          </div>
          <CardDescription className="mt-1">
            {task.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center justify-between mb-4">
            {task.estimatedHours && (
              <div className="text-xs text-[#6B778C] flex items-center">
                <Clock size={12} className="mr-1" />
                Estimated: {task.estimatedHours} hours
              </div>
            )}
            
            {/* Task status controls */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-[#6B778C]">Status:</div>
              <div className="flex border border-[#DFE1E6] rounded-md overflow-hidden">
                <button 
                  className={`px-2 py-1 text-xs ${
                    task.status === 'todo' 
                      ? 'bg-[#DEEBFF] text-[#0052CC]' 
                      : 'bg-white text-[#42526E] hover:bg-[#F4F5F7]'
                  }`}
                  onClick={() => onStatusChange(task.id, 'todo')}
                >
                  To Do
                </button>
                <button 
                  className={`px-2 py-1 text-xs ${
                    task.status === 'inprogress' 
                      ? 'bg-[#DEEBFF] text-[#0052CC]' 
                      : 'bg-white text-[#42526E] hover:bg-[#F4F5F7]'
                  }`}
                  onClick={() => onStatusChange(task.id, 'inprogress')}
                >
                  In Progress
                </button>
                <button 
                  className={`px-2 py-1 text-xs ${
                    task.status === 'done' 
                      ? 'bg-[#E3FCEF] text-[#00875A]' 
                      : 'bg-white text-[#42526E] hover:bg-[#F4F5F7]'
                  }`}
                  onClick={() => onStatusChange(task.id, 'done')}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
          
          {/* Special section for AI Prompt with copy button */}
          {task.aiPrompt && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#172B4D]">AI Prompt:</h3>
                <button 
                  className="text-xs bg-[#0052CC] text-white px-3 py-1 rounded hover:bg-[#0065FF] focus:ring-2 focus:ring-[#4C9AFF] transition-colors"
                  onClick={() => copyPromptToClipboard(task.aiPrompt || '')}
                >
                  Copy Prompt
                </button>
              </div>
              <div className="bg-[#F8F9FA] border border-[#DFE1E6] rounded p-3 text-sm text-[#172B4D] whitespace-pre-line">
                {task.aiPrompt}
              </div>
            </div>
          )}
          
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="mt-3">
              <h3 className="text-xs font-medium text-[#6B778C] mb-1">Dependencies:</h3>
              <div className="flex flex-wrap gap-1">
                {task.dependencies.map((dep, index) => (
                  <span key={index} className="text-xs bg-[#DEEBFF] text-[#0052CC] px-2 py-0.5 rounded">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Comments section - if there are comments, show them with a toggle */}
          {task.comments && task.comments.length > 0 && (
            <div className="mt-4 border-t border-[#DFE1E6] pt-3">
              <div 
                className="flex items-center justify-between cursor-pointer text-[#42526E] hover:text-[#172B4D]"
                onClick={() => setShowComments(!showComments)}
              >
                <h3 className="text-xs font-medium flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  Comments ({task.comments.length})
                </h3>
                {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              
              {showComments && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="bg-[#F8F9FA] p-2 rounded border border-[#DFE1E6] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#42526E]">{comment.author}</span>
                        <span className="text-[#6B778C]">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#172B4D]">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        {/* Card Footer - Contains action buttons for comments and commit ID */}
        <CardFooter className="pt-0 pb-3 flex flex-wrap gap-2 justify-end border-t border-[#DFE1E6] mt-2">
          {/* Comment form */}
          {showCommentForm && (
            <div className="w-full mt-3 mb-3 bg-[#F8F9FA] p-3 rounded border border-[#DFE1E6]">
              <h4 className="text-xs font-medium text-[#172B4D] mb-2 flex items-center">
                <MessageSquare size={12} className="mr-1" />
                Add Comment
              </h4>
              
              <Textarea 
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                className="text-xs min-h-[60px] mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  className="bg-[#0052CC] hover:bg-[#0747A6] text-white"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  Add
                </Button>
                <Button 
                  size="sm" 
                  className="border border-[#DFE1E6] bg-white text-[#42526E]"
                  onClick={() => setShowCommentForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Commit ID form */}
          {showCommitForm && (
            <div className="w-full mt-3 mb-3 bg-[#F8F9FA] p-3 rounded border border-[#DFE1E6]">
              <h4 className="text-xs font-medium text-[#172B4D] mb-2 flex items-center">
                <GitCommit size={12} className="mr-1" />
                Commit ID
              </h4>
              
              <Input 
                placeholder="Enter the commit ID for this task"
                value={commitId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommitId(e.target.value)}
                className="text-xs mb-2"
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  className="bg-[#0052CC] hover:bg-[#0747A6] text-white"
                  onClick={handleUpdateCommitId}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  className="border border-[#DFE1E6] bg-white text-[#42526E]"
                  onClick={() => setShowCommitForm(false)}
                >
                  Cancel
                </Button>
              </div>
              
              {task.commitId && (
                <p className="text-xs mt-2 text-[#6B778C]">
                  Current commit: <span className="font-mono bg-[#DFE1E6] px-1 py-0.5 rounded">{task.commitId}</span>
                </p>
              )}
            </div>
          )}
          
          {/* Action buttons */}
          <Button 
            size="sm" 
            className="border border-[#DFE1E6] bg-white text-[#42526E] text-xs"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <MessageSquare size={12} className="mr-1" />
            {showCommentForm ? 'Cancel' : (task.comments && task.comments.length > 0 ? 'Add Comment' : 'Add Comment')}
          </Button>
          
          <Button 
            size="sm" 
            className="border border-[#DFE1E6] bg-white text-[#42526E] text-xs"
            onClick={() => setShowCommitForm(!showCommitForm)}
          >
            <GitCommit size={12} className="mr-1" />
            {showCommitForm ? 'Cancel' : (task.commitId ? 'Update Commit ID' : 'Add Commit ID')}
          </Button>
        </CardFooter>
      </Card>

      {/* Add this style tag for the progress bar animation */}
      <style jsx>{`
        @keyframes shrink {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </>
  )
}

export default AITaskCard 