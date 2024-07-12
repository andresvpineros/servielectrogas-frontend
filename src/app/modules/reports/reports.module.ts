import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {} from 'echarts';
import { ReportsComponent } from './reports.component';
@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, HttpClientModule, FormsModule],
  exports: [ReportsComponent],
})
export class ReportsModule {}
