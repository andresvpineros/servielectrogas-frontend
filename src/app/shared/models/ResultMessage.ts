export class ResultMessage<T> {
  message: string;
  code: number;
  data: T;

  constructor(data: any) {
    this.message = data.message;
    this.code = data.code;
    this.data = data.data;
  }
}
