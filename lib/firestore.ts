import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Project Collections
const PROJECTS_COLLECTION = 'projects';
const SPRINT_PLANS_COLLECTION = 'sprintPlans';
const FEATURES_COLLECTION = 'features';

// Types
export interface Project {
  id?: string;
  title: string;
  description: string;
  coreFeatures: Feature[];
  suggestedFeatures: Feature[];
  createdAt: number;
  techStack?: any;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
}

export interface SprintPlan {
  id?: string;
  projectId: string;
  developerPlan: any;
  aiPlan: any;
  createdAt: number;
}

export interface SingleFeaturePlan {
  id?: string;
  feature: {
    title: string;
    description: string;
  };
  developerPlan: any;
  aiPlan: any;
  createdAt: number;
}

// Projects
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      createdAt: Date.now()
    });
    
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getProjects() {
  try {
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(projectsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

export async function getProject(projectId: string) {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    } else {
      throw new Error('Project not found');
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, data);
    return { id: projectId, ...data };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Sprint Plans
export async function createSprintPlan(sprintPlanData: Omit<SprintPlan, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, SPRINT_PLANS_COLLECTION), {
      ...sprintPlanData,
      createdAt: Date.now()
    });
    
    return { id: docRef.id, ...sprintPlanData };
  } catch (error) {
    console.error('Error creating sprint plan:', error);
    throw error;
  }
}

export async function getSprintPlans(projectId: string) {
  try {
    // First get all sprint plans with the matching projectId
    const sprintPlansQuery = query(
      collection(db, SPRINT_PLANS_COLLECTION),
      where('projectId', '==', projectId)
    );
    
    const querySnapshot = await getDocs(sprintPlansQuery);
    
    // Then sort them in memory by createdAt
    const plans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SprintPlan[];
    
    // Sort from newest to oldest
    return plans.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting sprint plans:', error);
    throw error;
  }
}

export async function getSprintPlan(sprintPlanId: string) {
  try {
    const docRef = doc(db, SPRINT_PLANS_COLLECTION, sprintPlanId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as SprintPlan;
    } else {
      throw new Error('Sprint plan not found');
    }
  } catch (error) {
    console.error('Error getting sprint plan:', error);
    throw error;
  }
}

// Single Feature Plans
export async function createFeaturePlan(featurePlanData: Omit<SingleFeaturePlan, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, FEATURES_COLLECTION), {
      ...featurePlanData,
      createdAt: Date.now()
    });
    
    return { id: docRef.id, ...featurePlanData };
  } catch (error) {
    console.error('Error creating feature plan:', error);
    throw error;
  }
}

export async function getFeaturePlans() {
  try {
    const featurePlansQuery = query(
      collection(db, FEATURES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(featurePlansQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SingleFeaturePlan[];
  } catch (error) {
    console.error('Error getting feature plans:', error);
    throw error;
  }
}

export async function getFeaturePlan(featurePlanId: string) {
  try {
    const docRef = doc(db, FEATURES_COLLECTION, featurePlanId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as SingleFeaturePlan;
    } else {
      throw new Error('Feature plan not found');
    }
  } catch (error) {
    console.error('Error getting feature plan:', error);
    throw error;
  }
} 