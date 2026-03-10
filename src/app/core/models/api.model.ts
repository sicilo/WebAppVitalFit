export interface ApplicationResult<T> {
  value: T | null;
  error: ResultError | null;
  advisories?: string[];
}

export interface ResultError {
  code: string;
  message: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface PagedRequest {
  search?: string;
  page: number;
  itemsPerPage: number;
}
