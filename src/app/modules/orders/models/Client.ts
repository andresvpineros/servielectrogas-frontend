export class Client {
  id: number;
  document: string;
  names: string;
  phone: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  nameOfApplicant: string;
  numberOrderVendor: string;
  typeName: string;
  type: number;

  constructor(data: any) {
    this.id = data.id;
    this.document = data.document;
    this.names = data.names;
    this.phone = data.phone;
    this.phone1 = data.phone1;
    this.phone2 = data.phone2;
    this.email = data.email;
    this.address = data.address;
    this.nameOfApplicant = data.nameOfApplicant;
    this.numberOrderVendor = data.numberOrderVendor;
    this.typeName = data.typeName;
    this.type = data.type;
  }
}
