import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddOrdersComponent } from './add-orders.component';
import { AddOrdersRoutingModule } from './add-orders-routing.module';

@NgModule({
  imports: [CommonModule, AddOrdersRoutingModule],
  declarations: [AddOrdersComponent],
})
export class AddOrdersModule {}
