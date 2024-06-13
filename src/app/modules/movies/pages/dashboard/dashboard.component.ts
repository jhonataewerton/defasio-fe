import { MoviesWithMultipleWinnersResponse } from './../../../../models/MoviesWithMultipleWinnersResponse.model';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MoviesIntervalResponse } from 'src/app/models/MoviesIntervalResponse.model';
import {
  MoviesTop3WinsResponse,
  Studio,
} from 'src/app/models/MoviesTop3WinsResponse.model';
import { Movie } from 'src/app/models/movie.model';
import { Movies } from 'src/app/models/movies.model';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  constructor(private moviesService: MoviesService) {}

  data: Movie[] = [];
  dataFilterByWinnerYear!: MoviesWithMultipleWinnersResponse;
  top3Studios!: Studio[];
  moviesInterval: MoviesIntervalResponse | undefined;

  tableData: Movies = { totalPages: 0, content: [] };
  filterByYearInput: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.calculateWinnersByYear();
    this.getTop3Studios();
    this.getProducersWithIntervals();
  }

  calculateWinnersByYear() {
    this.moviesService
      .getMoviesWinnersByYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: MoviesWithMultipleWinnersResponse) => {
          if (res) {
            this.dataFilterByWinnerYear = res;
          }
        },
        error: (err) => {},
      });
  }

  getTop3Studios() {
    this.moviesService
      .getTop3Studios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.top3Studios = res;
        },
      });
  }

  getProducersWithIntervals() {
    this.moviesService
      .getMoviesInterval()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.moviesInterval = res;
        },
      });
  }

  filterYear() {
    let queryParams = new HttpParams()
      .set('page', '0')
      .set('size', '10')
      .set('winner', true)
      .set('year', this.filterByYearInput);
    this.moviesService
      .getMovies(queryParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tableData = res;
        },
        error: (err) => console.error(err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
