import { Task, Column } from '@/components/board/types'

/**
 * Utility functions for Sprint Plan views
 */

/**
 * Map tasks from sprint data to task objects
 * @param currentSprint The current sprint data
 * @param activeView The active view (developer or ai)
 * @param activeSprint The active sprint index
 * @returns Array of Task objects
 */
export function mapSprintTasksToTaskObjects(
  currentSprint: any, 
  activeView: string, 
  activeSprint: number
): Task[] {
  if (!currentSprint || !currentSprint.tasks || !currentSprint.tasks.length) {
    return [];
  }
  
  // Generate a unique timestamp for this mapping operation
  const mapTimestamp = Date.now().toString();
  
  return currentSprint.tasks.map((task: any, taskIndex: number) => {
    // Create a truly unique ID for each task
    const uniqueId = `${mapTimestamp}-${activeView}-s${activeSprint + 1}-t${taskIndex + 1}-${Math.random().toString(36).substring(2, 9)}`;
    const taskId = `${activeView === 'developer' ? 'DEV' : 'AI'}-S${activeSprint + 1}-T${taskIndex + 1}`;
    
    return {
      id: `task-${uniqueId}`,
      content: task.title,
      isCompleted: false,
      taskId,
      description: task.description,
      implementation: task.implementation,
      sprintName: currentSprint.name,
      sprintId: `S${activeSprint + 1}`,
      priority: task.priority || 'medium',
      estimatedHours: task.estimatedHours,
      dependencies: task.dependencies,
      acceptanceCriteria: task.acceptanceCriteria,
      aiPrompt: task.aiPrompt,
      status: 'todo'
    } as Task;
  });
}

/**
 * Create initial column structure with tasks
 * @param tasks Array of Task objects
 * @returns Array of Column objects
 */
export function createInitialColumns(tasks: Task[]): Column[] {
  return [
    { id: 'todo', title: 'TO DO', tasks: [...tasks] },
    { id: 'inprogress', title: 'IN PROGRESS', tasks: [] },
    { id: 'done', title: 'DONE', tasks: [] }
  ];
}

/**
 * Update task status in columns
 * @param columns Current columns
 * @param taskId ID of the task to update
 * @param newStatus New status for the task
 * @returns Updated columns
 */
export function updateTaskStatus(
  columns: Column[], 
  taskId: string, 
  newStatus: string
): Column[] {
  // Find the task in all columns
  let task: Task | undefined;
  const columnKey = newStatus === 'todo' ? 0 : newStatus === 'inprogress' ? 1 : 2;
  
  // Create updated columns with the task removed
  const updatedColumns = columns.map(col => {
    const foundTask = col.tasks.find(t => t.id === taskId);
    if (foundTask) {
      task = foundTask;
    }
    
    return {
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    };
  });
  
  // Add the task to the new column if found
  if (task) {
    updatedColumns[columnKey].tasks.push({
      ...task,
      status: newStatus
    });
  }
  
  return updatedColumns;
} 