import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenderService } from '../../../services/gender.service';
import { Gender } from '../../../interfaces/gender.interface';
import { GenderFormComponent } from '../gender-form/gender-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gender-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './gender-list.component.html',
  styleUrl: './gender-list.component.scss'
})
export class GenderListComponent implements OnInit {
  private genderService = inject(GenderService);
  private dialog = inject(MatDialog);

  genders: Gender[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadGenders();
  }

  loadGenders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.genderService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.genders = response.value;
        } else {
          this.errorMessage = response.error?.message || 'Error al cargar géneros';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar géneros';
      }
    });
  }

  createGender(): void {
    const dialogRef = this.dialog.open(GenderFormComponent, {
      width: '600px',
      data: { gender: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGenders();
      }
    });
  }

  editGender(gender: Gender): void {
    const dialogRef = this.dialog.open(GenderFormComponent, {
      width: '600px',
      data: { gender }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGenders();
      }
    });
  }

  confirmDelete(gender: Gender): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el género ${gender.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && gender.id) {
        this.deleteGender(gender.id);
      }
    });
  }

  deleteGender(genderId: string): void {
    this.genderService.delete(genderId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El género ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadGenders();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el género',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar género:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el género',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
