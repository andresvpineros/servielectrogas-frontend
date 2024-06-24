import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { environment } from 'src/environments/environments';
import { ResultMessage } from 'src/app/shared/models/ResultMessage';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  constructor(private http: HttpClient) {}

  public validateUser(user: Login): Observable<ResultMessage<User>> {
    let params = new HttpParams()
      .set('email', user.email)
      .set('password', user.password);

    return this.http.get<ResultMessage<User>>(
      environment.apiUrl + '/users/login',
      { params }
    );
  }

  // ValidateUser(user: any, pass: any) {
  //   return this.http.get(
  //     environment.apiUrl + '/users/login?email=' + user + '&password=' + pass
  //   );
  // }

  /* ValidateUser(user: any, pass: any): Observable<any> {
    // Simular validación sin registro (solo para demostración)
    const validCredentials = { email: 'demo@example.com', password: 'demo123' }; // Reemplazar con datos simulados
    if (user === validCredentials.email && pass === validCredentials.password) {
      return new Observable(observer => {
        observer.next({ success: true, message: 'Inicio de sesión exitoso (sin registro)' });
        observer.complete();
      });
    } else {
      return new Observable(observer => {
        observer.error({ error: 'Credenciales inválidas (sin registro)' });
        observer.complete();
      });
    }
  }*/

  /* UpdateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(this.apiUrl + 'clients/update', customer);
  }

  CreateCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl + 'clients/register', customer);
  }*/
}
