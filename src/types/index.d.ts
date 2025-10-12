export interface IPaginationResponse<T> {
  total: number;
  page: number;
  limit: number;
  items: T[]
}