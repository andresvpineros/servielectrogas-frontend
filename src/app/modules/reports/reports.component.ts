import { Component } from '@angular/core';
import { StatisticsService } from '../../shared/services/statistics.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  constructor(private statisticsService: StatisticsService) {}

  downloadTechnicianSettlementReport() {
    this.statisticsService
      .downloadTechnicianSettlementReport()
      .subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'technician_settlement.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }

  downloadServiceReports() {
    this.statisticsService.downloadServiceReports().subscribe(
      (blob: any) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'service_reports.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.error('Error downloading the file', error);
      }
    );
  }
}
