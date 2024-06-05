import { Routes } from '@angular/router';
import { ListMoviesComponent } from './pages/list-movies/list-movies.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const MOVIES_ROUTER: Routes = [
  {
    path: '',
    component: ListMoviesComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];
