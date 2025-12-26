import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProviderService } from '../../../services/provider.service';
import { Provider } from '../../../interfaces/provider.interface';
import { ProviderFormComponent } from '../provider-form/provider-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-list',
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
  templateUrl: './provider-list.component.html',
  styleUrl: './provider-list.component.scss'
})
export class ProviderListComponent implements OnInit {
  private providerService = inject(ProviderService);
  private dialog = inject(MatDialog);

  providers: Provider[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'nit', 'phone', 'email', 'actions'];

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.providerService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.providers = response.value;
        } else {
          this.errorMessage = 'Error al cargar proveedores';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar proveedores:', error);
        this.errorMessage = error.error?.message || 'Error al cargar proveedores';
      }
    });
  }

  createProvider(): void {
    const dialogRef = this.dialog.open(ProviderFormComponent, {
      width: '700px',
      data: { provider: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProviders();
      }
    });
  }

  editProvider(provider: Provider): void {
    const dialogRef = this.dialog.open(ProviderFormComponent, {
      width: '700px',
      data: { provider }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProviders();
      }
    });
  }

  confirmDelete(provider: Provider): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el proveedor ${provider.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && provider.id) {
        this.deleteProvider(provider.id);
      }
    });
  }

  deleteProvider(providerId: number): void {
    this.providerService.delete(providerId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'Proveedor eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadProviders();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el proveedor',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar proveedor:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el proveedor',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
