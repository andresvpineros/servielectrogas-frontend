export class Service {
  id: number;
  servicesType: number;
  servicesDescription: string;
  productName: string;
  price: number;
  warrantyTime: number;

  constructor(data: any) {
    this.id = data.id;
    this.servicesType = data.servicesType;
    this.servicesDescription = data.servicesDescription;
    this.productName = data.productName;
    this.price = data.price;
    this.warrantyTime = data.warrantyTime;
  }
}
