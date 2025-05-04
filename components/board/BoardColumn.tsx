"use client"

import React from 'react';
import { Column, Task } from './types';
import ColumnHeader from './ColumnHeader';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import CreateButton from './CreateButton';
import TaskMenu from './TaskMenu';

interface BoardColumnProps {
  column: Column;
  draggedTask?: Task | null;
  activeColumn: string | null;
  dragOverColumn: string | null;
  newTaskContent: string;
  openMenuTaskId: string | null;
  formRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onCreateClick: (columnId: string) => void;
  onTaskInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaskCreate: (e: React.FormEvent) => void;
  onToggleTaskCompletion: (taskId: string, columnId: string) => void;
  onToggleTaskMenu: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onChangeTaskStatus: (taskId: string, newStatus: string) => void;
  onTaskClick?: (task: Task) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  column,
  _draggedTask,
  activeColumn,
  dragOverColumn,
  newTaskContent,
  openMenuTaskId,
  formRef,
  menuRef,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  onCreateClick,
  onTaskInputChange,
  onTaskCreate,
  onToggleTaskCompletion,
  onToggleTaskMenu,
  onDeleteTask,
  onChangeTaskStatus,
  onTaskClick
}) => {
  const isDone = column.id === 'done';
  const isActive = activeColumn === column.id;
  const tasksExist = column.tasks.length > 0;
  
  return (
    <div 
      className="w-[280px] mx-2 flex-shrink-0"
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className={`group bg-[#F4F5F7] rounded p-3 ${dragOverColumn === column.id ? 'border-2 border-[#4C9AFF]' : ''}`}>
        <ColumnHeader 
          title={column.title} 
          taskCount={column.tasks.length}
          isDone={isDone}
        />
        
        {/* Show Create form or button at top if no tasks exist */}
        {isActive ? (
          <CreateTaskForm 
            value={newTaskContent}
            formRef={formRef}
            onChange={onTaskInputChange}
            onSubmit={onTaskCreate}
            onCancel={() => onCreateClick('')}
          />
        ) : (
          !tasksExist && (
            <CreateButton 
              onClick={() => onCreateClick(column.id)} 
              isInTodoColumn={column.id === 'todo'}
            />
          )
        )}
        
        {/* Tasks */}
        <div className="space-y-2 min-h-[60px]">
          {column.tasks.map(task => (
            <React.Fragment key={task.id}>
              <TaskCard 
                task={task}
                columnId={column.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onToggleCompletion={onToggleTaskCompletion}
                onMenuToggle={onToggleTaskMenu}
                isMenuOpen={openMenuTaskId === task.id}
                onTaskClick={onTaskClick}
              />
              
              {openMenuTaskId === task.id && (
                <TaskMenu 
                  taskId={task.id}
                  menuRef={menuRef}
                  onDelete={onDeleteTask}
                  onChangeStatus={onChangeTaskStatus}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Create button at bottom if tasks exist */}
        {!isActive && tasksExist && (
          <div className="mt-2">
            <CreateButton 
              onClick={() => onCreateClick(column.id)} 
              isInTodoColumn={column.id === 'todo'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardColumn; 