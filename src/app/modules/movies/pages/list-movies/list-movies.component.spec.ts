import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ListMoviesComponent } from './list-movies.component';
import { MoviesService } from 'src/app/services/movies.service';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Movies } from 'src/app/models/movies.model';
import { Subject, of, throwError } from 'rxjs';

describe('ListMoviesComponent', () => {
  let component: ListMoviesComponent;
  let fixture: ComponentFixture<ListMoviesComponent>;
  let moviesService: any;

  beforeEach(async () => {
    const moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'getMovies',
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, HttpClientTestingModule],
      declarations: [ListMoviesComponent],
      providers: [{ provide: MoviesService, useValue: moviesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMoviesComponent);
    component = fixture.componentInstance;

    fixture = TestBed.createComponent(ListMoviesComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData on init', () => {
    spyOn(component, 'loadData');
    component.ngOnInit();
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should call filterYear on init', () => {
    spyOn(component, 'filterYear');
    component.ngOnInit();
    expect(component.filterYear).toHaveBeenCalled();
  });

  it('should call moviesService.getMovies with correct parameters', fakeAsync(() => {
    const response: Movies = {
      totalPages: 0,
      content: [
        {
          id: 1,
          title: 'Test Movie',
          year: 2020,
          studios: ['Studio A'],
          producers: ['Producer A'],
          winner: true,
        },
      ],
    };
    (moviesService.getMovies as jasmine.Spy).and.returnValue(of(response));

    component.page = 0;
    component.itensPerpage = 10;

    component.filterYear();

    tick(300);

    expect(moviesService.getMovies).toHaveBeenCalledWith(
      new HttpParams().set('page', '0').set('size', '10')
    );
  }));

  it('should return "yes" is  selectedShowWin is y "y"', () => {
    component.selectedShowWin = 'y';
    expect(component.checkSelectedBox()).toBe('yes');
  });

  it('should return  "no" if selectedShowWin is "n"', () => {
    component.selectedShowWin = 'n';
    expect(component.checkSelectedBox()).toBe('no');
  });

  it('should return  a  empty string if  selectedShowWin not like "y" ou "n"', () => {
    component.selectedShowWin = 'other';
    expect(component.checkSelectedBox()).toBe('');
  });

  it('should call  getMovies() with parameters', () => {
    component.loadData();
    const expectedParams = new HttpParams().set('page', '0').set('size', '10');
    expect(moviesService.getMovies).toHaveBeenCalledWith(expectedParams);
  });

  it('check error when call loadData()', () => {
    const error = new Error('Test Error');
    const movies$ = throwError(error);
    moviesService.getMovies.and.returnValue(movies$);

    spyOn(console, 'error');

    component.loadData();

    expect(console.error).toHaveBeenCalledWith(error);
  });

});
