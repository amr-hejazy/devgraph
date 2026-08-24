// Shared node, relationship, and result types for the DevGraph graph model.
// These types mirror the properties defined on nodes/relationships in CognoDB
// and are what the API layer returns to the React UI.

export type NodeLabel =
  | "Developer"
  | "Technology"
  | "Project"
  | "Company";

export interface Developer {
  id: string;
  name: string;
  bio: string;
  location: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
}

// A developer with the relationships that surround them on the detail page.
export interface DeveloperWithRelations {
  developer: Developer;
  technologies: Technology[];
  projects: Array<{
    project: Project;
    role: string;
  }>;
  companies: Array<{
    company: Company;
    role: string;
    startYear: number | null;
    endYear: number | null;
  }>;
  collaborators: Developer[];
}

export interface ProjectWithRelations {
  project: Project;
  company: Company | null;
  technologies: Technology[];
  contributors: Array<{
    developer: Developer;
    role: string;
  }>;
}

export interface TechnologyWithRelations {
  technology: Technology;
  projects: Project[];
  developers: Developer[];
}

export interface CompanyWithRelations {
  company: Company;
  developers: Array<{
    developer: Developer;
    role: string;
    startYear: number | null;
    endYear: number | null;
  }>;
  projects: Project[];
}

// Result row for the "potential collaborators" showcase query.
export interface CollaboratorSuggestion {
  developer: Developer;
  sharedTechnologies: string[];
  sharedProjects: string[];
}

// A normalized graph node for lightweight list/search responses.
export interface SearchResult {
  type: NodeLabel;
  id: string;
  label: string;
  detail: string;
}

// Sentinel returned when the database cannot be reached.
export class DatabaseUnavailableError extends Error {
  constructor(message = "The graph database is currently unavailable.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}
