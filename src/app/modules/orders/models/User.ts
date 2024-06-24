export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  roleName: string;
  role: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.roleName = data.roleName;
    this.role = data.role;
  }
}
