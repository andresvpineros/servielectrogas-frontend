export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: number;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.role = data.role;
  }
}
