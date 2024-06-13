export interface MoviesIntervalResponse {
  min: Min[]
  max: Max[]
}

export interface Min {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export interface Max {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}
