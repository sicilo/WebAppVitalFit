import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BloodTypeService } from '../../../services/blood-type.service';
import { BloodType } from '../../../interfaces/blood-type.interface';
import Swal from 'sweetalert2';
import { BloodTypeFormComponent } from '../blood-type-form/blood-type-form.component';

@Component({
  selector: 'app-blood-type-list',
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
  templateUrl: './blood-type-list.component.html',
  styleUrl: './blood-type-list.component.scss',
})
export class BloodTypeListComponent implements OnInit {
  private bloodTypeService = inject(BloodTypeService);
  private dialog = inject(MatDialog);

  bloodTypes: BloodType[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'name',
    'description',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    this.loadBloodTypes();
  }

  loadBloodTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bloodTypeService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.bloodTypes = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar tipos de sangre';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar tipos de sangre';
      },
    });
  }

  createBloodType(): void {
    const dialogRef = this.dialog.open(BloodTypeFormComponent, {
      width: '600px',
      data: { bloodType: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBloodTypes();
      }
    });
  }

  editBloodType(bloodType: BloodType): void {
    const dialogRef = this.dialog.open(BloodTypeFormComponent, {
      width: '600px',
      data: { bloodType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBloodTypes();
      }
    });
  }

  confirmDelete(bloodType: BloodType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de sangre ${bloodType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && bloodType.id) {
        this.deleteBloodType(bloodType.id);
      }
    });
  }

  deleteBloodType(bloodTypeId: string): void {
    this.bloodTypeService.delete(bloodTypeId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El tipo de sangre ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadBloodTypes();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el tipo de sangre',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de sangre:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el tipo de sangre',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return dateObj.toLocaleDateString('es-ES', options);
  }
}
