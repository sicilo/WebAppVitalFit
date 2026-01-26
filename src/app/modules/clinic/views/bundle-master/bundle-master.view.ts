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
import { BundleService } from '../../../../core/services/bundle.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Bundle } from '../../../../core/models/bundle.model';

@Component({
  selector: 'app-bundle-master',
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
  templateUrl: './bundle-master.view.html',
})
export class BundleMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bundleService = inject(BundleService);
  private readonly toastService = inject(ToastService);

  protected readonly bundles = signal<Bundle[]>([]);
  protected readonly selectedBundle = signal<Bundle | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadBundles();
  }

  private loadBundles(): void {
    this.loadingTable.set(true);
    this.bundleService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.bundles.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los paquetes');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Bundle>): void {
    const bundle = selectionEvent.data;

    if (!bundle || Array.isArray(bundle)) {
      return;
    }

    this.selectedBundle.set(bundle);
    this.form.patchValue({
      name: bundle.name,
      description: bundle.description ?? '',
      price: bundle.price ?? 0,
    });
  }

  onClear(): void {
    this.selectedBundle.set(null);
    this.form.reset({ name: '', description: '', price: 0 });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedBundle();

    if (selected) {
      this.bundleService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Paquete actualizado exitosamente');
              this.loadBundles();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el paquete');
          },
        });
    } else {
      this.bundleService
        .create({
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Paquete creado exitosamente');
              this.loadBundles();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el paquete');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedBundle();
    if (!selected) return;

    this.loading.set(true);
    this.bundleService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Paquete eliminado exitosamente');
          this.loadBundles();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el paquete');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedBundle() !== null;
  }
}
