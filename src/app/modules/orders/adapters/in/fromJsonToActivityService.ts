import { ActividadServicio } from '../../models/Order';
import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('en-US');

export const fromJsonToActivityService = (json: ActividadServicio) => {
  return new ActividadServicio({
    activityDate: datePipe.transform(json.activityDate, 'dd/MM/yy HH:mm'),
    createdAt: json.createdAt,
    description: json.description,
    duration: json.duration,
    id: json.id,
    orderId: json.orderId,
    priorityName: json.priorityName,
    priority: json.priority,
    statusName: json.statusName,
    status: json.status,
    technicianId: json.technicianId,
  });
};
