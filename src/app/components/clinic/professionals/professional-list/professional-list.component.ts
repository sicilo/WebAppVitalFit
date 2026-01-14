import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfessionalService } from '../../../../services/professional.service';
import { Professional } from '../../../../interfaces/professional.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-professional-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './professional-list.component.html',
  styleUrl: './professional-list.component.scss',
})
export class ProfessionalListComponent implements OnInit {
  private professionalService = inject(ProfessionalService);
  private router = inject(Router);

  professionals: Professional[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'identificationTypeName',
    'identification',
    'names',
    'surnames',
    'phone',
    'email',
    'actions',
  ];

  ngOnInit(): void {
    this.loadProfessionals();
  }

  loadProfessionals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.professionalService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.professionals = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar profesionales';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar profesionales';
      },
    });
  }

  createProfessional(): void {
    this.router.navigate(['/dashboard/professionals/create']);
  }

  editProfessional(professional: Professional): void {
    this.router.navigate(['/dashboard/professionals/edit', professional.id]);
  }

  confirmDelete(professional: Professional): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al profesional ${professional.names} ${professional.surnames}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && professional.id) {
        this.deleteProfessional(professional.id);
      }
    });
  }

  deleteProfessional(professionalId: string): void {
    this.professionalService.delete(professionalId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El profesional ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadProfessionals();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el profesional',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar profesional:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el profesional',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
