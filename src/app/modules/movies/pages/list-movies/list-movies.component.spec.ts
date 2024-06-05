import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMoviesComponent } from './list-movies.component';
import { MoviesService } from 'src/app/services/movies.service';
import { of } from 'rxjs';
import { Movies } from 'src/app/models/movies.model';

describe('ListMoviesComponent', () => {
  let component: ListMoviesComponent;
  let fixture: ComponentFixture<ListMoviesComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MoviesService', ['getMovies']);

    await TestBed.configureTestingModule({
      declarations: [ListMoviesComponent],
      providers: [{ provide: MoviesService, useValue: spy }],
    }).compileComponents();

    moviesServiceSpy = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData on initialization', () => {
    moviesServiceSpy.getMovies.and.returnValue(of({ totalPages: 1, content: [] } as Movies));
    component.ngOnInit();
    expect(moviesServiceSpy.getMovies).toHaveBeenCalled();
  });

  it('should call filterByYearSubject$ on filterYear', () => {
    const subjectMock = { next: jasmine.createSpy() };
    component['filterByYearSubject$'] = subjectMock as any;
    component.filterYear();
    expect(subjectMock.next).toHaveBeenCalled();
  });

});
