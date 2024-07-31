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
  warrantyOrderServiceId: number;
  duration: string;
  createdAt: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyReason: string;
  alreadyCreated: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.ordersId = data.ordersId;
    this.service = data.service;
    this.serviceId = data.serviceId;
    this.observations = data.observations;
    this.orderServiceDate = data.orderServiceDate;
    this.duration = data.duration;
    this.warrantyOrderServiceId = data.warrantyOrderServiceId;
    this.priorityName = data.priorityName;
    this.priority = data.priority;
    this.statusName = data.statusName;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.technicianName = data.technicianName;
    this.technicianId = data.technicianId;
    this.warrantyStartDate = data.warrantyStartDate;
    this.warrantyEndDate = data.warrantyEndDate;
    this.warrantyReason = data.warrantyReason;
    this.alreadyCreated = data.alreadyCreated;
  }
}
