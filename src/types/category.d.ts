export interface IBaseCategory {
  id: number;
  name: string;
  slug: string;
}

export interface IcategoryList extends IBaseCategory {
  _count: {
    films: number
  }
}