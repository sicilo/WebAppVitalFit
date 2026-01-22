export interface ApplicationResult<T> {
  value: T | null;
  error: ResultError | null;
}

export interface ResultError {
  code: string;
  message: string;
}
