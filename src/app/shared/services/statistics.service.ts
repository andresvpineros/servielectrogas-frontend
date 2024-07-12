import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceTypeStatisticsDTO } from '../../modules/statistics/models/ServiceTypeStatisticsDTO';
import { TechnicianEffectivenessDTO } from '../../modules/statistics/models/TechnicianEffectivenessDTO';
import { WarrantiesByTechnicianDTO } from '../../modules/statistics/models/WarrantiesByTechnicianDTO';
import { WarrantiesByTypeDTO } from '../../modules/statistics/models/WarrantiesByTypeDTO ';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private baseUrl: string = `${environment.apiUrl}/warranties/statistics/status`;
  private baseUrls: string = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  getServiceStatusStatistics(
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}?startDate=${startDate}&endDate=${endDate}`)
      .pipe(
        map((response) => {
          return Object.keys(response).map((key) => ({
            name: key,
            value: response[key],
          }));
        })
      );
  }

  getServiceTypesStatisticsByMonth(
    startDate: string,
    endDate: string
  ): Observable<ServiceTypeStatisticsDTO[]> {
    return this.http.get<ServiceTypeStatisticsDTO[]>(
      `${this.baseUrls}/service-types?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getTechnicianEffectivenessStatistics(
    startDate: string,
    endDate: string
  ): Observable<TechnicianEffectivenessDTO[]> {
    return this.http.get<TechnicianEffectivenessDTO[]>(
      `${this.baseUrls}/technician-effectiveness?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getWarrantiesByTechnician(
    startDate: string,
    endDate: string
  ): Observable<WarrantiesByTechnicianDTO[]> {
    return this.http.get<WarrantiesByTechnicianDTO[]>(
      `${this.baseUrls}/warranties-by-technician?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getWarrantiesByType(
    startDate: string,
    endDate: string
  ): Observable<WarrantiesByTypeDTO[]> {
    return this.http.get<WarrantiesByTypeDTO[]>(
      `${this.baseUrls}/warranties-by-type?startDate=${startDate}&endDate=${endDate}`
    );
  }

  downloadTechnicianSettlementReport(): Observable<Blob> {
    const url = `${this.baseUrls}/technician-settlement`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadServiceReports(): Observable<Blob> {
    const url = `${this.baseUrls}/service-report`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
