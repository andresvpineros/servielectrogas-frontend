import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../models/Order';
import { Client } from '../models/Client';
import { environment } from 'src/environments/environments';
import { ResultMessage } from 'src/app/shared/models/ResultMessage';
import { User } from '../../login/models/User';
import { Service } from '../models/Service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Evidence } from '../models/Evidence';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) {}

  public getAllOrders(
    page: number,
    filters: any,
    search: string
  ): Observable<any> {
    let params = new HttpParams().set('page', page);

    if (filters) {
      Object.keys(filters).forEach((key) => {
        console.log(filters[key]);
        if (filters[key] !== '' && filters[key] !== null) {
          params = params.set(key, filters[key]);
        }
      });
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${environment.apiUrl}/orders`, { params }).pipe(
      map((response) => {
        return {
          content: response.data.content.map((order: Order) => ({
            ...order,
            totalCharged: `$ ${this.decimalPipe.transform(
              order.totalCharged,
              '1.0-0',
              'es-CO'
            )}`,
            createdAt: this.datePipe.transform(
              order.createdAt,
              'dd/MM/yyyy HH:mm'
            ),
          })),
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageNumber: response.data.number,
        };
      })
    );
  }

  public createOrder(order: Order): Observable<ResultMessage<Order>> {
    return this.http.post<ResultMessage<Order>>(
      `${environment.apiUrl}/orders`,
      order
    );
  }

  exportOrdersToExcel(filters: any): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${environment.apiUrl}/orders/export`, {
      params,
      responseType: 'blob',
    });
  }

  importOrders(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${environment.apiUrl}/orders/import`, formData);
  }

  getEvidenceByOrderServiceId(orderServiceId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/evidences/view/${orderServiceId}`
    );
  }

  uploadEvidence(file: any, orderServiceId: number | null): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(
      `${environment.apiUrl}/evidences/upload/${orderServiceId}`,
      formData
    );
  }

  public getOrderById(id: number | null): Observable<ResultMessage<Order>> {
    return this.http.get<ResultMessage<Order>>(
      `${environment.apiUrl}/orders/${id}`
    );
  }

  public updateOrder(
    id: number | null,
    order: Order
  ): Observable<ResultMessage<Order>> {
    return this.http.put<ResultMessage<Order>>(
      `${environment.apiUrl}/orders/${id}`,
      order
    );
  }

  public deleteActividadDeServicio(id: number): Observable<ResultMessage<any>> {
    return this.http.delete<ResultMessage<any>>(
      `${environment.apiUrl}/orders/${id}`
    );
  }

  public searchClients(query: string): Observable<Client[]> {
    let params = new HttpParams().set('query', query);

    return this.http
      .get<ResultMessage<Client[]>>(environment.apiUrl + '/clients/search', {
        params,
      })
      .pipe(
        map((data: ResultMessage<Client[]>) => {
          return data.data.map((client: Client) => new Client(client));
        })
      );
  }

  public searchUsers(names: string): Observable<User[]> {
    let params = new HttpParams().set('name', names);

    return this.http
      .get<ResultMessage<User[]>>(environment.apiUrl + '/users/search', {
        params,
      })
      .pipe(
        map((data: ResultMessage<User[]>) => {
          return data.data.map((user: User) => new User(user));
        })
      );
  }

  public searchServices(
    description: string,
    creatingOrder: boolean
  ): Observable<Service[]> {
    let params = new HttpParams().set('description', description);

    return this.http
      .get<ResultMessage<Service[]>>(environment.apiUrl + '/services/search', {
        params,
      })
      .pipe(
        map((data: ResultMessage<Service[]>) => {
          return data.data
            .filter((service: Service) => !(creatingOrder && service.id === 0))
            .map((service: Service) => new Service(service));
        })
      );
  }
}
