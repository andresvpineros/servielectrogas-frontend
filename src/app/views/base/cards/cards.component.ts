import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { customerService } from '../../../shared/services/customer.service';
import { Customer } from '../../Model/Customer';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
  filterControl = new FormControl();
  ClientForm: FormGroup;
  currentRowIndex!: number;
  IsCreate = true;
  IsEdit = false;
  filteredElements!: any;
  customerList!: Customer[];
  collection: any;
  constructor(
    private formBuilder: FormBuilder,
    private customers: customerService
  ) {
    this.ClientForm = this.formBuilder.group({
      id: '',
      names: '',
      document: '',
      address: '',
      phone: '',
      email: '',
      type: 'Seleccione',
    });
  }
  ngOnInit() {
    this.customers.GetCustomers().subscribe((data) => {
      this.customerList = data;
    });
    this.filteredElements = this.customerList; // Inicialmente, todos los elementos son visibles.
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
    this.ClientForm.setValue({
      id: element.id,
      names: element.names,
      document: element.document,
      address: element.address,
      phone: element.phone,
      email: element.email,
      type: element.type,
    });
  }

  onAdd() {
    this.IsEdit = false;
    this.IsCreate = true;
    this.ClientForm.setValue({
      id: '',
      names: '',
      document: '',
      address: '',
      phone: '',
      email: '',
      type: 'Seleccione',
    });
  }

  newCustomer: any = {
    names: null,
    document: '',
    address: null,
    phone: '',
    email: '',
    type: '',
  };

  createNew() {
    this.newCustomer = {
      names: this.ClientForm.value.names,
      document: this.ClientForm.value.document,
      address: this.ClientForm.value.address,
      phone: this.ClientForm.value.phone,
      email: this.ClientForm.value.email,
      type: this.ClientForm.value.type,
    };
    this.customers.CreateCustomer(this.newCustomer).subscribe(
      (createdCustomer) => {
        console.log('Cliente creado:', createdCustomer);
        this.customers.GetCustomers().subscribe((data) => {
          this.customerList = data;
        });
        this.ClientForm = this.formBuilder.group({
          id: '',
          names: '',
          document: '',
          address: '',
          phone: '',
          email: '',
          type: 'Seleccione',
        });
      },
      (error) => {
        console.error('Error al crear el cliente:', error);
      }
    );
  }

  updateClient() {
    if (this.currentRowIndex !== undefined) {
      this.customerList[this.currentRowIndex] = this.ClientForm.value;
      this.customers
        .UpdateCustomer(this.customerList[this.currentRowIndex])
        .subscribe(
          (updatedCustomer) => {
            console.log('Cliente actualizado:', updatedCustomer);
            this.customerList[this.currentRowIndex] = this.ClientForm.value;
            this.ClientForm = this.formBuilder.group({
              id: '',
              names: '',
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
      return this.customerList; // Si no hay término de búsqueda, muestra todos los elementos
    }
    return this.customerList.filter(
      (element) => element.name.toLowerCase().includes(term.toLowerCase()) // Ajusta esto según las propiedades de tus elementos
    );
  }

  deleteElement(index: number) {
    this.customerList.splice(index, 1);
    this.customers
      .UpdateCustomer(this.customerList[this.currentRowIndex])
      .subscribe(
        (updatedCustomer) => {
          console.log('Cliente actualizado:', updatedCustomer);
          this.customerList.splice(index, 1);
        },
        (error) => {
          console.error('Error al actualizar el cliente:', error);
        }
      );
  }

  goToPage(pageNumber: number) {
    // Logica para ir a la página específica (si estás usando paginación)
  }
}
