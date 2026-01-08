import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';
import Swal from 'sweetalert2';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
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
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'name',
    'price',
    'description',
    'actions',
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.products = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar productos';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar productos';
      },
    });
  }

  createProduct(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { product: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  confirmDelete(product: Product): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && product.id) {
        this.deleteProduct(product.id);
      }
    });
  }

  deleteProduct(productId: string): void {
    this.productService.delete(productId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El producto ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadProducts();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el producto',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el producto',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
