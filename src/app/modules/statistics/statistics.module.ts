import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { StatisticsComponent } from './statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
  },
];

@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    RouterModule.forChild(routes),
  ],
})
export class StatisticsModule {}
