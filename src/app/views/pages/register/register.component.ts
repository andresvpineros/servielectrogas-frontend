import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AfterViewInit, OnDestroy } from '@angular/core';
import { Customer } from '../../Model/Customer';
import { Users } from '../../Model/Users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  formSubmitted = false;
  roleOptions: string[] = ['ADMIN', 'TECNICO', 'Call Center']; // Declare roleOptions here
  error = '';
  filterControl = new FormControl();
  userForm: FormGroup;
  currentRowIndex!: number;
  IsCreate = true;
  IsEdit = false;
  filteredElements!: any;
  userList!: Users[];
  collection: any;
  constructor(
    private formBuilder: FormBuilder,
    private UsersService: UsersService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      id: '',
      name: '',
      password: '',
      email: '',
      type: 'Seleccione',
    });
  }

  ngOnInit() {
    this.UsersService.GetUsers().subscribe((data) => {
      this.userList = data;
    });
    this.filteredElements = this.userList; // Inicialmente, todos los elementos son visibles.
    this.filterControl.valueChanges
      .pipe(
        debounceTime(300), // Espera por 300ms después de cada pulsación de tecla antes de considerar el término del filtro
        distinctUntilChanged() // Solo emite si el valor actual es diferente al último
      )
      .subscribe((term: string) => {
        this.filteredElements = this.filter(term);
      });
  }

  onEdit(element: any, rowIndex: number) {
    this.IsEdit = true;
    this.IsCreate = false;
    this.currentRowIndex = rowIndex;
    this.userForm.setValue({
      id: element.id,
      name: element.name,
      password: element.password,
      email: element.email,
      type: element.type,
    });
  }

  onAdd() {
    this.IsEdit = false;
    this.IsCreate = true;
    this.userForm.setValue({
      id: '',
      name: '',
      password: '',
      email: '',
      type: 'Seleccione',
    });
  }

  newUser: any = { name: null, email: '', password: null, type: '' };

  createNew() {
    this.newUser = {
      name: this.userForm.value.name,
      password: this.userForm.value.password,
      email: this.userForm.value.email,
      type: this.userForm.value.type,
    };
    this.UsersService.SaveUser(this.newUser).subscribe(
      (createdUser) => {
        alert('Usuario creado!');
        this.UsersService.GetUsers().subscribe((data) => {
          this.userList = data;
        });
        this.userForm = this.formBuilder.group({
          id: '',
          name: '',
          password: '',
          email: '',
          type: 'Seleccione',
        });
      },
      (error) => {
        console.error('Error al crear el cliente:', error);
      }
    );
  }

  updateUser() {
    if (this.currentRowIndex !== undefined) {
      this.userList[this.currentRowIndex] = this.userForm.value;
      this.UsersService.UpdateUser(
        this.userList[this.currentRowIndex]
      ).subscribe(
        (updatedUser) => {
          console.log('Cliente actualizado:', updatedUser);
          this.userList[this.currentRowIndex] = this.userForm.value;
          this.userForm = this.formBuilder.group({
            id: '',
            name: '',
            document: '',
            address: '',
            phone: '',
            email: '',
            type: 'Seleccione',
          });
        },
        (error) => {
          console.error('Error al actualizar el cliente:', error);
        }
      );
    }
  }

  filter(term: string) {
    if (!term) {
      return this.userList; // Si no hay término de búsqueda, muestra todos los elementos
    }
    return this.userList.filter(
      (element) => element.name.toLowerCase().includes(term.toLowerCase()) // Ajusta esto según las propiedades de tus elementos
    );
  }

  deleteElement(index: number) {
    let usId = this.userList[index].id;
    this.UsersService.DeleteUser(usId).subscribe(
      (deletedUser) => {
        alert('Usuario Eliminado con exito');
        this.userList.splice(index, 1);
      },
      (error) => {
        alert('Error al eliminar usuario');
        console.error('Error al eliminar usuario', error);
      }
    );
  }

  goToPage(pageNumber: number) {
    // Logica para ir a la página específica (si estás usando paginación)
  }
}
