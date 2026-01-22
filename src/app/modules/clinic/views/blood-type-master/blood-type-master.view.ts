import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { BloodTypeService } from '../../../../core/services/blood-type.service';
import { ToastService } from '../../../../core/services/toast.service';
import { BloodType } from '../../../../core/models/blood-type.model';

@Component({
  selector: 'app-blood-type-master',
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
  templateUrl: './blood-type-master.view.html',
})
export class BloodTypeMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bloodTypeService = inject(BloodTypeService);
  private readonly toastService = inject(ToastService);

  protected readonly bloodTypes = signal<BloodType[]>([]);
  protected readonly selectedBloodType = signal<BloodType | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadBloodTypes();
  }

  private loadBloodTypes(): void {
    this.loadingTable.set(true);
    this.bloodTypeService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.bloodTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los tipos de sangre');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<BloodType>): void {
    const bloodType = selectionEvent.data;

    if (!bloodType || Array.isArray(bloodType)) {
      return;
    }

    this.selectedBloodType.set(bloodType);
    this.form.patchValue({
      name: bloodType.name,
      description: bloodType.description ?? '',
    });
  }

  onClear(): void {
    this.selectedBloodType.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedBloodType();

    if (selected) {
      this.bloodTypeService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de sangre actualizado exitosamente');
              this.loadBloodTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el tipo de sangre');
          },
        });
    } else {
      this.bloodTypeService
        .create({
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de sangre creado exitosamente');
              this.loadBloodTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el tipo de sangre');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedBloodType();
    if (!selected) return;

    this.loading.set(true);
    this.bloodTypeService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Tipo de sangre eliminado exitosamente');
          this.loadBloodTypes();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el tipo de sangre');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedBloodType() !== null;
  }
}
