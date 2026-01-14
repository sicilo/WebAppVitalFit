import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerService } from '../../../../services/customer.service';
import { Customer } from '../../../../interfaces/customer.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private router = inject(Router);

  customers: Customer[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'identificationTypeName',
    'identification',
    'names',
    'surnames',
    'phone',
    'bloodTypeName',
    'actions',
  ];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.customers = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar clientes';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar clientes';
      },
    });
  }

  createCustomer(): void {
    this.router.navigate(['/dashboard/customers/create']);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/dashboard/customers/edit', customer.id]);
  }

  confirmDelete(customer: Customer): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al cliente ${customer.names} ${customer.surnames}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && customer.id) {
        this.deleteCustomer(customer.id);
      }
    });
  }

  deleteCustomer(customerId: string): void {
    this.customerService.delete(customerId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El cliente ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadCustomers();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el cliente',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar cliente:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el cliente',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
