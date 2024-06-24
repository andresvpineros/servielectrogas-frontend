import { Injectable } from '@angular/core';
import { colorentity } from '../../views/Entity/colorentity';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Schedule } from '../../views/Model/Schedule';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
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

  GetSchedules(): Observable<Schedule[]> {
    return this.http
      .get<Schedule[]>(environment.apiUrl + '/schedules')
      .pipe(map((response) => response));
  }

  public getAllSchedules(page: number, search: string): Observable<any> {
    let params = new HttpParams().set('page', page);

    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<any>(`${environment.apiUrl}/schedules`, { params })
      .pipe(
        map((response) => {
          return {
            content: response.data.content.map((schedule: Schedule) => ({
              ...schedule,
            })),
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            pageNumber: response.data.number,
          };
        })
      );
  }

  GetSchedulesByUser(pi_suser: string | null) {
    return this.http.get(
      environment.apiUrl + '/users/scheduleByUser?email=' + pi_suser
    );
  }

  DeleteSchedule(data: any) {
    return this.http.delete(environment.apiUrl + '/schedules/delete/' + data);
  }

  Saveschedule(data: any) {
    return this.http.post(environment.apiUrl + '/schedules/register', data);
  }

  // UpdateSchedule(schedule: Schedule): Observable<Schedule> {
  //   return this.http.put<Schedule>(
  //     environment.apiUrl + '/schedules/update',
  //     schedule
  //   );
  // }
  /*
  CreateCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl + 'clients/register', customer);
  }*/
}
