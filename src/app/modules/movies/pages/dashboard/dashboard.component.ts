import { MoviesWithMultipleWinnersResponse } from './../../../../models/MoviesWithMultipleWinnersResponse.model';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MoviesIntervalResponse } from 'src/app/models/MoviesIntervalResponse.model';
import { MoviesTop3WinsResponse, Studio } from 'src/app/models/MoviesTop3WinsResponse.model';
import { Movie } from 'src/app/models/movie.model';
import { Movies } from 'src/app/models/movies.model';
import { MoviesService } from 'src/app/services/movies.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private moviesService: MoviesService) {}

  data: Movie[] = [];
  dataFilterByWinnerYear!: MoviesWithMultipleWinnersResponse;
  top3Studios!: Studio[];
  moviesInterval:   MoviesIntervalResponse | undefined;

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
    this.moviesService.getMoviesWinnersByYear().subscribe({
      next: (res: MoviesWithMultipleWinnersResponse) => {
        if (res) {
          this.dataFilterByWinnerYear = res;
          console.log(res)
        }
      },
      error: (err) => {},
    });
  }

  getTop3Studios() {
   this.moviesService.getTop3Studios()
    .subscribe({
      next: (res) => {
        this.top3Studios = res;
        console.log(res)
      }
    })
  }

  getProducersWithIntervals() {
    this.moviesService.getMoviesInterval()
    .subscribe({
      next: (res) => {
        this.moviesInterval = res;
        console.log(res, "INTERVAL")
      }
    })
  }

  filterYear() {
    let queryParams = new HttpParams()
    .set('page', '0')
    .set('size', '10')
    .set('winner', true)
    .set('year', this.filterByYearInput);
    this.moviesService.getMovies(queryParams).subscribe({
      next: (res) => {(this.tableData = res), console.log(res, "RES")},
      error: (err) => console.error(err),
    });
  }
}
