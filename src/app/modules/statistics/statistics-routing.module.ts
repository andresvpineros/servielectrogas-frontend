// src/app/views/statistics/statistics-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    data: {
      title: 'Mis Estadísticas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
