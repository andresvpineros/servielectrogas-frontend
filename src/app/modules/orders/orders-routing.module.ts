import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent } from './views/orders.component';
import { AddOrdersComponent } from './views/add-orders/add-orders.component';
import { UpdateOrdersComponent } from './views/update-orders/update-orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
  },
  {
    path: 'agregar',
    component: AddOrdersComponent,
  },
  {
    path: 'editar/:id',
    component: UpdateOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
