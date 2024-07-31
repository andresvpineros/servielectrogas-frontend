import { Component, ViewChild, ElementRef } from '@angular/core';
import { OrdersApiService } from '../../services/orders-api.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Order } from '../../models/Order';
import { Client } from '../../models/Client';
import { User } from 'src/app/modules/login/models/User';
import { Service } from '../../models/Service';
import { OrderService } from '../../models/OrderService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  templateUrl: 'update-orders.component.html',
  styleUrls: ['update-orders.component.scss'],
})
export class UpdateOrdersComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  totalRecords: number = 0;
  errorMessage: string = '';
  dataForm: FormGroup;
  filteredClients: Client[] = [];
  filteredUsers: User[] = [];
  filteredServices: Service[] = [];
  totalOrderServices: OrderService[] = [];
  aditionalCharges: number = 0;
  visible = false;
  selectedFile: File | string = '';
  existingFile: {
    id: number;
    filename: string;
    fileType: string;
    data: any;
  } | null = null;
  id: number | null = null;
  orderServiceId: number | null = null;
  fileUrl: SafeUrl | null = null;
  idModal: string | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ordersService: OrdersApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.dataForm = this.fb.group({
      observations: ['', [Validators.required]],
      status: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      orderServices: this.fb.array([] as FormGroup[]),
      technicianId: ['', [Validators.required]],
      scheduleDate: ['', [Validators.required]],
      scheduleTime: ['', [Validators.required]],
      totalCharged: [{ value: 0, disabled: true }],
      aditionalCharged: [0],
    });
  }

  ngOnInit() {
    this.orderServices.valueChanges.subscribe(() => {
      if (this.orderServices.value.length === 0) {
        this.dataForm.get('aditionalCharged')?.setValue(0);
      }
      this.updateTotalCharged();
    });

    this.searchClients('');
    this.searchUsers('');
    this.searchServices('');
    this.route.paramMap.subscribe((params) => {
      this.id = +params.get('id')!;
      this.getOrder(this.id);
    });
  }

  toggleEvidencesModal(orderServiceId: number, i: number) {
    this.resetFileInput();
    this.visible = !this.visible;
    this.idModal = (i + 1).toString();
    this.getEvidenceById(orderServiceId);
  }

  getEvidenceById(orderServiceId: number | null) {
    if (orderServiceId) {
      this.orderServiceId = orderServiceId;
      this.ordersService
        .getEvidenceByOrderServiceId(orderServiceId)
        .subscribe((response) => {
          if (response.code === 200) {
            this.existingFile = response.data;
            this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(
                new Blob([this.base64ToArrayBuffer(response.data.data)], {
                  type: response.data.fileType,
                })
              )
            );
          } else {
            this.resetFileInput();
          }
        });
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.ordersService
        .uploadEvidence(this.selectedFile, this.orderServiceId)
        .subscribe((response) => {
          if (response.code === 200) {
            this.showSnackbar(response.message, true);
            this.fileInput.nativeElement.value = '';
            this.selectedFile = '';
            this.getEvidenceById(this.orderServiceId);
          }
        });
    }
  }

  downloadFile() {
    if (this.existingFile) {
      const binary = atob(this.existingFile.data);
      const len = binary.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);

      for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([view], { type: this.existingFile.fileType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.existingFile.filename;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  closeEvidencesModal() {
    this.visible = !this.visible;
    this.resetFileInput();
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  resetFileInput() {
    this.orderServiceId = null;
    this.idModal = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
      this.selectedFile = '';
      this.existingFile = null;
      this.fileUrl = null;

      // Crear un nuevo input y reemplazar el antiguo
      const newFileInput = this.fileInput.nativeElement.cloneNode(true);
      this.fileInput.nativeElement.parentNode.replaceChild(
        newFileInput,
        this.fileInput.nativeElement
      );
      this.fileInput.nativeElement = newFileInput;
    }
  }

  onSubmit(): void {
    if (this.dataForm.valid) {
      this.dataForm.get('totalCharged')?.enable();

      const order: Order = this.dataForm.value;

      order.orderServices.forEach((orderService: any) => {
        orderService.orderServiceDate = this.transformDateForBackend(
          orderService.orderServiceDate
        );
        orderService.duration = this.transformDurationToBackend(
          orderService.duration
        );
        if (
          orderService.warrantyOrderServiceId !== null &&
          orderService.warrantyOrderServiceId !== ''
        ) {
          orderService.warrantyStartDate = '';
          orderService.warrantyEndDate = '';
        } else {
          orderService.warrantyOrderServiceId = '';
          orderService.warrantyStartDate = orderService.orderServiceDate;
          orderService.warrantyEndDate = this.formatDateToInput(
            orderService.warrantyEndDate
          );
        }
      });
      console.log('updating');
      this.ordersService.updateOrder(this.id || null, order).subscribe(
        (response) => {
          this.showSnackbar('Orden actualizada exitosamente', true);
          console.log('BEFORE GETTING ORDER WHEN UPDATED');
          this.orderServices.setValue([]);
          console.log('IS NOT REACHING GET ORDER CALL SERVICE');
          this.getOrder(this.id || null);
        },
        (error) => {
          this.showSnackbar('Error al guardar la orden', false);
        }
      );
    } else {
      this.markFieldsAsTouched(this.dataForm);
    }
  }

  // Service requests

  getOrder(id: number | null) {
    const response = this.ordersService.getOrderById(id || null);
    console.log('Getting order', id);
    response.subscribe({
      next: (value: any) => {
        const { data } = value;

        data.orderServices.map((service: OrderService) =>
          this.orderServices.push(this.initOrderServiceFormGroup(service))
        );

        console.log(data.orderServices);

        this.totalOrderServices = data.orderServices.filter(
          (service: OrderService, i: number) => {
            if (service.warrantyEndDate) {
              const warrantyEndDate = new Date(service.warrantyEndDate)
                .toISOString()
                .split('T')[0];
              const today = new Date().toISOString().split('T')[0];

              return warrantyEndDate >= today;
            } else {
              return false;
            }
          }
        );

        this.dataForm.patchValue({
          observations: data.observations,
          status: data.status,
          clientId: data.clientId,
          technicianId: data.technicianId,
          scheduleDate: this.formatDateToInput(data.scheduleDate),
          scheduleTime: data.scheduleTime,
          totalCharged: data.totalCharged,
          aditionalCharged: data.aditionalCharged,
        });
      },
      error: (err) => {
        console.log(err);
        this.errorMessage =
          'Ha ocurrido un problema al intentar traer los registros de la tabla. Por favor contacte un administrador de inmediato.';
      },
    });
  }

  initOrderServiceFormGroup(service: OrderService): FormGroup {
    return this.fb.group({
      id: [service.id],
      ordersId: [service.ordersId],
      service: [service.service],
      serviceId: [service.serviceId],
      serviceWarrantyTime: [service.service.warrantyTime],
      observations: [service.observations, Validators.required],
      orderServiceDate: [
        this.formatDateToInput(service.orderServiceDate),
        Validators.required,
      ],
      duration: [
        this.convertDurationToTime(service.duration),
        Validators.required,
      ],
      price: [service.service.price],
      priorityName: [service.priorityName],
      priority: [service.priority, Validators.required],
      warrantyOrderServiceId: [service.warrantyOrderServiceId],
      statusName: [service.statusName],
      status: [service.status, Validators.required],
      createdAt: [service.createdAt],
      technicianName: [service.technicianName],
      technicianId: [service.technicianId, Validators.required],
      alreadyCreated: true,
      warrantyStartDate: [service.warrantyStartDate],
      warrantyEndDate: [this.formatInputToDate(service.warrantyEndDate)],
      warrantyReason: [service.warrantyReason],
    });
  }

  onClientChange(event: any): void {
    const selectedClientId = event ? event.id : null;
    this.dataForm.get('clientId')?.setValue(selectedClientId);
  }

  searchClients(query: any): void {
    this.ordersService.searchClients(query).subscribe((clients) => {
      this.filteredClients = clients.map((client) => ({
        ...client,
        displayLabel: `${client.names} | CC. ${client.document} - Tel. ${client.phone}`,
      }));
    });
  }

  searchUsers(name: any): void {
    this.ordersService.searchUsers(name).subscribe((users) => {
      this.filteredUsers = users;
      this.filteredUsers = users.map((user) => ({
        ...user,
        displayLabel: `${user.name} | ${user.email}`,
      }));
    });
  }

  searchServices(description: any): void {
    this.ordersService
      .searchServices(description, false)
      .subscribe((services) => {
        this.filteredServices = services.map((service) => ({
          ...service,
          displayLabel: `${
            service.servicesDescription
          } | ${service.price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
        }));
      });
  }

  // onChange

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onServiceChange(index: number, selectedService: any): void {
    const price = selectedService.price;
    this.orderServices
      .at(index)
      .get('serviceWarrantyTime')
      ?.setValue(selectedService.warrantyTime);
    this.orderServices.at(index).get('price')?.setValue(price);
    this.transformWarrantyEndDateToBackend(
      this.orderServices.at(index).get('orderServiceDate')?.value,
      selectedService.warrantyTime,
      index
    );

    if (selectedService.id === 0) {
      this.orderServices.at(index).get('warrantyStartDate')?.setValue('');
      this.orderServices.at(index).get('warrantyEndDate')?.setValue('');
      this.orderServices.at(index).get('warrantyReason')?.setValue('');
    } else {
      this.orderServices.at(index).get('warrantyOrderServiceId')?.setValue('');
      this.orderServices.at(index).get('warrantyOrderServiceId')?.disabled;
    }
    this.updateTotalCharged();
  }

  updateTotalCharged(): void {
    const orderServices = this.dataForm.get('orderServices')?.value;
    const totalServicesCharged = orderServices.reduce(
      (total: any, service: any) => {
        return total + (service.price || 0);
      },
      0
    );

    const totalCharged =
      totalServicesCharged + this.dataForm.get('aditionalCharged')?.value;
    this.dataForm.get('totalCharged')?.setValue(totalCharged);
  }

  get orderServices(): FormArray {
    return this.dataForm.controls['orderServices'] as FormArray;
  }

  createOrderService(): FormGroup {
    return this.fb.group({
      serviceId: ['', [Validators.required]],
      serviceWarrantyTime: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      orderServiceDate: ['', [Validators.required]],
      warrantyStartDate: [''],
      warrantyEndDate: [''],
      warrantyReason: [''],
      alreadyCreated: false,
      warrantyOrderServiceId: [''],
      price: [{ value: 0, disabled: false }, [Validators.required]],
    });
  }

  addOrderService(): void {
    this.orderServices.push(this.createOrderService());
  }

  removeOrderService(index: number): void {
    this.orderServices.removeAt(index);
  }

  // Utils

  markFieldsAsTouched(formGroup: FormGroup | FormArray): void {
    if (formGroup instanceof FormGroup || formGroup instanceof FormArray) {
      Object.values(formGroup.controls).forEach((control) => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.markFieldsAsTouched(control);
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  transformDateForBackend(date: string): string {
    const isoString = new Date(date).toISOString();
    return isoString.replace('Z', '');
  }

  transformDurationToBackend(time: string): string {
    if (!time || time.length !== 4) {
      console.error('Invalid time format. Expected HHmm format.');
      return '';
    }

    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(2), 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time. Hours or minutes are not numbers.');
      return '';
    }

    const totalSeconds = (hours * 60 + minutes) * 60;
    return `PT${totalSeconds}S`;
  }

  showSnackbar(message: string, isSuccess: boolean): void {
    const snackbarClass = isSuccess ? 'green-snackbar' : 'red-snackbar';

    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [snackbarClass],
    });
  }

  formatDateToInput(value: string): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatInputToDate(value: string): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}/${day}/${year}`;
  }

  transformWarrantyEndDateToBackend(
    orderServiceDate: string,
    warrantyTimeService: number,
    index: number
  ) {
    if (orderServiceDate && warrantyTimeService) {
      let serviceDate = new Date(orderServiceDate);
      serviceDate.setDate(serviceDate.getDate() + warrantyTimeService);

      let day = ('0' + serviceDate.getDate()).slice(-2);
      let month = ('0' + (serviceDate.getMonth() + 1)).slice(-2);
      let year = serviceDate.getFullYear();
      let formattedDate = `${month}/${day}/${year}`;

      this.orderServices
        .at(index)
        .get('warrantyEndDate')
        ?.setValue(formattedDate);
    }
  }

  getWarrantyEndDateValue(index: number): string {
    const warrantyEndDate = this.orderServices
      .at(index)
      .get('warrantyEndDate')?.value;
    const serviceWarrantyTime = this.orderServices
      .at(index)
      .get('serviceWarrantyTime')?.value;

    if (warrantyEndDate && serviceWarrantyTime) {
      return `${warrantyEndDate} | ${serviceWarrantyTime} días de garantía`;
    }

    return '';
  }

  convertDurationToTime(value: string): string {
    const matches = value.match(/PT(\d+H)?(\d+M)?/);

    const hours =
      matches && matches[1]
        ? matches[1].replace('H', '').padStart(2, '0')
        : '00';
    const minutes =
      matches && matches[2]
        ? matches[2].replace('M', '').padStart(2, '0')
        : '00';

    return `${hours}:${minutes}`;
  }
}
