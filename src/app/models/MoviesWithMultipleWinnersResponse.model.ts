export interface MoviesWithMultipleWinnersResponse {
  years: MoviesWithMultipleWinnersResponseContent[];
}

export interface MoviesWithMultipleWinnersResponseContent {
  year: number;
  winnerCount: number;
}
