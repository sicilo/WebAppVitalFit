import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InsuranceProviderService } from '../../../services/insurance-provider.service';
import { InsuranceProvider } from '../../../interfaces/insurance-provider.interface';
import { InsuranceProviderFormComponent } from '../insurance-provider-form/insurance-provider-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insurance-provider-list',
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
  templateUrl: './insurance-provider-list.component.html',
  styleUrl: './insurance-provider-list.component.scss'
})
export class InsuranceProviderListComponent implements OnInit {
  private insuranceProviderService = inject(InsuranceProviderService);
  private dialog = inject(MatDialog);

  providers: InsuranceProvider[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'code', 'phone', 'email', 'actions'];

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.insuranceProviderService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.providers = response.value;
        } else {
          this.errorMessage = 'Error al cargar EPS/Aseguradoras';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar EPS/Aseguradoras:', error);
        this.errorMessage = error.error?.message || 'Error al cargar EPS/Aseguradoras';
      }
    });
  }

  createProvider(): void {
    const dialogRef = this.dialog.open(InsuranceProviderFormComponent, {
      width: '700px',
      data: { provider: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProviders();
      }
    });
  }

  editProvider(provider: InsuranceProvider): void {
    const dialogRef = this.dialog.open(InsuranceProviderFormComponent, {
      width: '700px',
      data: { provider }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProviders();
      }
    });
  }

  confirmDelete(provider: InsuranceProvider): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${provider.name}?`,
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
    this.insuranceProviderService.delete(providerId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'EPS/Aseguradora eliminada exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadProviders();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la EPS/Aseguradora',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar EPS/Aseguradora:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar la EPS/Aseguradora',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
