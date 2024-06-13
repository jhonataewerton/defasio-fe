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
  selectedShowWin: string = '';
  filterByYearInput: string = '';
  page: number = 0;
  itensPerpage: number = 10;

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
            .set('size', this.itensPerpage)
            .set('winner', this.checkSelectedBox())
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

  checkSelectedBox() {
    if (this.selectedShowWin === 'y') {
      return 'yes';
    } else if (this.selectedShowWin === 'n') {
      return 'no';
    }
    return '';
  }

  setPage(page: number) {
    this.page = page;
    this.filter();
  }

  loadData() {
    let queryParams = new HttpParams().set('page', '0').set('size', '10');
    const movies$ = this.moviesService.getMovies(queryParams);
    if (movies$) {
      movies$.subscribe({
        next: (res) => {
          this.tableData = res;
          this.filteredMovies = this.tableData.content;
        },
        error: (err) => console.error(err),
      });
    }
  }

}
