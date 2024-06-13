import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MoviesService } from 'src/app/services/movies.service';
import { Movies } from 'src/app/models/movies.model';
import { FormsModule } from '@angular/forms';
import { MoviesWithMultipleWinnersResponse } from 'src/app/models/MoviesWithMultipleWinnersResponse.model';
import { of } from 'rxjs';
import { Studio } from 'src/app/models/MoviesTop3WinsResponse.model';
import { MoviesIntervalResponse } from 'src/app/models/MoviesIntervalResponse.model';
import { HttpParams } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let moviesService: any; // Usando 'any' para simplificar, substitua pelo tipo correto do serviço


    beforeEach(async () => {
      moviesService = jasmine.createSpyObj('MoviesService', [
        'getMoviesWinnersByYear',
        'getTop3Studios',
        'getMoviesInterval',
        'getMovies'
      ]);

      component = new DashboardComponent(moviesService);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [DashboardComponent],
      providers: [MoviesService],
    }).compileComponents();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call correctly response dataFilterByWinnerYear', () => {
    const response: MoviesWithMultipleWinnersResponse = {
      years: []
    };
    moviesService.getMoviesWinnersByYear.and.returnValue(of(response));
    component.calculateWinnersByYear();
    expect(component.dataFilterByWinnerYear).toEqual(response);
  });

  it('should call correctly response  top3Studios', () => {
    const response: Studio[] = [ /* dados de resposta simulados */ ];
    moviesService.getTop3Studios.and.returnValue(of(response));
    component.getTop3Studios();
    expect(component.top3Studios).toEqual(response);
  });

  it('deve atribuir a resposta correta a moviesInterval', () => {
    const response: MoviesIntervalResponse = {
      min: [],
      max: []
    };
    moviesService.getMoviesInterval.and.returnValue(of(response));
    component.getProducersWithIntervals();
    expect(component.moviesInterval).toEqual(response);
  });

});
