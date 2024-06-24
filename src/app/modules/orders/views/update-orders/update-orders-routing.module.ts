import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateOrdersComponent } from './update-orders.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateOrdersRoutingModule {}
