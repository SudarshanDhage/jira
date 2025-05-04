/**
 * Types and helpers for sprint planning
 */

/**
 * Creates a task for a specific feature
 */
export function createFeatureTask(feature: any, taskIndex: number, sprintIndex: number, type: string): any {
  const taskId = type === "developer" ? 
    `dev-s${sprintIndex + 1}-t${taskIndex + 1}` : 
    `ai-s${sprintIndex + 1}-t${taskIndex + 1}`;
  
  if (type === "developer") {
    return {
      id: taskId,
      title: `Implement ${feature.name}`,
      feature: feature.name,
      description: `Complete implementation of the ${feature.name} feature: ${feature.description}`,
      implementation: `
        1. Create the necessary models/schemas for ${feature.name}
        2. Implement backend API endpoints for ${feature.name}
        3. Create frontend components for ${feature.name}
        4. Connect frontend and backend
        5. Add validation and error handling
        6. Write tests for the implementation
      `,
      type: "full-stack",
      priority: "high",
      estimatedHours: 8,
      dependencies: [],
      acceptanceCriteria: [
        `${feature.name} is fully implemented according to specifications`,
        "Feature is tested and working correctly",
        "Code is well-documented and follows project standards"
      ]
    };
  } else {
    return {
      id: taskId,
      title: `Implement ${feature.name} with AI assistance`,
      feature: feature.name,
      description: `End-to-end implementation of the ${feature.name} feature: ${feature.description}`,
      implementation: `Complete implementation of ${feature.name} feature with all necessary components and functionality`,
      type: "full-stack",
      priority: "high",
      estimatedHours: 6,
      dependencies: [],
      aiPrompt: `
        Create a complete implementation for ${feature.name}. 
        
        Requirements:
        - ${feature.description}
        - Follow best practices for this type of implementation
        - Include proper error handling and documentation
        - Make code modular and maintainable
        - Add comprehensive tests for the implementation
        
        Provide all necessary code, configuration, and documentation for this task.
      `
    };
  }
}

/**
 * Merges task lists, avoiding duplicates
 */
export function mergeTaskLists(existingTasks: any[], newTasks: any[]): any[] {
  // Create a map of task titles to avoid duplicates
  const taskMap = new Map();
  
  // Add existing tasks to the map
  existingTasks.forEach(task => {
    taskMap.set(task.title.toLowerCase(), task);
  });
  
  // Add new tasks if they don't duplicate existing ones
  newTasks.forEach(task => {
    if (!taskMap.has(task.title.toLowerCase())) {
      taskMap.set(task.title.toLowerCase(), task);
    }
  });
  
  // Return the combined tasks
  return Array.from(taskMap.values());
}

/**
 * Creates standard tasks for each sprint type
 */
export function createStandardTasks(sprintIndex: number, taskTypes: string[], type: string): any[] {
  // Different standard tasks based on sprint index
  const sprintTaskTemplates = [
    // Sprint 1: Setup tasks
    [
      { name: "Project Repository Setup", desc: "Initialize the project repository with proper structure and configuration" },
      { name: "Development Environment Setup", desc: "Configure development environments with necessary tools and dependencies" },
      { name: "CI/CD Pipeline Configuration", desc: "Set up continuous integration and deployment pipelines" },
      { name: "Architecture Design", desc: "Create detailed architecture documents and diagrams" },
      { name: "Basic Project Structure", desc: "Implement the foundational project structure and boilerplate code" }
    ],
    // Sprint 2: Core Features tasks
    [
      { name: "Database Schema Design", desc: "Design and implement the database schema for core entities" },
      { name: "Authentication System", desc: "Implement user authentication and authorization" },
      { name: "Core API Endpoints", desc: "Develop essential API endpoints for core functionality" },
      { name: "Basic UI Components", desc: "Create reusable UI components for the application" },
      { name: "State Management Setup", desc: "Configure state management solutions for the application" }
    ],
    // Sprint 3: Advanced Features tasks
    [
      { name: "External API Integration", desc: "Integrate with required external APIs and services" },
      { name: "Advanced Search Functionality", desc: "Implement advanced search and filtering capabilities" },
      { name: "Real-time Updates", desc: "Add real-time functionality using WebSockets or similar technology" },
      { name: "Analytics Integration", desc: "Implement analytics tracking and reporting" },
      { name: "Notification System", desc: "Create a comprehensive notification system" }
    ],
    // Sprint 4: Testing and Refinement tasks
    [
      { name: "Comprehensive Testing Suite", desc: "Develop unit, integration, and end-to-end tests" },
      { name: "UI/UX Improvements", desc: "Enhance user interface and experience based on feedback" },
      { name: "Accessibility Compliance", desc: "Ensure application meets accessibility standards" },
      { name: "Performance Optimization", desc: "Optimize application performance and loading times" },
      { name: "Error Handling Enhancement", desc: "Improve error handling and user feedback throughout the application" }
    ],
    // Sprint 5: Deployment tasks
    [
      { name: "Production Environment Setup", desc: "Configure production environment and infrastructure" },
      { name: "Security Audit", desc: "Conduct security review and implement necessary improvements" },
      { name: "Documentation", desc: "Create comprehensive user and developer documentation" },
      { name: "Final QA Testing", desc: "Perform final quality assurance testing before release" },
      { name: "Deployment Strategy", desc: "Implement rollout plan including backup and rollback procedures" }
    ]
  ];
  
  const templateIndex = Math.min(sprintIndex, sprintTaskTemplates.length - 1);
  const templates = sprintTaskTemplates[templateIndex];
  
  return templates.map((template, taskIndex) => {
    const taskId = type === "developer" ? 
      `dev-s${sprintIndex + 1}-t${taskIndex + 1}` : 
      `ai-s${sprintIndex + 1}-t${taskIndex + 1}`;
    
    if (type === "developer") {
      return {
        id: taskId,
        title: template.name,
        feature: "Infrastructure",
        description: template.desc,
        implementation: `
          Detailed implementation for ${template.name}:
          1. Research best practices for ${template.name}
          2. Design implementation approach
          3. Implement the solution with proper testing
          4. Document the implementation for other developers
        `,
        type: taskTypes[taskIndex % taskTypes.length],
        priority: taskIndex < 2 ? "high" : (taskIndex < 4 ? "medium" : "low"),
        estimatedHours: 4 + (taskIndex * 2),
        dependencies: taskIndex > 0 ? [`dev-s${sprintIndex + 1}-t${taskIndex}`] : [],
        acceptanceCriteria: [
          `${template.name} is successfully implemented`,
          "Implementation is well-documented",
          "All tests pass successfully"
        ]
      };
    } else {
      return {
        id: taskId,
        title: template.name,
        feature: "Infrastructure",
        description: template.desc,
        implementation: `Complete implementation of ${template.name} with all necessary components`,
        type: "full-stack",
        priority: taskIndex < 2 ? "high" : (taskIndex < 4 ? "medium" : "low"),
        estimatedHours: 3 + (taskIndex * 1.5),
        dependencies: taskIndex > 0 ? [`ai-s${sprintIndex + 1}-t${taskIndex}`] : [],
        aiPrompt: `
          Create a complete implementation for ${template.name}. 
          
          Requirements:
          - ${template.desc}
          - Follow best practices for this type of implementation
          - Include proper error handling and documentation
          - Make code modular and maintainable
          - Add comprehensive tests for the implementation
          
          Provide all necessary code, configuration, and documentation for this task.
        `
      };
    }
  });
} 