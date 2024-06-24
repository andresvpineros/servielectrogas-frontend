export class Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    active: string;
    nameOfApplicant: string;
    numberOrderVendor: string

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone= data.phone;
        this.active= data.active;
        this.nameOfApplicant= data.nameOfApplicant;
        this.numberOrderVendor =data.numberOrderVendor;        
      }
}