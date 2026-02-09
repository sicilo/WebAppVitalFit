import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { BundleService } from '../../../../core/services/bundle.service';
import { BundleItemService } from '../../../../core/services/bundle-item.service';
import { ItemService } from '../../../../core/services/item.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Bundle } from '../../../../core/models/bundle.model';
import { BundlePickListItem } from '../../../../core/models/bundle-item.model';

@Component({
  selector: 'app-bundle-configuration',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    TableModule,
    PanelModule,
    PickListModule,
    TooltipModule,
  ],
  templateUrl: './bundle-configuration.view.html',
})
export class BundleConfigurationView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bundleService = inject(BundleService);
  private readonly bundleItemService = inject(BundleItemService);
  private readonly itemService = inject(ItemService);
  private readonly toastService = inject(ToastService);

  protected readonly bundles = signal<Bundle[]>([]);
  protected readonly selectedBundle = signal<Bundle | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);
  protected readonly loadingPickList = signal(false);
  protected readonly savingItems = signal(false);
  protected sourceItems: BundlePickListItem[] = [];
  protected targetItems: BundlePickListItem[] = [];

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

  private loadPickListItems(bundleId: string): void {
    this.loadingPickList.set(true);
    forkJoin({
      allItems: this.itemService.getPaged({ page: 1, itemsPerPage: 1000 }),
      bundleItems: this.bundleItemService.getAll(bundleId),
    }).subscribe({
      next: ({ allItems, bundleItems }) => {
        this.loadingPickList.set(false);
        const assigned = bundleItems.value ?? [];
        const assignedIds = new Set(assigned.map((bi) => bi.itemId));

        this.targetItems = assigned.map((bi) => ({
          itemId: bi.itemId,
          itemName: bi.itemName,
          itemDescription: bi.itemDescription,
          itemTypeName: bi.itemTypeName,
          number: bi.itemAmount,
        }));

        const items = allItems.value?.items ?? [];
        this.sourceItems = items
          .filter((item) => !assignedIds.has(item.id))
          .map((item) => ({
            itemId: item.id,
            itemName: item.name,
            itemDescription: item.description,
            itemTypeName: item.itemTypeName,
            number: 1,
          }));
      },
      error: () => {
        this.loadingPickList.set(false);
        this.toastService.error('Error al cargar los artículos del paquete');
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
    this.loadPickListItems(bundle.id);
  }

  onClear(): void {
    this.selectedBundle.set(null);
    this.form.reset({ name: '', description: '', price: 0 });
    this.sourceItems = [];
    this.targetItems = [];
  }

  onRefreshBundleItems(): void {
    const selected = this.selectedBundle();
    if (!selected) return;
    this.loadPickListItems(selected.id);
  }

  onSaveBundleItems(): void {
    const selected = this.selectedBundle();
    if (!selected) return;

    this.savingItems.set(true);
    this.bundleItemService
      .save({
        bundleId: selected.id,
        items: this.targetItems.map((item) => ({
          itemId: item.itemId,
          number: item.number,
        })),
      })
      .subscribe({
        next: (response) => {
          this.savingItems.set(false);
          if (response.value) {
            this.toastService.success('Artículos del paquete guardados exitosamente');
          } else if (response.error) {
            this.toastService.error(response.error.message);
          }
        },
        error: () => {
          this.savingItems.set(false);
          this.toastService.error('Error al guardar los artículos del paquete');
        },
      });
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
