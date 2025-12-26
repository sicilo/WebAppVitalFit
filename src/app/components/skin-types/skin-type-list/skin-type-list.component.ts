import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SkinTypeService } from '../../../services/skin-type.service';
import { SkinType } from '../../../interfaces/skin-type.interface';
import { SkinTypeFormComponent } from '../skin-type-form/skin-type-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skin-type-list',
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
  templateUrl: './skin-type-list.component.html',
  styleUrl: './skin-type-list.component.scss'
})
export class SkinTypeListComponent implements OnInit {
  private skinTypeService = inject(SkinTypeService);
  private dialog = inject(MatDialog);

  skinTypes: SkinType[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadSkinTypes();
  }

  loadSkinTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.skinTypeService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.skinTypes = response.value;
        } else {
          this.errorMessage = 'Error al cargar tipos de piel';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar tipos de piel:', error);
        this.errorMessage = error.error?.message || 'Error al cargar tipos de piel';
      }
    });
  }

  createSkinType(): void {
    const dialogRef = this.dialog.open(SkinTypeFormComponent, {
      width: '600px',
      data: { skinType: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSkinTypes();
      }
    });
  }

  editSkinType(skinType: SkinType): void {
    const dialogRef = this.dialog.open(SkinTypeFormComponent, {
      width: '600px',
      data: { skinType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSkinTypes();
      }
    });
  }

  confirmDelete(skinType: SkinType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de piel ${skinType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && skinType.id) {
        this.deleteSkinType(skinType.id);
      }
    });
  }

  deleteSkinType(skinTypeId: number): void {
    this.skinTypeService.delete(skinTypeId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El tipo de piel ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadSkinTypes();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el tipo de piel',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de piel:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el tipo de piel',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
