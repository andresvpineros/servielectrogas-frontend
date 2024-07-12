import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../../shared/services/orders.service';
import { Order, Services } from '../../views/Model/Order';
import { EChartsOption } from 'echarts';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  ServiceForm: FormGroup;
  OrderList: Order[] = [];
  currentRowIndex!: number;
  displayedColumns: string[] = [
    'id',
    'Fecha',
    'Cliente',
    'Tecnico',
    'Estado',
    'action',
  ];
  dataSource: MatTableDataSource<Order>;

  // Opciones del gráfico de dona
  public donutChartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Ordenes',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 10, name: 'Realizados' },
          { value: 5, name: 'Aplazados' },
          { value: 3, name: 'Cancelados' },
        ],
      },
    ],
  };

  // Opciones del gráfico de barras
  public barChartOptions: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: ['Realizados', 'Aplazados', 'Cancelados'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Ordenes',
        type: 'bar',
        data: [10, 5, 3],
      },
    ],
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private Orders: OrdersService) {
    this.ServiceForm = this.fb.group({
      NumeroOrden: ['', Validators.required],
      observations: [''],
      idservice1: [''],
      idservice2: [''],
      idservice3: [''],
      typeservice1: ['Seleccione'],
      typeservice2: ['Seleccione'],
      typeservice3: ['Seleccione'],
      serviced1: [''],
      serviced2: [''],
      serviced3: [''],
      servicet1: [''],
      servicet2: [''],
      servicet3: [''],
      status: ['', Validators.required],
    });

    this.dataSource = new MatTableDataSource(this.OrderList);
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadOrders(): void {
    this.Orders.GetOrders().subscribe(
      (data) => {
        this.OrderList = data.map((row) => {
          return {
            ...row,
            observations: this.replaceNbspWithBr(row.observations),
          };
        });
        this.dataSource.data = this.OrderList;
      },
      (error) => {
        console.error('Error al cargar las órdenes:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(element: Order, rowIndex: number): void {
    this.currentRowIndex = rowIndex;
    this.ServiceForm.setValue({
      NumeroOrden: element.id,
      observations: this.replaceBrWithNewline(element.observations),
      status: element.status,
      idservice1: element.services.length > 0 ? element.services[0]?.id : '',
      idservice2: element.services.length > 1 ? element.services[1]?.id : '',
      idservice3: element.services.length > 2 ? element.services[2]?.id : '',
      typeservice1:
        element.services.length > 0
          ? element.services[0]?.servicesType
          : 'Seleccione',
      serviced1:
        element.services.length > 0
          ? element.services[0]?.servicesDescription
          : '',
      servicet1: element.services.length > 0 ? element.services[0]?.price : '',
      typeservice2:
        element.services.length > 1
          ? element.services[1]?.servicesType
          : 'Seleccione',
      serviced2:
        element.services.length > 1
          ? element.services[1]?.servicesDescription
          : '',
      servicet2: element.services.length > 1 ? element.services[1]?.price : '',
      typeservice3:
        element.services.length > 2
          ? element.services[2]?.servicesType
          : 'Seleccione',
      serviced3:
        element.services.length > 2
          ? element.services[2]?.servicesDescription
          : '',
      servicet3: element.services.length > 2 ? element.services[2]?.price : '',
    });
  }

  private replaceBrWithNewline(text: string): string {
    return text?.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ') ?? text;
  }

  private replaceNbspWithBr(text: string): string {
    return text?.replace(/&nbsp;/g, ' ') ?? text;
  }

  updateOrder(): void {
    let servicesArray: Services[] = [];
    let totalCharged = 0;
    let observacion = this.ServiceForm.value.observations;

    if (this.ServiceForm.value.serviced1) {
      let service1 = new Services(
        this.ServiceForm.value.idservice1,
        this.ServiceForm.value.typeservice1,
        this.ServiceForm.value.serviced1,
        parseFloat(this.ServiceForm.value.servicet1)
      );
      servicesArray.push(service1);
      totalCharged += service1.price;
    }
    if (this.ServiceForm.value.serviced2) {
      let service2 = new Services(
        this.ServiceForm.value.idservice2,
        this.ServiceForm.value.typeservice2,
        this.ServiceForm.value.serviced2,
        parseFloat(this.ServiceForm.value.servicet2)
      );
      servicesArray.push(service2);
      totalCharged += service2.price;
    }
    if (this.ServiceForm.value.serviced3) {
      let service3 = new Services(
        this.ServiceForm.value.idservice3,
        this.ServiceForm.value.typeservice3,
        this.ServiceForm.value.serviced3,
        parseFloat(this.ServiceForm.value.servicet3)
      );
      servicesArray.push(service3);
      totalCharged += service3.price;
    }

    let order = new Order(
      parseFloat(this.ServiceForm.value.NumeroOrden),
      servicesArray,
      this.ServiceForm.value.status,
      observacion,
      totalCharged,
      this.OrderList[this.currentRowIndex].infoClient
    );

    if (this.currentRowIndex !== undefined) {
      this.Orders.UpdateOrders(order).subscribe(
        (updatedOrder) => {
          this.OrderList[this.currentRowIndex] = { ...order, totalCharged };
          this.dataSource.data = this.OrderList; // Update data source
          this.ServiceForm.reset();
          alert('Orden actualizada correctamente');
        },
        (error) => {
          console.error('Error al actualizar la orden:', error);
        }
      );
    }
  }
}
