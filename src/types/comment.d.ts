export interface IComment {
  id: number;
  episodeId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  episode: {
    id: number;
    name: string;
    film: {
      name: string;
      id: number;
      originalName?: string;
    }
  }
}