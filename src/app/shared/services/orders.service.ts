import { Injectable } from '@angular/core';
import { colorentity } from '../../views/Entity/colorentity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../views/Model/Order';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  GetOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(environment.apiUrl + '/orders/all')
      .pipe(map((response) => response as Order[]));
  }
  GetOrder(id: string): Observable<Order[]> {
    return this.http
      .get<Order[]>(environment.apiUrl + '/orders/byId?id=' + id)
      .pipe(map((response) => response as Order[]));
  }

  UpdateOrders(order: Order): Observable<Order> {
    return this.http.put<Order>(environment.apiUrl + '/orders/update', order);
  }

  Saveorders(data: any) {
    return this.http.post(environment.apiUrl + '/registerAll', data);
  }
}
