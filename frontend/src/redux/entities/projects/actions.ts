import { createStandardAction } from 'typesafe-actions';

import { ApiProjectType, ProjectType } from './types';

export const fetchProjectsRequest = createStandardAction('projects/FETCH_PROJECTS_REQUEST')<{
  currentProjectId?: string;
}>();
export const fetchProjectsSuccess = createStandardAction('projects/FETCH_PROJECTS_SUCCESS')<{
  projects: ApiProjectType[];
}>();
export const fetchProjectRequest = createStandardAction('projects/FETCH_PROJECT_REQUEST')<{
  projectId: string;
}>();
export const fetchProjectSuccess = createStandardAction('projects/FETCH_PROJECT_SUCCESS')<{
  byId: Record<string, ProjectType>;
}>();
export const fetchProjectError = createStandardAction('projects/FETCH_PROJECT_ERROR')<{
  projectId: string | null;
  errorMessage: string;
}>();

export default {
  fetchProjectRequest,
  fetchProjectsRequest,
  fetchProjectSuccess,
  fetchProjectError,
};
