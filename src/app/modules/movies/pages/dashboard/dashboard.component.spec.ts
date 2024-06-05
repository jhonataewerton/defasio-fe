import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MoviesService } from 'src/app/services/movies.service';
import { Movies } from 'src/app/models/movies.model';
import { FormsModule } from '@angular/forms';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let moviesService: MoviesService;
  let httpTestingController: HttpTestingController;

  const mockMovies: Movies = {
    totalPages: 1,
    content: [
      {
        id: 1,
        year: 1990,
        title: 'Movie 1',
        studios: ['Studio 1', 'Studio 2'],
        producers: ['Producer 1', 'Producer 2'],
        winner: true,
      },
      {
        id: 2,
        year: 1990,
        title: 'Movie 2',
        studios: ['Studio 1'],
        producers: ['Producer 1'],
        winner: true,
      },
      {
        id: 3,
        year: 1991,
        title: 'Movie 3',
        studios: ['Studio 3'],
        producers: ['Producer 3'],
        winner: false,
      },
      {
        id: 4,
        year: 1992,
        title: 'Movie 4',
        studios: ['Studio 1'],
        producers: ['Producer 1', 'Producer 3'],
        winner: true,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [DashboardComponent],
      providers: [MoviesService],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    fixture.detectChanges();

    const req = httpTestingController.expectOne((request) =>
      request.url.includes('/movies')
    );
    req.flush(mockMovies);

    expect(component.data.length).toBe(4);
    expect(component.dataFilterByWinnerYear).toEqual([
      { ano: 1990, winners: 2 },
    ]);
  });

  it('should calculate top 3 studios with wins', () => {
    component.data = mockMovies.content;
    component.getTop3StudiosWithWins();

    expect(component.top3Studios).toEqual([
      { studio: 'Studio 1', wins: 3 },
      { studio: 'Studio 2', wins: 1 },
      { studio: 'Studio 3', wins: 1 },
    ]);
  });

  it('should calculate producers with max and min intervals', () => {
    component.data = mockMovies.content;
    component.getProducersWithIntervals();

    expect(component.producerWithMaxInterval).toEqual({
      producer: 'Producer 1',
      interval: 2,
      previousYear: 1990,
      followingYear: 1992,
    });

    expect(component.producerWithMinInterval).toEqual({
      producer: 'Producer 1',
      interval: 2,
      previousYear: 1990,
      followingYear: 1992,
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
