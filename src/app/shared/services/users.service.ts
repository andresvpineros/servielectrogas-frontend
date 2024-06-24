import { Injectable } from '@angular/core';
import { colorentity } from '../../views/Entity/colorentity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Users } from '../../views/Model/Users';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  SaveUser(data: any) {
    return this.http.post(environment.apiUrl + '/users/register', data);
  }

  gettechnicalByName(data: any) {
    return this.http.get(environment.apiUrl + '/users/byName?name=' + data);
  }

  GetUsers(): Observable<Users[]> {
    return this.http
      .get<Users[]>(environment.apiUrl + '/users/all')
      .pipe(map((response) => response as Users[]));
  }

  UpdateUser(customer: Users): Observable<Users> {
    return this.http.put<Users>(environment.apiUrl + '/users/update', customer);
  }

  DeleteUser(data: any) {
    return this.http.delete(environment.apiUrl + '/users/delete/' + data);
  }
}
