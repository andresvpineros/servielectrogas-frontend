export class Service {
  id: number;
  servicesType: number;
  servicesDescription: string;
  price: number;

  constructor(data: any) {
    this.id = data.id;
    this.servicesType = data.servicesType;
    this.servicesDescription = data.servicesDescription;
    this.price = data.price;
  }
}
