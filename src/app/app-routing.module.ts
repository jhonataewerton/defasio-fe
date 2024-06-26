import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-movies',
    pathMatch: 'full',
  },
  {
    path: 'list-movies',
    loadChildren: () =>
      import('./modules/movies/movies.module').then(
        (m) => m.MoviesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
