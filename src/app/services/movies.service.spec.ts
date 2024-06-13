import { TestBed } from '@angular/core/testing';

import { MoviesService } from './movies.service';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [MoviesService],
    });
    service = TestBed.inject(MoviesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve movies', () => {
    const mockMovies = {
      totalPages: 0,
      content: [
        {
          id: 1,
          producers: [
            'Adam McKay',
            'Clayton Townsend',
            'Jimmy Miller',
            'Will Ferrell',
          ],
          studios: ['Columbia Pictures'],
          title: 'Holmes & Watson',
          year: 2022,
          winner: true,
        },
      ],
    };
    const queryParams = new HttpParams().set('page', '0').set('size', '10');

    service.getMovies(queryParams).subscribe((movies) => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpTestingController.expectOne(
      `${service.API_URL}?page=0&size=10`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should retrieve winners by year', () => {
    const mockWinners = {
      years: [
        {
          year: 1986,
          winnerCount: 2,
        },
        {
          year: 1990,
          winnerCount: 2,
        },
        {
          year: 2015,
          winnerCount: 2,
        },
      ],
    };

    service.getMoviesWinnersByYear().subscribe((winners) => {
      expect(winners).toEqual(mockWinners);
    });

    const req = httpTestingController.expectOne(
      `${service.API_URL}?projection=years-with-multiple-winners`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWinners);
  });

  it('should retrieve movies interval', () => {
    const mockIntervalResponse = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    service.getMoviesInterval().subscribe((intervalResponse) => {
      expect(intervalResponse).toEqual(mockIntervalResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.API_URL}?projection=max-min-win-interval-for-producers`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIntervalResponse);
  });

  it('should retrieve movies wins', () => {
    const mockWinsResponse = {
      studios: [
        {
          name: 'Columbia Pictures',
          winCount: 7,
        },
        {
          name: 'Paramount Pictures',
          winCount: 6,
        },
        {
          name: 'Warner Bros.',
          winCount: 5,
        },
        {
          name: '20th Century Fox',
          winCount: 4,
        },
        {
          name: 'MGM',
          winCount: 3,
        },
        {
          name: 'Universal Studios',
          winCount: 2,
        },
        {
          name: 'Universal Pictures',
          winCount: 2,
        },
        {
          name: 'Hollywood Pictures',
          winCount: 2,
        },
        {
          name: 'Nickelodeon Movies',
          winCount: 1,
        },
        {
          name: 'C2 Pictures',
          winCount: 1,
        },
        {
          name: 'Summit Entertainment',
          winCount: 1,
        },
        {
          name: 'Hasbro',
          winCount: 1,
        },
        {
          name: 'Associated Film Distribution',
          winCount: 1,
        },
        {
          name: 'Revolution Studios',
          winCount: 1,
        },
        {
          name: 'First Look Pictures',
          winCount: 1,
        },
        {
          name: 'Focus Features',
          winCount: 1,
        },
        {
          name: 'Cannon Films',
          winCount: 1,
        },
        {
          name: 'United Artists',
          winCount: 1,
        },
        {
          name: 'Touchstone Pictures',
          winCount: 1,
        },
        {
          name: 'Samuel Goldwyn Films',
          winCount: 1,
        },
        {
          name: 'Quality Flix',
          winCount: 1,
        },
        {
          name: 'TriStar Pictures',
          winCount: 1,
        },
        {
          name: 'Franchise Pictures',
          winCount: 1,
        },
        {
          name: 'Relativity Media',
          winCount: 1,
        },
        {
          name: 'Castle Rock Entertainment',
          winCount: 1,
        },
        {
          name: 'Screen Gems',
          winCount: 1,
        },
        {
          name: 'Triumph Releasing',
          winCount: 1,
        },
        {
          name: 'DreamWorks',
          winCount: 1,
        },
      ],
    };

    service.getMoviesWins().subscribe((winsResponse) => {
      expect(winsResponse).toEqual(mockWinsResponse);
    });

    const req = httpTestingController.expectOne(
      `${service.API_URL}?projection=studios-with-win-count`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWinsResponse);
  });

  it('should retrieve top 3 studios with most wins', () => {
    const mockWinsResponse = {
      studios: [
        { name: 'Studio A', winCount: 10 },
        { name: 'Studio B', winCount: 5 },
        { name: 'Studio C', winCount: 8 },
        { name: 'Studio D', winCount: 12 },
      ],
    };

    service.getTop3Studios().subscribe((top3Studios) => {
      expect(top3Studios.length).toBe(3);
      expect(top3Studios[0].name).toBe('Studio D');
      expect(top3Studios[1].name).toBe('Studio A');
      expect(top3Studios[2].name).toBe('Studio C');
    });

    const req = httpTestingController.expectOne(
      `${service.API_URL}?projection=studios-with-win-count`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWinsResponse);
  });
});
