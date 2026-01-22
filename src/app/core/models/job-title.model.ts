export interface JobTitle {
  id: string;
  name: string;
  description: string;
}

export interface CreateJobTitleRequest {
  name: string;
  description: string;
}

export interface UpdateJobTitleRequest {
  id: string;
  name: string;
  description: string;
}
