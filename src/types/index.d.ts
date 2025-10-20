export interface IPaginationResponse<T> {
  total: number;
  page: number;
  limit: number;
  items: T[]
}

export interface ICountry {
  id: number;
  name: string;
  slug: string;
}