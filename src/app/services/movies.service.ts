import { MoviesWithMultipleWinnersResponse } from './../models/MoviesWithMultipleWinnersResponse.model';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movies } from '../models/movies.model';
import {
  MoviesTop3WinsResponse,
  Studio,
} from '../models/MoviesTop3WinsResponse.model';
import { MoviesIntervalResponse } from '../models/MoviesIntervalResponse.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  public API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getMovies(params: HttpParams): Observable<Movies> {
    return this.http.get<Movies>(`${this.API_URL}`, { params: params });
  }

  getMoviesWinnersByYear(): Observable<MoviesWithMultipleWinnersResponse> {
    return this.http.get<MoviesWithMultipleWinnersResponse>(
      `${this.API_URL}?projection=years-with-multiple-winners`
    );
  }

  getMoviesWins(): Observable<MoviesTop3WinsResponse> {
    return this.http.get<MoviesTop3WinsResponse>(
      `${this.API_URL}?projection=studios-with-win-count`
    );
  }

  getTop3Studios(): Observable<Studio[]> {
    return this.getMoviesWins().pipe(
      map((response) => response.studios),
      map((studios) =>
        studios.sort((a, b) => b.winCount - a.winCount).slice(0, 3)
      )
    );
  }

  getMoviesInterval(): Observable<MoviesIntervalResponse> {
    return this.http.get<MoviesIntervalResponse>(
      `${this.API_URL}?projection=max-min-win-interval-for-producers`
    );
  }
}
