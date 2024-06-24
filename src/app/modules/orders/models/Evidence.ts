export class Evidence {
  id: number;
  photoUrl: string;
  createdAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.photoUrl = data.photoUrl;
    this.createdAt = data.createdAt;
  }
}
