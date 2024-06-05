import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MOVIES_ROUTER } from './movies.routing';
import { ListMoviesComponent } from './pages/list-movies/list-movies.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListMoviesComponent,
    DashboardComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MOVIES_ROUTER),
  ],
  exports:[ListMoviesComponent]
})
export class MoviesModule { }
