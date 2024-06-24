export class ServiceActivity {
  id: string;
  servicesId: string;
  registrationDate: string;
  userRegisteredId: string;
  description: string;
  priority: string;
  state: string;
  registrationState: string;
  warrantyEndDate: string;

  constructor(data: any) {
    this.id = data.id;
    this.servicesId = data.servicesId;
    this.registrationDate = data.registrationDate;
    this.userRegisteredId = data.userRegisteredId;
    this.description = data.description;
    this.priority = data.priority;
    this.state = data.state;
    this.registrationState = data.registrationState;
    this.warrantyEndDate = data.warrantyEndDate;
  }
}
