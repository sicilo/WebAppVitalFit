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
import { BonusService } from '../../../../core/services/bonus.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Bonus } from '../../../../core/models/bonus.model';

@Component({
  selector: 'app-bonus-master',
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
  templateUrl: './bonus-master.view.html',
})
export class BonusMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bonusService = inject(BonusService);
  private readonly toastService = inject(ToastService);

  protected readonly bonuses = signal<Bonus[]>([]);
  protected readonly selectedBonus = signal<Bonus | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    sessions: [1, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadBonuses();
  }

  private loadBonuses(): void {
    this.loadingTable.set(true);
    this.bonusService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.bonuses.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los bonos');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Bonus>): void {
    const bonus = selectionEvent.data;

    if (!bonus || Array.isArray(bonus)) {
      return;
    }

    this.selectedBonus.set(bonus);
    this.form.patchValue({
      name: bonus.name,
      description: bonus.description ?? '',
      sessions: bonus.sessions ?? 1,
      price: bonus.price ?? 0,
    });
  }

  onClear(): void {
    this.selectedBonus.set(null);
    this.form.reset({ name: '', description: '', sessions: 1, price: 0 });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedBonus();

    if (selected) {
      this.bonusService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
          sessions: formValue.sessions,
          price: formValue.price,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Bono actualizado exitosamente');
              this.loadBonuses();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el bono');
          },
        });
    } else {
      this.bonusService
        .create({
          name: formValue.name,
          description: formValue.description,
          sessions: formValue.sessions,
          price: formValue.price,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Bono creado exitosamente');
              this.loadBonuses();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el bono');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedBonus();
    if (!selected) return;

    this.loading.set(true);
    this.bonusService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Bono eliminado exitosamente');
          this.loadBonuses();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el bono');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedBonus() !== null;
  }
}
