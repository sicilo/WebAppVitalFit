import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceCategoryService } from '../../../services/service-category.service';
import { ServiceCategory } from '../../../interfaces/service-category.interface';
import { ServiceCategoryFormComponent } from '../service-category-form/service-category-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './service-category-list.component.html',
  styleUrl: './service-category-list.component.scss'
})
export class ServiceCategoryListComponent implements OnInit {
  private serviceCategoryService = inject(ServiceCategoryService);
  private dialog = inject(MatDialog);

  categories: ServiceCategory[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'type', 'description', 'actions'];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.serviceCategoryService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.categories = response.value;
        } else {
          this.errorMessage = 'Error al cargar categorías de servicios';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar categorías:', error);
        this.errorMessage = error.error?.message || 'Error al cargar categorías de servicios';
      }
    });
  }

  createCategory(): void {
    const dialogRef = this.dialog.open(ServiceCategoryFormComponent, {
      width: '600px',
      data: { category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  editCategory(category: ServiceCategory): void {
    const dialogRef = this.dialog.open(ServiceCategoryFormComponent, {
      width: '600px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  confirmDelete(category: ServiceCategory): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la categoría ${category.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && category.id) {
        this.deleteCategory(category.id);
      }
    });
  }

  deleteCategory(categoryId: number): void {
    this.serviceCategoryService.delete(categoryId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La categoría ha sido eliminada exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadCategories();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la categoría',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar categoría:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar la categoría',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'facial': 'Facial',
      'corporal': 'Corporal',
      'laser': 'Láser',
      'otro': 'Otro'
    };
    return labels[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'facial': 'primary',
      'corporal': 'accent',
      'laser': 'warn',
      'otro': ''
    };
    return colors[type] || '';
  }
}
