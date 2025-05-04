"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Column, Task, JiraBoardProps } from './types';
import BoardColumn from './BoardColumn';
import TaskModal from './TaskModal';
import BoardActions from './BoardActions';

// Initial empty columns state
const initialColumns: Column[] = [
  { id: 'todo', title: 'TO DO', tasks: [] },
  { id: 'inprogress', title: 'IN PROGRESS', tasks: [] },
  { id: 'done', title: 'DONE', tasks: [] }
];

const JiraBoardContent: React.FC<JiraBoardProps> = ({ 
  _sidebarOpen = false, 
  data,
  onReorder 
}) => {
  // Start with empty columns and load from localStorage in useEffect
  const [columns, setColumns] = useState<Column[]>(data?.columns || initialColumns);
  
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const taskIdCounter = useRef(2); // Start from 2 since we already have COM-1

  // Effect to store board state in localStorage
  useEffect(() => {
    // Only load from localStorage on client-side
    const savedColumns = localStorage.getItem('jiraColumns');
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns));
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save columns to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('jiraColumns', JSON.stringify(columns));
    }
  }, [columns, isLoaded]);

  // Effect for handling onReorder callback if provided
  useEffect(() => {
    if (onReorder && isLoaded) {
      onReorder(columns);
    }
  }, [columns, onReorder, isLoaded]);

  const handleCreateClick = (columnId: string) => {
    setActiveColumn(columnId);
    setNewTaskContent('');
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskContent(e.target.value);
  };

  const toggleTaskCompletion = (taskId: string, columnId: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                isCompleted: !task.isCompleted
              };
            }
            return task;
          })
        };
      }
      return column;
    }));
  };
  
  const toggleTaskMenu = (taskId: string) => {
    setOpenMenuTaskId(openMenuTaskId === taskId ? null : taskId);
  };
  
  const deleteTask = (taskId: string) => {
    setOpenMenuTaskId(null);
    
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    })));
  };
  
  const changeTaskStatus = (taskId: string, newColumnId: string) => {
    setOpenMenuTaskId(null);
    
    // Find the task and its column
    let taskToMove: Task | null = null;
    let sourceColumnId: string | null = null;
    
    columns.forEach(column => {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        taskToMove = task;
        sourceColumnId = column.id;
      }
    });
    
    if (taskToMove && sourceColumnId && sourceColumnId !== newColumnId) {
      // Move the task to the new column
      setColumns(columns.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
          };
        }
        if (column.id === newColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, taskToMove!]
          };
        }
        return column;
      }));
    }
  };

  const handleTaskCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskContent.trim() && activeColumn) {
      const newTaskId = `COM-${taskIdCounter.current}`;
      taskIdCounter.current += 1;
      
      const newTask: Task = {
        id: `task-${Date.now()}`,
        content: newTaskContent,
        isCompleted: false,
        taskId: newTaskId
      };

      setColumns(columns.map(column => 
        column.id === activeColumn 
          ? { ...column, tasks: [...column.tasks, newTask] } 
          : column
      ));
      
      setActiveColumn(null);
      setNewTaskContent('');
    }
  };

  const handleAddToBoard = (task: Task) => {
    // Add task to the TODO column by default
    setColumns(columns.map(column => 
      column.id === 'todo' 
        ? { ...column, tasks: [...column.tasks, task] } 
        : column
    ));
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    if (draggedTask) {
      // Find the source column
      const sourceColumn = columns.find(column => 
        column.tasks.some(task => task.id === draggedTask.id)
      );
      
      if (sourceColumn && sourceColumn.id !== columnId) {
        // Remove from source column
        const updatedColumns = columns.map(column => {
          if (column.id === sourceColumn.id) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== draggedTask.id)
            };
          }
          
          // Add to target column
          if (column.id === columnId) {
            // Create a copy of the task to ensure it's not null
            const taskToAdd: Task = { ...draggedTask };
            
            return {
              ...column,
              tasks: [...column.tasks, taskToAdd]
            };
          }
          
          return column;
        });
        
        setColumns(updatedColumns);
      }
    }
    
    handleDragEnd();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    })));
    
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      {/* Board actions in toolbar */}
      <div className="flex items-center px-4 py-2 border-b border-[#EBECF0]">
        <BoardActions onAddToBoard={handleAddToBoard} />
      </div>
      
      {/* Board content */}
      <div className="flex p-4 bg-white overflow-x-auto no-scrollbar" style={{ height: 'calc(100vh - 205px)' }}>
        {columns.map(column => (
          <BoardColumn 
            key={column.id}
            column={column}
            draggedTask={draggedTask}
            activeColumn={activeColumn}
            dragOverColumn={dragOverColumn}
            newTaskContent={newTaskContent}
            openMenuTaskId={openMenuTaskId}
            formRef={formRef}
            menuRef={menuRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onCreateClick={handleCreateClick}
            onTaskInputChange={handleTaskInputChange}
            onTaskCreate={handleTaskCreate}
            onToggleTaskCompletion={toggleTaskCompletion}
            onToggleTaskMenu={toggleTaskMenu}
            onDeleteTask={deleteTask}
            onChangeTaskStatus={changeTaskStatus}
            onTaskClick={handleTaskClick}
          />
        ))}
        
        {/* Add column button */}
        <div className="w-[40px] mx-2 flex items-start flex-shrink-0">
          <button className="w-[32px] h-[32px] bg-[#EBECF0] rounded flex items-center justify-center text-[#42526E] hover:bg-[#DFE1E6]">
            <Plus size={16} />
          </button>
        </div>

        {/* Task Modal */}
        <TaskModal 
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={closeModal}
          onUpdateTask={handleTaskUpdate}
        />
      </div>
    </>
  );
};

export default JiraBoardContent; 