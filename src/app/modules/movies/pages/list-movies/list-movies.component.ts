import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { Movie } from 'src/app/models/movie.model';
import { Movies } from 'src/app/models/movies.model';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss'],
})
export class ListMoviesComponent implements OnInit {
  selectedShowWin: boolean = true;
  filterByYearInput: string = '';
  page: number = 0;

  constructor(private moviesService: MoviesService) {}

  private filterByYearSubject$ = new Subject<any>();

  tableData: Movies = { totalPages: 0, content: [] };
  filteredMovies: Movie[] = [];

  ngOnInit(): void {
    this.filterYear();
    this.loadData();
  }

  filterYear() {
    this.filterByYearSubject$
      .pipe(
        debounceTime(300),
        switchMap((res) => {
          let queryParams = new HttpParams()
            .set('page', this.page)
            .set('size', '10')
            .set('winner', this.selectedShowWin ? this.selectedShowWin : '')
            .set('year', this.filterByYearInput);

          return this.moviesService.getMovies(queryParams);
        })
      )
      .subscribe({
        next: (res) => (this.tableData = res),
        error: (err) => console.error(err),
      });
  }

  filter() {
    this.filterByYearSubject$.next('');
  }

  setPage(page: number) {
    this.page = page;
    this.filter();
  }

  loadData() {
    let queryParams = new HttpParams().set('page', '0').set('size', '10');
    this.moviesService.getMovies(queryParams).subscribe({
      next: (res) => {
        this.tableData = res;
        this.filteredMovies = this.tableData.content;

        // Contar os vencedores por ano
        const winnersByYear: { [year: number]: number } = this.filteredMovies.reduce<{ [year: number]: number }>((acc, movie) => {
          if (movie.winner) {
            acc[movie.year] = (acc[movie.year] || 0) + 1;
          }
          return acc;
        }, {});

        const filteredWinnersByYear = Object.keys(winnersByYear)
          .map(year => parseInt(year, 10))
          .filter(year => winnersByYear[year] >= 2)
          .reduce((acc: { [year: number]: number }, year) => {
            acc[year] = winnersByYear[year];
            return acc;
          }, {});

        console.log(filteredWinnersByYear);
      },
      error: (err) => console.error(err),
    });
  }
}
