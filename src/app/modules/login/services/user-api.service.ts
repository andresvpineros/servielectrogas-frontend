import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient) {}

  SaveUser(data: any) {
    return this.http.post(environment.apiUrl + '/users/register', data);
  }

  gettechnicalByName(data: any) {
    return this.http.get(environment.apiUrl + '/users/byName?name=' + data);
  }

  GetUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(environment.apiUrl + '/users/all')
      .pipe(map((response) => response as User[]));
  }

  UpdateUser(customer: User): Observable<User> {
    return this.http.put<User>(environment.apiUrl + '/users/update', customer);
  }

  DeleteUser(data: any) {
    return this.http.delete(environment.apiUrl + '/users/delete/' + data);
  }
}
