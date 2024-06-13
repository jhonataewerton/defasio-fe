export interface MoviesTop3WinsResponse {
  studios: Studio[]
}

export interface Studio {
  name: string
  winCount: number
}
