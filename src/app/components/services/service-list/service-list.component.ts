import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../interfaces/service.interface';
import Swal from 'sweetalert2';
import { ServiceFormComponent } from '../service-form/service-form.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss',
})
export class ServiceListComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private dialog = inject(MatDialog);

  services: Service[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'name',
    'price',
    'description',
    'actions',
  ];

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.serviceService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.services = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar servicios';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar servicios';
      },
    });
  }

  createService(): void {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '600px',
      data: { service: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServices();
      }
    });
  }

  editService(service: Service): void {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '600px',
      data: { service },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServices();
      }
    });
  }

  confirmDelete(service: Service): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el servicio ${service.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && service.id) {
        this.deleteService(service.id);
      }
    });
  }

  deleteService(serviceId: string): void {
    this.serviceService.delete(serviceId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El servicio ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadServices();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el servicio',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el servicio',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
