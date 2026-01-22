import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ProductService } from '../../../../core/services/product.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-master',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    TableModule,
    PanelModule,
    TooltipModule,
  ],
  templateUrl: './product-master.view.html',
})
export class ProductMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);

  protected readonly products = signal<Product[]>([]);
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingTable.set(true);
    this.productService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.products.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los productos');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Product>): void {
    const product = selectionEvent.data;

    if (!product || Array.isArray(product)) {
      return;
    }

    this.selectedProduct.set(product);
    this.form.patchValue({
      name: product.name,
      price: product.price ?? 0,
      description: product.description ?? '',
    });
  }

  onClear(): void {
    this.selectedProduct.set(null);
    this.form.reset({ name: '', price: 0, description: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedProduct();

    if (selected) {
      this.productService
        .update({
          id: selected.id,
          name: formValue.name,
          price: formValue.price,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Producto actualizado exitosamente');
              this.loadProducts();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el producto');
          },
        });
    } else {
      this.productService
        .create({
          name: formValue.name,
          price: formValue.price,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Producto creado exitosamente');
              this.loadProducts();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el producto');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedProduct();
    if (!selected) return;

    this.loading.set(true);
    this.productService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Producto eliminado exitosamente');
          this.loadProducts();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el producto');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedProduct() !== null;
  }
}
