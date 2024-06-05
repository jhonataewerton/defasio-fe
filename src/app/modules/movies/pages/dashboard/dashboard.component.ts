import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { Movies } from 'src/app/models/movies.model';
import { MoviesService } from 'src/app/services/movies.service';

interface WinnersByYear {
  [year: number]: number;
}

interface ProducerInterval {
  producer: string;
  interval: number;
  previousYear: number;
  followingYear: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private moviesService: MoviesService) {}

  data: Movie[] = [];
  dataFilterByWinnerYear: { ano: number; winners: number }[] = [];
  top3Studios: { studio: string; wins: number }[] = [];
  producerWithMaxInterval: ProducerInterval | null = null;
  producerWithMinInterval: ProducerInterval | null = null;

  tableData: Movies = { totalPages: 0, content: [] };
  filterByYearInput: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    let queryParams = new HttpParams().set('page', '0').set('size', '99');
    this.moviesService.getMovies(queryParams).subscribe({
      next: (res: Movies) => {
        if (res && res.content) {
          this.data = res.content;
          this.calculateWinnersByYear();
          this.getTop3StudiosWithWins();
          this.getProducersWithIntervals();
        }
      },
      error: (err) => {},
    });
  }

  calculateWinnersByYear() {
    const winnersByYear: WinnersByYear = this.data.reduce<WinnersByYear>(
      (acc, movie) => {
        if (movie.winner) {
          acc[movie.year] = (acc[movie.year] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    this.dataFilterByWinnerYear = Object.keys(winnersByYear)
      .map((year) => parseInt(year, 10))
      .filter((year) => winnersByYear[year] >= 2)
      .map((year) => ({ ano: year, winners: winnersByYear[year] }));
  }

  getTop3StudiosWithWins() {
    const studioWins: { [studio: string]: number } = {};

    this.data.forEach((movie) => {
      if (movie.winner) {
        movie.studios.forEach((studio) => {
          studioWins[studio] = (studioWins[studio] || 0) + 1;
        });
      }
    });

    this.top3Studios = Object.keys(studioWins)
      .map((studio) => ({ studio, wins: studioWins[studio] }))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 3);
  }

  getProducersWithIntervals() {
    const producerWins: { [producer: string]: number[] } = {};

    this.data.forEach((movie) => {
      if (movie.winner) {
        movie.producers.forEach((producer) => {
          if (!producerWins[producer]) {
            producerWins[producer] = [];
          }
          producerWins[producer].push(movie.year);
        });
      }
    });

    const producerIntervals = Object.keys(producerWins).map((producer) => {
      const years = producerWins[producer].sort((a, b) => a - b);
      const interval = years[years.length - 1] - years[0];
      return {
        producer,
        interval,
        previousYear: years[0],
        followingYear: years[years.length - 1],
      };
    });

    if (producerIntervals.length > 0) {
      this.producerWithMaxInterval = producerIntervals.reduce(
        (max, producer) => {
          return producer.interval > max.interval ? producer : max;
        },
        producerIntervals[0]
      );

      this.producerWithMinInterval = producerIntervals.reduce(
        (min, producer) => {
          return producer.interval < min.interval ? producer : min;
        },
        producerIntervals[0]
      );
    }
  }

  filterYear() {
    let queryParams = new HttpParams()
    .set('page', '0')
    .set('size', '10')
    .set('winner', true)
    .set('year', this.filterByYearInput);

    this.moviesService.getMovies(queryParams).subscribe({
      next: (res) => (this.tableData = res),
      error: (err) => console.error(err),
    });
  }
}
