import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanionService } from '../../../../services/companion.service';
import { Companion } from '../../../../interfaces/companion.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companion-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './companion-list.component.html',
  styleUrl: './companion-list.component.scss',
})
export class CompanionListComponent implements OnInit {
  private companionService = inject(CompanionService);
  private router = inject(Router);

  companions: Companion[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'identificationTypeName',
    'identification',
    'names',
    'surnames',
    'phone',
    'actions',
  ];

  ngOnInit(): void {
    this.loadCompanions();
  }

  loadCompanions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companionService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.companions = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar acompañantes';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar acompañantes';
      },
    });
  }

  createCompanion(): void {
    this.router.navigate(['/dashboard/companions/create']);
  }

  editCompanion(companion: Companion): void {
    this.router.navigate(['/dashboard/companions/edit', companion.id]);
  }

  confirmDelete(companion: Companion): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al acompañante ${companion.names} ${companion.surnames}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && companion.id) {
        this.deleteCompanion(companion.id);
      }
    });
  }

  deleteCompanion(companionId: string): void {
    this.companionService.delete(companionId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El acompañante ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadCompanions();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el acompañante',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar acompañante:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el acompañante',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
