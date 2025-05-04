import { createFeatureTask, mergeTaskLists, createStandardTasks } from './sprint-models';

/**
 * Enhances a partial sprint plan with missing features
 */
export function enhanceSprintPlan(partialPlan: any, projectData: any, allFeatures: any[]): any {
  console.log("Enhancing sprint plan with missing features");
  
  // Extract existing sprints or create new ones
  const devSprints = partialPlan.developerSprintPlan?.sprints || [];
  const aiSprints = partialPlan.aiSprintPlan?.sprints || [];
  
  // Create full sprint plans, using existing ones as a base
  const fullDevSprints = ensureCompleteSprintPlan(devSprints, allFeatures, "developer", 5);
  const fullAiSprints = ensureCompleteSprintPlan(aiSprints, allFeatures, "ai", 5);
  
  // Return the enhanced plan
  return {
    developerSprintPlan: {
      sprints: fullDevSprints
    },
    aiSprintPlan: {
      sprints: fullAiSprints
    }
  };
}

/**
 * Ensures a complete sprint plan with all required features
 */
function ensureCompleteSprintPlan(existingSprints: any[], features: any[], type: string, minSprintsCount: number): any[] {
  // If we already have enough sprints, use those
  if (existingSprints.length >= minSprintsCount) {
    return addMissingFeaturesToSprints(existingSprints, features, type);
  }
  
  // Otherwise, create new sprints and add existing ones
  const sprints = createBasicSprints({ coreFeatures: features }, minSprintsCount, type);
  
  // Merge existing sprints into the new ones
  for (let i = 0; i < existingSprints.length && i < sprints.length; i++) {
    // Combine tasks, removing duplicates
    const existingTasks = existingSprints[i].tasks || [];
    const newTasks = sprints[i].tasks || [];
    
    // Use existing sprint data but ensure tasks are comprehensive
    sprints[i] = {
      ...existingSprints[i],
      tasks: mergeTaskLists(existingTasks, newTasks)
    };
  }
  
  return sprints;
}

/**
 * Adds missing features to existing sprints
 */
function addMissingFeaturesToSprints(sprints: any[], features: any[], type: string): any[] {
  // Extract all existing task texts to check for feature coverage
  const allTaskText = sprints.flatMap((sprint: any) => 
    (sprint.tasks || []).map((task: any) => 
      `${task.feature || ''} ${task.title || ''} ${task.description || ''}`
    )
  ).join(' ').toLowerCase();
  
  // Find features that aren't covered
  const missingFeatures = features.filter(feature => 
    !allTaskText.includes(feature.name.toLowerCase())
  );
  
  // If no missing features, return the sprints unchanged
  if (missingFeatures.length === 0) {
    return sprints;
  }
  
  console.log(`Adding ${missingFeatures.length} missing features to sprints`);
  
  // Distribute missing features across later sprints (core in earlier, advanced in later)
  const updatedSprints = [...sprints];
  
  missingFeatures.forEach((feature, index) => {
    // Determine which sprint to add this feature to
    // Core features go to sprint 2, others to later sprints
    const targetSprintIndex = Math.min(
      1 + (index % (updatedSprints.length - 1)), 
      updatedSprints.length - 1
    );
    
    // Create a task for this feature
    const newTask = createFeatureTask(feature, updatedSprints[targetSprintIndex].tasks.length, targetSprintIndex, type);
    
    // Add the task to the sprint
    updatedSprints[targetSprintIndex].tasks.push(newTask);
  });
  
  return updatedSprints;
}

/**
 * Creates a comprehensive sprint plan from scratch
 */
export function createComprehensiveSprintPlan(projectData: any, features: any[]): any {
  console.log("Creating comprehensive sprint plan from scratch");
  
  // Ensure we have at least 5 sprints for a comprehensive plan
  const devSprints = createDetailedSprints(projectData, features, 5, "developer");
  const aiSprints = createDetailedSprints(projectData, features, 5, "ai");
  
  return {
    developerSprintPlan: {
      sprints: devSprints
    },
    aiSprintPlan: {
      sprints: aiSprints
    }
  };
}

/**
 * Creates detailed sprints with proper structure and tasks
 */
function createDetailedSprints(projectData: any, features: any[], count: number, type: string): any[] {
  // Define sprint focuses for a comprehensive plan
  const sprintFocuses = [
    {
      name: "Project Setup and Infrastructure",
      focus: "Setting up the project environment, infrastructure, and basic architecture",
      taskTypes: ["setup", "configuration", "infrastructure"]
    },
    {
      name: "Core Features Implementation",
      focus: "Implementing the essential features that form the foundation of the application",
      taskTypes: ["feature", "core", "essential"]
    },
    {
      name: "Advanced Features and Integration",
      focus: "Building advanced features and integrating with external systems",
      taskTypes: ["advanced", "integration", "api"]
    },
    {
      name: "UI/UX Refinement and Testing",
      focus: "Improving the user interface, user experience, and comprehensive testing",
      taskTypes: ["ui", "ux", "testing", "refinement"]
    },
    {
      name: "Optimization, Documentation, and Deployment",
      focus: "Optimizing performance, creating documentation, and preparing for deployment",
      taskTypes: ["optimization", "documentation", "deployment"]
    }
  ];
  
  // Create sprints with the defined focuses
  return Array.from({ length: count }, (_, sprintIndex) => {
    const focus = sprintFocuses[sprintIndex % sprintFocuses.length];
    
    // Calculate which features to include in this sprint
    const featuresPerSprint = Math.ceil(features.length / count);
    const startIdx = sprintIndex * featuresPerSprint;
    const endIdx = Math.min(startIdx + featuresPerSprint, features.length);
    const sprintFeatures = features.slice(startIdx, endIdx);
    
    // Add standard tasks for this sprint type
    const standardTasks = createStandardTasks(sprintIndex, focus.taskTypes, type);
    
    // Add feature-specific tasks
    const featureTasks = sprintFeatures.map((feature, idx) => 
      createFeatureTask(feature, standardTasks.length + idx, sprintIndex, type)
    );
    
    // Combine all tasks
    const allTasks = [...standardTasks, ...featureTasks];
    
    return {
      name: `Sprint ${sprintIndex + 1}: ${focus.name}`,
      duration: "2 weeks",
      focus: focus.focus,
      tasks: allTasks
    };
  });
}

/**
 * Creates basic sprints for projects
 */
export function createBasicSprints(projectData: any, count: number, type: string): any[] {
  console.log(`Creating ${count} basic ${type} sprints from project data`);
  
  // Extract core features to use as task basis
  const coreFeatures = projectData?.coreFeatures || [];
  const suggestedFeatures = projectData?.suggestedFeatures || [];
  const allFeatures = [...coreFeatures, ...suggestedFeatures];
  
  // If we don't have any features, create some generic ones
  const genericFeatures = allFeatures.length > 0 ? [] : [
    { id: "f1", name: "User Authentication", description: "Implement user login/registration" },
    { id: "f2", name: "Data Management", description: "Create data models and storage" },
    { id: "f3", name: "User Interface", description: "Build responsive UI components" },
    { id: "f4", name: "API Integration", description: "Connect to external APIs" },
    { id: "f5", name: "Testing", description: "Implement testing framework" },
    { id: "f6", name: "Deployment", description: "Set up CI/CD and deployment" }
  ];
  
  const featuresForTasks = allFeatures.length > 0 ? allFeatures : genericFeatures;
  
  // Create different sprint focuses
  const sprintFocuses = [
    {
      name: "Project Setup and Foundation",
      focus: "Setting up the project environment, infrastructure, and basic architecture"
    },
    {
      name: "Core Features Implementation",
      focus: "Implementing the essential features that form the foundation of the application"
    },
    {
      name: "Advanced Features and Integration",
      focus: "Building advanced features and integrating with external systems"
    },
    {
      name: "UI/UX Refinement and Testing",
      focus: "Improving the user interface, user experience, and comprehensive testing"
    },
    {
      name: "Optimization and Deployment",
      focus: "Optimizing performance, creating documentation, and preparing for deployment"
    }
  ];
  
  // Create count number of sprints
  return Array.from({ length: count }, (_, sprintIndex) => {
    // Calculate which features to include in this sprint
    const featuresPerSprint = Math.ceil(featuresForTasks.length / count);
    const startIdx = sprintIndex * featuresPerSprint;
    const endIdx = Math.min(startIdx + featuresPerSprint, featuresForTasks.length);
    const sprintFeatures = featuresForTasks.slice(startIdx, endIdx);
    
    // Create tasks for this sprint
    const tasks = sprintFeatures.map((feature, idx) => 
      createFeatureTask(feature, idx, sprintIndex, type)
    );
    
    // Add some standard infrastructure tasks if this is the first sprint
    if (sprintIndex === 0) {
      const setupTasks = [
        { name: "Project Setup", description: "Initialize the project repository and structure" },
        { name: "Development Environment", description: "Set up development environment with all dependencies" },
        { name: "CI/CD Configuration", description: "Configure continuous integration and deployment pipelines" }
      ].map((task, idx) => ({
        id: type === "developer" ? `dev-s1-t${idx}` : `ai-s1-t${idx}`,
        title: task.name,
        feature: "Infrastructure",
        description: task.description,
        implementation: `Complete setup of ${task.name}`,
        type: "setup",
        priority: "high",
        estimatedHours: 4,
        dependencies: [],
        acceptanceCriteria: [`${task.name} is properly configured`],
        ...(type === "ai" ? { aiPrompt: `Set up ${task.name} with best practices` } : {})
      }));
      
      // Add setup tasks to the beginning
      tasks.unshift(...setupTasks);
    }
    
    // Add testing tasks if this is the last sprint
    if (sprintIndex === count - 1) {
      const testingTasks = [
        { name: "Integration Testing", description: "Create comprehensive integration tests" },
        { name: "Deployment Preparation", description: "Prepare the application for production deployment" }
      ].map((task, idx) => ({
        id: type === "developer" ? `dev-s${count}-t${tasks.length + idx}` : `ai-s${count}-t${tasks.length + idx}`,
        title: task.name,
        feature: "Quality Assurance",
        description: task.description,
        implementation: `Implement ${task.name}`,
        type: "testing",
        priority: "high",
        estimatedHours: 6,
        dependencies: [],
        acceptanceCriteria: [`${task.name} is successfully completed`],
        ...(type === "ai" ? { aiPrompt: `Create a comprehensive ${task.name} solution` } : {})
      }));
      
      // Add testing tasks to the end
      tasks.push(...testingTasks);
    }
    
    const focus = sprintFocuses[sprintIndex % sprintFocuses.length];
    
    return {
      name: `Sprint ${sprintIndex + 1}: ${focus.name}`,
      duration: "2 weeks",
      focus: focus.focus,
      tasks: tasks
    };
  });
} 