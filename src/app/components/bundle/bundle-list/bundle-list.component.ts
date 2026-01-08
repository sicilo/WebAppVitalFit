import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BundleService } from '../../../services/bundle.service';
import { Bundle } from '../../../interfaces/bundle.interface';
import { BundleFormComponent } from '../bundle-form/bundle-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bundle-list',
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
  templateUrl: './bundle-list.component.html',
  styleUrl: './bundle-list.component.scss'
})
export class BundleListComponent implements OnInit {
  private bundleService = inject(BundleService);
  private dialog = inject(MatDialog);

  bundles: Bundle[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'price', 'description', 'actions'];

  ngOnInit(): void {
    this.loadBundles();
  }

  loadBundles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bundleService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.bundles = response.value;
        } else {
          this.errorMessage = response.error?.message || 'Error al cargar paquetes';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar paquetes';
      }
    });
  }

  createBundle(): void {
    const dialogRef = this.dialog.open(BundleFormComponent, {
      width: '600px',
      data: { bundle: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBundles();
      }
    });
  }

  editBundle(bundle: Bundle): void {
    const dialogRef = this.dialog.open(BundleFormComponent, {
      width: '600px',
      data: { bundle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBundles();
      }
    });
  }

  confirmDelete(bundle: Bundle): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el paquete ${bundle.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && bundle.id) {
        this.deleteBundle(bundle.id);
      }
    });
  }

  deleteBundle(bundleId: string): void {
    this.bundleService.delete(bundleId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El paquete ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadBundles();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el paquete',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar paquete:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el paquete',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
