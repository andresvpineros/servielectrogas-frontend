import { OrderService } from './OrderService';

export class Order {
  id: number;
  orderServices: OrderService[];
  observations: string;
  statusName: string;
  status: number;
  totalCharged: number;
  clientNames: string;
  clientDocument: string;
  clientPhone: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.orderServices = data.orderServices;
    this.observations = data.observations;
    this.statusName = data.statusName;
    this.status = data.status;
    this.totalCharged = data.totalCharged;
    this.clientNames = data.clientNames;
    this.clientDocument = data.clientDocument;
    this.clientPhone = data.clientPhone;
    this.clientId = data.clientId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
