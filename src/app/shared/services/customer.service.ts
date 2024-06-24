import { Injectable } from '@angular/core';
import { colorentity } from '../../views/Entity/colorentity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from '../../views/Model/Customer';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class customerService {
  constructor(private http: HttpClient) {}

  /*  GetCustomer(): Observable<Customer[]> {
      return this.http.get<Customer[]>("http://localhost:3000/customer");
    }
  */
  GetCustomer(data: any) {
    return this.http.get(
      environment.apiUrl + '/clients/clientBy?phone=' + data
    );
  }

  GetCustomers(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(environment.apiUrl + '/clients/all')
      .pipe(map((response) => response as Customer[]));
  }

  UpdateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(
      environment.apiUrl + '/clients/update',
      customer
    );
  }

  CreateCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      environment.apiUrl + '/clients/register',
      customer
    );
  }
}
