import { Movie } from "./movie.model";

export interface Movies {
  totalPages: number;
  content: Movie[];
}
