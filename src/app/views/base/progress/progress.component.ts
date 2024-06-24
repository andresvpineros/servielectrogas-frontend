import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../../shared/services/schedules.service';
import { OrdersService } from '../../../shared/services/orders.service';
import { UsersService } from '../../../shared/services/users.service';
import { Schedule } from '../../Model/Order';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  AgendaForm: FormGroup;
  schedule: Schedule;
  currentRowIndex!: number;
  IsCreate = true;
  IsEdit = false;
  filteredElements!: any;
  schedulList!: any;
  collection: any;
  inputValue: string = '';
  totalRecords: number = 0;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  search: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private Orders: OrdersService,
    private schedules: SchedulesService,
    private users: UsersService
  ) {
    this.schedule = new Schedule(undefined, '', '', 0, 0);
    this.AgendaForm = this.formBuilder.group({
      id: '',
      idorden: '',
      iduser: '',
      tecnico: '',
      fecha: '',
      horaF: '',
      cliente: '',
      direccion: '',
    });
  }

  ngOnInit() {
    this.getAllSchedules(this.currentPage);
  }

  getAllSchedules(page: number) {
    const response = this.schedules.getAllSchedules(page, this.search);

    response.subscribe({
      next: (value) => {
        this.schedulList = value.content;
        this.totalPages = value.totalPages;
        this.currentPage = value.pageNumber;
        this.totalRecords = value.totalElements;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onEdit(element: any, rowIndex: number) {
    this.IsEdit = true;
    this.IsCreate = false;
    this.currentRowIndex = rowIndex;
    this.AgendaForm.setValue({
      id: element.idSchedule,
      idorden: element.idOrder,
      iduser: element.idUser,
      tecnico: element.nameUser,
      fecha: this.formatDate(element.date),
      horaF: element.hour,
      cliente: element.infoClient,
      direccion: element.address,
    });
  }

  newSchedule: any = {
    id: null,
    date: '',
    hour: null,
    idOrder: '',
    idUser: null,
  };

  GetTecnico() {
    this.users.gettechnicalByName(this.AgendaForm.value.tecnico).subscribe({
      next: (val: any) => {
        if (!val.message) {
          this.AgendaForm.setValue({
            id: this.AgendaForm.value.id,
            iduser: val.id,
            tecnico: val.name,
            fechaadd: this.AgendaForm.value.fecha,
            horaF: this.AgendaForm.value.horaF,
            idordenadd: this.AgendaForm.value.idorden,
          });
          alert('Tecnico seleccinado: ' + val.name);
        } else {
          alert(val.message);
        }
      },
      error: (err: any) => {
        console.log('error');
        alert('Tecnico no encontrado');
      },
    });
  }

  GetOrden() {
    this.Orders.GetOrder(this.AgendaForm.value.idorden).subscribe({
      next: (val: any) => {
        if (!val.message) {
          this.AgendaForm.setValue({
            idtecnico: this.AgendaForm.value.idtecnico,
            tecnico: this.AgendaForm.value.tecnico,
            fechaadd: this.AgendaForm.value.fecha,
            horaF: this.AgendaForm.value.horaF,
            idorden: this.AgendaForm.value.idordenadd,
          });
          alert('Orden seleccinada ');
        } else {
          alert(val.message);
        }
      },
      error: (err: any) => {
        console.log('error');
        alert('Orden no encontrada');
      },
    });
  }

  deleteElement(rowIndex: number) {
    var id = this.schedulList[rowIndex].idSchedule;
    this.schedules.DeleteSchedule(id).subscribe(
      (deletedUser) => {
        alert('Se quito la agenda seleccionada');
        this.schedulList.splice(rowIndex, 1);
        let data = JSON.stringify(this.schedulList);
        localStorage.setItem('agenda', data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filter(term: string) {
    if (!term) {
      return this.schedulList;
    }
    return this.schedulList.filter((element: { date: string }) =>
      element.date.toLowerCase().includes(term.toLowerCase())
    );
  }

  formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();

    return `${year}-${this.pad(month)}-${this.pad(day)}`;
  }

  pad(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
  }

  getBeforeDash(str: string): string {
    const parts = str.split(' -');
    return parts[0];
  }

  getAfterDash(str: string): string {
    const parts = str.split('- ');
    return parts[1];
  }

  updateSchedule() {
    let schedule;
    let Hora: string;
    Hora = this.AgendaForm.value.horaF;
    schedule = new Schedule(
      this.AgendaForm.value.id,
      this.AgendaForm.value.fecha,
      Hora,
      this.AgendaForm.value.iduser,
      this.AgendaForm.value.idorden
    );

    // if (this.currentRowIndex !== undefined) {
    //   this.schedules.UpdateSchedule(schedule).subscribe(
    //     (updatedSchedule) => {
    //       console.log('Agenda Actualizada:', updatedSchedule);
    //       this.schedulList[this.currentRowIndex].date =
    //         this.AgendaForm.value.fecha;
    //       this.schedulList[this.currentRowIndex].hour = Hora;
    //       let data = JSON.stringify(this.schedulList);
    //       localStorage.setItem('agenda', data);
    //       this.AgendaForm = this.formBuilder.group({
    //         id: '',
    //         idorden: '',
    //         iduser: '',
    //         tecnico: '',
    //         fecha: '',
    //         hora: '',
    //         horaF: '',
    //         cliente: '',
    //         direccion: '',
    //         horario: 'AM',
    //       });
    //     },
    //     (error) => {
    //       console.error('Error al actualizar Agenda:', error);
    //       alert('Error al actualizar Agenda');
    //     }
    //   );
    // }
  }

  redirectToLink() {
    const formattedDate = this.inputValue.replace(/\//g, '-');
    if (formattedDate) {
      // Define the link URL with the formatted date
      const linkUrl = `http://localhost:8080/api/schedules/download/reporte.xlsx?date=${encodeURIComponent(
        formattedDate
      )}`;
      // Redirect to the link URL
      window.location.href = linkUrl;
    } else {
      // Show an alert if formattedDate is null or undefined
      alert('Dese seleccionar una fecha valida.');
    }
  }
}
