import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrdersApiService } from '../services/orders-api.service';
import { Order } from '../models/Order';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss'],
})
export class OrdersComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  orders: Order[] = [];
  totalRecords: number = 0;
  currentPage: number = 0;
  totalPages: number = 0;
  errorMessage: string = '';
  currentPageBlock: number = 0;
  pageSize: number = 5;
  filters: FormGroup;
  exportFilters: FormGroup;
  search: string = '';

  constructor(
    private ordersService: OrdersApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filters = this.fb.group({
      selectedStatus: [''],
      startDate: [''],
      endDate: [''],
    });
    this.exportFilters = this.fb.group({
      selectedStatus: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.getAllOrders(0);
  }

  getAllOrders(page: number) {
    const response = this.ordersService.getAllOrders(
      page,
      this.filters.value,
      this.search
    );

    response.subscribe({
      next: (value) => {
        this.orders = value.content;
        this.totalPages = value.totalPages;
        this.currentPage = value.pageNumber;
        this.totalRecords = value.totalElements;
        this.calculatePageBlocks();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage =
          'Ha ocurrido un problema al intentar traer los registros de la tabla. Por favor contacte un administrador de inmediato.';
      },
    });
  }

  exportToExcel(): void {
    const filters = this.exportFilters.value;

    this.ordersService.exportOrdersToExcel(filters).subscribe(
      (response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ordenes_de_trabajo_SERVIELECTROGAS.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.clearExportFilters();
      },
      (error) => {
        this.clearExportFilters();
        console.error('Error exporting to Excel', error);
      }
    );
  }

  importOrders(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.ordersService.importOrders(file).subscribe(
        (response) => {
          this.showSnackbar(response.message, true);
          this.fileInput.nativeElement.value = '';
          this.getAllOrders(0);
        },
        (error) => {
          this.showSnackbar(error.error.message, false);
          this.fileInput.nativeElement.value = '';
        }
      );
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  applyFilters(): void {
    this.getAllOrders(0);
  }

  searchOrders(): void {
    this.getAllOrders(0);
  }

  clearExportFilters(): void {
    this.exportFilters.reset({
      selectedStatus: '',
      startDate: '',
      endDate: '',
    });
  }

  clearFilters(): void {
    this.filters.reset({
      selectedStatus: '',
      startDate: '',
      endDate: '',
    });
    this.getAllOrders(0);
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.getAllOrders(page);
    }
  }

  nextPageBlock() {
    if ((this.currentPageBlock + 1) * this.pageSize < this.totalPages) {
      this.currentPageBlock++;
      this.calculatePageBlocks();
    }
  }

  prevPageBlock() {
    if (this.currentPageBlock > 0) {
      this.currentPageBlock--;
      this.calculatePageBlocks();
    }
  }

  calculatePageBlocks() {
    const totalPagesBlocks = Math.ceil(this.totalPages / this.pageSize);
    if (this.currentPageBlock >= totalPagesBlocks) {
      this.currentPageBlock = totalPagesBlocks - 1;
    }
  }

  getDisplayedPages(): number[] {
    const startPage = this.currentPageBlock * this.pageSize;
    const endPage = Math.min(startPage + this.pageSize, this.totalPages);
    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
  }

  showSnackbar(message: string, isSuccess: boolean): void {
    const snackbarClass = isSuccess ? 'green-snackbar' : 'red-snackbar';

    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [snackbarClass],
    });
  }
}
