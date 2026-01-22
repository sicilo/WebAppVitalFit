import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { GenderService } from '../../../../core/services/gender.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Gender } from '../../../../core/models/gender.model';

@Component({
  selector: 'app-gender-master',
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
  templateUrl: './gender-master.view.html',
})
export class GenderMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly genderService = inject(GenderService);
  private readonly toastService = inject(ToastService);

  protected readonly genders = signal<Gender[]>([]);
  protected readonly selectedGender = signal<Gender | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadGenders();
  }

  private loadGenders(): void {
    this.loadingTable.set(true);
    this.genderService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.genders.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los géneros');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Gender>): void {
    const gender = selectionEvent.data;

    if (!gender || Array.isArray(gender)) {
      return;
    }

    this.selectedGender.set(gender);
    this.form.patchValue({
      name: gender.name,
      description: gender.description ?? '',
    });
  }

  onClear(): void {
    this.selectedGender.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedGender();

    if (selected) {
      this.genderService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Género actualizado exitosamente');
              this.loadGenders();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el género');
          },
        });
    } else {
      this.genderService
        .create({
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Género creado exitosamente');
              this.loadGenders();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el género');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedGender();
    if (!selected) return;

    this.loading.set(true);
    this.genderService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Género eliminado exitosamente');
          this.loadGenders();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el género');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedGender() !== null;
  }
}
