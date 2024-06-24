import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../../shared/services/orders.service';
import { Order, Services } from '../Model/Order';
import { debounceTime } from 'rxjs/operators';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  ServiceForm: FormGroup;
  OrderList!: Order[];
  currentRowIndex!: number;
  displayedColumns: string[] = [
    'id',
    'Fecha',
    'Cliente',
    'Tecnico',
    'Estado',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private Orders: OrdersService) {
    this.ServiceForm = this.fb.group({
      NumeroOrden: '',
      observations: '',
      idservice1: '',
      idservice2: '',
      idservice3: '',
      typeservice1: 'Seleccione',
      typeservice2: 'Seleccione',
      typeservice3: 'Seleccione',
      serviced1: '',
      serviced2: '',
      serviced3: '',
      servicet1: '',
      servicet2: '',
      servicet3: '',
      status: '',
    });

    this.Orders.GetOrders().subscribe((data) => {
      this.OrderList = data;
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.Orders.GetOrders().subscribe((data) => {
      this.OrderList = data;
      if (data.length > 0) {
        this.OrderList = this.OrderList.map((row) => {
          return {
            ...row,
            observations: this.replaceNbspWithBr(row.observations),
          };
        });
      }
      this.dataSource = new MatTableDataSource(this.OrderList);
    });
  }

  onEdit(element: any, rowIndex: number) {
    this.currentRowIndex = rowIndex;
    this.ServiceForm.setValue({
      NumeroOrden: element.id,

      observations: this.replaceBrWithNewline(element.observations),
      status: element.status,
      idservice1: element.services.length > 0 ? element?.services[0]?.id : null,
      idservice2: element.services.length > 1 ? element?.services[1]?.id : null,
      idservice3: element.services.length > 2 ? element?.services[2]?.id : null,
      typeservice1:
        element.services.length > 0
          ? element?.services[0]?.servicesType
          : 'Seleccione',
      serviced1:
        element.services.length > 0
          ? element?.services[0]?.servicesDescription
          : '',
      servicet1: element.services.length > 0 ? element?.services[0]?.price : '',
      typeservice2:
        element.services.length > 1
          ? element?.services[1]?.servicesType
          : 'Seleccione',
      serviced2:
        element.services.length > 1
          ? element?.services[1]?.servicesDescription
          : '',
      servicet2: element.services.length > 1 ? element?.services[1]?.price : '',
      typeservice3:
        element.services.length > 2
          ? element?.services[2]?.servicesType
          : 'Seleccione',
      serviced3:
        element.services.length > 2
          ? element.services[2]?.servicesDescription
          : '',
      servicet3: element.services.length > 2 ? element.services[2]?.price : '',
    });
  }
  private replaceBrWithNewline(text: string): string {
    // Reemplaza <br> con un salto de línea
    return text?.replace(/<br>/g, '').replace(/&nbsp;/g, '') ?? text;
  }
  private replaceNbspWithBr(text: string): string {
    // Reemplaza &nbsp; con <br> solo si el texto no es nulo ni indefinido
    return text;
  }

  updateOrder() {
    let servicesArray: Services[] = [];
    let data = [];
    let service1;
    let service2;
    let service3;
    let salta = false;
    let totalCharged = 0;
    let observacion = undefined;

    if (this.ServiceForm.value.serviced1 !== null) {
      service1 = new Services(
        this.ServiceForm.value.idservice1,
        this.ServiceForm.value.typeservice1,
        this.ServiceForm.value.serviced1,
        parseFloat(this.ServiceForm.value.servicet1)
      );
    }
    if (this.ServiceForm.value.serviced2)
      service2 = new Services(
        this.ServiceForm.value.idservice2,
        this.ServiceForm.value.typeservice2,
        this.ServiceForm.value.serviced2,
        parseFloat(this.ServiceForm.value.servicet2)
      );
    if (this.ServiceForm.value.serviced3)
      service3 = new Services(
        this.ServiceForm.value.idservice3,
        this.ServiceForm.value.typeservice3,
        this.ServiceForm.value.serviced3,
        parseFloat(this.ServiceForm.value.servicet3)
      );
    if (service1 && service2 && service3) {
      servicesArray = [service1, service2, service3];
      totalCharged = service1.price + service2.price + service3.price;
      salta = true;
    }
    if (service1 && service2 && !salta) {
      totalCharged = service1.price + service2.price;
      servicesArray = [service1, service2];
      salta = true;
    }
    if (service1 && !salta) {
      totalCharged = service1.price;
      servicesArray = [service1];
    }

    if (this.ServiceForm.value.observations != '') {
      observacion = this.ServiceForm.value.observations;
    }

    let order = new Order(
      parseFloat(this.ServiceForm.value.NumeroOrden),
      servicesArray,
      this.ServiceForm.value.status,
      observacion,
      undefined,
      this.OrderList[this.currentRowIndex].infoClient
    );
    if (this.currentRowIndex !== undefined) {
      this.Orders.UpdateOrders(order).subscribe(
        (updatedOrder) => {
          var resultado: any = updatedOrder;
          this.OrderList[this.currentRowIndex] = this.ServiceForm.value;
          this.ServiceForm = this.fb.group({
            NumeroOrden: '',
            observations: '',
            typeservice1: 'Seleccione',
            typeservice2: 'Seleccione',
            typeservice3: 'Seleccione',
            serviced1: '',
            serviced2: '',
            serviced3: '',
            servicet1: '',
            servicet2: '',
            servicet3: '',
            status: '',
          });
          alert(resultado.message);
          location.reload();
        },
        (error) => {
          console.error('Error al actualizar el cliente:', error);
        }
      );
    }
  }
}
