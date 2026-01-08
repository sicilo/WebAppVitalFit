import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoveltyTypeService } from '../../../services/novelty-type.service';
import { NoveltyType } from '../../../interfaces/novelty-type.interface';
import { NoveltyTypeFormComponent } from '../novelty-type-form/novelty-type-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-novelty-type-list',
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
  templateUrl: './novelty-type-list.component.html',
  styleUrl: './novelty-type-list.component.scss'
})
export class NoveltyTypeListComponent implements OnInit {
  private noveltyTypeService = inject(NoveltyTypeService);
  private dialog = inject(MatDialog);

  noveltyTypes: NoveltyType[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'price', 'description', 'actions'];

  ngOnInit(): void {
    this.loadNoveltyTypes();
  }

  loadNoveltyTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.noveltyTypeService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.noveltyTypes = response.value;
        } else {
          this.errorMessage = response.error?.message || 'Error al cargar tipos de novedad';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar tipos de novedad';
      }
    });
  }

  createNoveltyType(): void {
    const dialogRef = this.dialog.open(NoveltyTypeFormComponent, {
      width: '600px',
      data: { noveltyType: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNoveltyTypes();
      }
    });
  }

  editNoveltyType(noveltyType: NoveltyType): void {
    const dialogRef = this.dialog.open(NoveltyTypeFormComponent, {
      width: '600px',
      data: { noveltyType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNoveltyTypes();
      }
    });
  }

  confirmDelete(noveltyType: NoveltyType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de novedad ${noveltyType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && noveltyType.id) {
        this.deleteNoveltyType(noveltyType.id);
      }
    });
  }

  deleteNoveltyType(noveltyTypeId: string): void {
    this.noveltyTypeService.delete(noveltyTypeId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El tipo de novedad ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadNoveltyTypes();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el tipo de novedad',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de novedad:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el tipo de novedad',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
