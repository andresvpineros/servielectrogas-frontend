import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateOrdersComponent } from './update-orders.component';
import { UpdateOrdersRoutingModule } from './update-orders-routing.module';

@NgModule({
  imports: [CommonModule, UpdateOrdersRoutingModule],
  declarations: [UpdateOrdersComponent],
})
export class UpdateOrdersModule {}
