import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movies } from '../models/movies.model';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getMovies(params: HttpParams): Observable<Movies>  {
    return this.http.get<Movies>(`${this.API_URL}`, { params: params });
  }
}
