import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { IdentificationTypeService } from '../../../../core/services/identification-type.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IdentificationType } from '../../../../core/models/identification-type.model';

@Component({
  selector: 'app-identification-type-master',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TableModule,
    PanelModule,
    TooltipModule,
  ],
  templateUrl: './identification-type-master.view.html',
})
export class IdentificationTypeMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly identificationTypeService = inject(IdentificationTypeService);
  private readonly toastService = inject(ToastService);

  protected readonly identificationTypes = signal<IdentificationType[]>([]);
  protected readonly selectedIdentificationType = signal<IdentificationType | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadIdentificationTypes();
  }

  private loadIdentificationTypes(): void {
    this.loadingTable.set(true);
    this.identificationTypeService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.identificationTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los tipos de identificación');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<IdentificationType>): void {
    const identificationType = selectionEvent.data;

    if (!identificationType || Array.isArray(identificationType)) {
      return
    }

    this.selectedIdentificationType.set(identificationType);
    this.form.patchValue({
      name: identificationType.name,
      description: identificationType.description ?? '',
    });
  }

  onClear(): void {
    this.selectedIdentificationType.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedIdentificationType();

    if (selected) {
      this.identificationTypeService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de identificación actualizado exitosamente');
              this.loadIdentificationTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el tipo de identificación');
          },
        });
    } else {
      this.identificationTypeService
        .create({
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de identificación creado exitosamente');
              this.loadIdentificationTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el tipo de identificación');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedIdentificationType();
    if (!selected) return;

    this.loading.set(true);
    this.identificationTypeService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Tipo de identificación eliminado exitosamente');
          this.loadIdentificationTypes();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el tipo de identificación');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedIdentificationType() !== null;
  }
}
