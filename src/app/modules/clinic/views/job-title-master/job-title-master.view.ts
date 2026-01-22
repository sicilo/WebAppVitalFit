import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { JobTitleService } from '../../../../core/services/job-title.service';
import { ToastService } from '../../../../core/services/toast.service';
import { JobTitle } from '../../../../core/models/job-title.model';

@Component({
  selector: 'app-job-title-master',
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
  templateUrl: './job-title-master.view.html',
})
export class JobTitleMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly jobTitleService = inject(JobTitleService);
  private readonly toastService = inject(ToastService);

  protected readonly jobTitles = signal<JobTitle[]>([]);
  protected readonly selectedJobTitle = signal<JobTitle | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadJobTitles();
  }

  private loadJobTitles(): void {
    this.loadingTable.set(true);
    this.jobTitleService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.jobTitles.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los cargos');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<JobTitle>): void {
    const jobTitle = selectionEvent.data;

    if (!jobTitle || Array.isArray(jobTitle)) {
      return;
    }

    this.selectedJobTitle.set(jobTitle);
    this.form.patchValue({
      name: jobTitle.name,
      description: jobTitle.description ?? '',
    });
  }

  onClear(): void {
    this.selectedJobTitle.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedJobTitle();

    if (selected) {
      this.jobTitleService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Cargo actualizado exitosamente');
              this.loadJobTitles();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el cargo');
          },
        });
    } else {
      this.jobTitleService
        .create({
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Cargo creado exitosamente');
              this.loadJobTitles();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el cargo');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedJobTitle();
    if (!selected) return;

    this.loading.set(true);
    this.jobTitleService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Cargo eliminado exitosamente');
          this.loadJobTitles();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el cargo');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedJobTitle() !== null;
  }
}
