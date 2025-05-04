// Define common types used across the board components

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

export interface Task {
  id: string;
  content: string;
  isCompleted: boolean;
  status?: string;
  priority?: string;
  taskId: string;
  description?: string;
  sprintName?: string;
  sprintId?: string;
  type?: string;
  implementation?: string;
  estimatedHours?: number;
  dependencies?: string[];
  acceptanceCriteria?: string[];
  aiPrompt?: string;
  comments?: Comment[];
  commitId?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface JiraBoardProps {
  data: { columns: Column[] };
  onReorder: (columns: Column[]) => void;
  sidebarOpen?: boolean;
}

export interface TaskCardProps {
  task: Task;
  projectId?: string;
  featureId?: string;
}

export interface ColumnHeaderProps {
  column: Column;
  onAddTask: (columnId: string) => void;
}

export interface TaskModalProps {
  task: Task;
  projectId?: string;
  featureId?: string;
  onClose: () => void;
  isOpen: boolean;
  onUpdateTask: (task: Task) => void;
} 