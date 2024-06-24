import { Service } from './Service';

export class OrderService {
  id: number;
  ordersId: number;
  service: Service;
  serviceId: number;
  technicianName: string;
  technicianId: number;
  priorityName: string;
  priority: number;
  statusName: string;
  status: number;
  observations: string;
  orderServiceDate: string;
  duration: string;
  createdAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.ordersId = data.ordersId;
    this.service = data.service;
    this.serviceId = data.serviceId;
    this.observations = data.observations;
    this.orderServiceDate = data.orderServiceDate;
    this.duration = data.duration;
    this.priorityName = data.priorityName;
    this.priority = data.priority;
    this.statusName = data.statusName;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.technicianName = data.technicianName;
    this.technicianId = data.technicianId;
  }
}
