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
import { ServiceService } from '../../../../core/services/service.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service-master',
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
  templateUrl: './service-master.view.html',
})
export class ServiceMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceService = inject(ServiceService);
  private readonly toastService = inject(ToastService);

  protected readonly services = signal<Service[]>([]);
  protected readonly selectedService = signal<Service | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadServices();
  }

  private loadServices(): void {
    this.loadingTable.set(true);
    this.serviceService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.services.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los servicios');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Service>): void {
    const service = selectionEvent.data;

    if (!service || Array.isArray(service)) {
      return;
    }

    this.selectedService.set(service);
    this.form.patchValue({
      name: service.name,
      price: service.price ?? 0,
      description: service.description ?? '',
    });
  }

  onClear(): void {
    this.selectedService.set(null);
    this.form.reset({ name: '', price: 0, description: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedService();

    if (selected) {
      this.serviceService
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
              this.toastService.success('Servicio actualizado exitosamente');
              this.loadServices();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el servicio');
          },
        });
    } else {
      this.serviceService
        .create({
          name: formValue.name,
          price: formValue.price,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Servicio creado exitosamente');
              this.loadServices();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el servicio');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedService();
    if (!selected) return;

    this.loading.set(true);
    this.serviceService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Servicio eliminado exitosamente');
          this.loadServices();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el servicio');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedService() !== null;
  }
}
