import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { PickListModule } from 'primeng/picklist';
import { ToastService } from '../../../../core/services/toast.service';
import { PersonService } from '../../../../core/services/person.service';
import { BundleService } from '../../../../core/services/bundle.service';
import { BundleItemService } from '../../../../core/services/bundle-item.service';
import { ItemService } from '../../../../core/services/item.service';
import { ServiceOrderService } from '../../../../core/services/service-order.service';

interface PersonOption {
  id: string;
  displayName: string;
  identification: string;
}

interface SalesPickListItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'bundle' | 'item';
  itemTypeName?: string;
  number: number;
}

@Component({
  selector: 'app-sales-revenue',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    AutoCompleteModule,
    ButtonModule,
    InputNumberModule,
    PanelModule,
    PickListModule,
  ],
  templateUrl: './sales-revenue.view.html',
})
export class SalesRevenueView implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly personService = inject(PersonService);
  private readonly bundleService = inject(BundleService);
  private readonly bundleItemService = inject(BundleItemService);
  private readonly itemService = inject(ItemService);
  private readonly serviceOrderService = inject(ServiceOrderService);

  protected readonly loadingData = signal(false);
  protected readonly saving = signal(false);

  protected selectedPerson: PersonOption | null = null;
  protected consecutive: number | null = null;
  protected loadedOrderId: string | null = null;
  protected personSuggestions: PersonOption[] = [];
  protected sourceItems: SalesPickListItem[] = [];
  protected targetItems: SalesPickListItem[] = [];

  ngOnInit(): void {
    this.loadSourceData();
  }

  private loadSourceData(): void {
    this.loadingData.set(true);
    forkJoin({
      bundles: this.bundleService.getAll(),
      items: this.itemService.getPaged({ page: 1, itemsPerPage: 1000 }),
    }).subscribe({
      next: ({ bundles, items }) => {
        this.loadingData.set(false);
        const bundleEntries: SalesPickListItem[] = (bundles.value ?? []).map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          price: b.price,
          type: 'bundle' as const,
          number: 1,
        }));
        const itemEntries: SalesPickListItem[] = (items.value?.items ?? []).map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          price: i.price,
          type: 'item' as const,
          itemTypeName: i.itemTypeName,
          number: 1,
        }));
        this.sourceItems = [...bundleEntries, ...itemEntries];
      },
      error: () => {
        this.loadingData.set(false);
        this.toastService.error('Error al cargar los artículos');
      },
    });
  }

  onConsecutiveKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.consecutive) {
      this.loadByConsecutive();
    }
  }

  private loadByConsecutive(): void {
    this.loadingData.set(true);
    this.serviceOrderService.getById({ consecutive: this.consecutive! }).subscribe({
      next: (response) => {
        this.loadingData.set(false);
        if (response.value) {
          const order = response.value;
          this.loadedOrderId = order.id;
          this.selectedPerson = {
            id: order.customerId,
            displayName: `${order.customerNames} ${order.customerSurnames}`,
            identification: '',
          };
          const loadedItems: SalesPickListItem[] = order.items.map((item) => ({
            id: item.itemId,
            name: item.itemName,
            description: '',
            price: item.price,
            type: 'item' as const,
            number: item.number,
          }));
          this.sourceItems = this.sourceItems.filter(
            (si) => !loadedItems.some((li) => li.id === si.id)
          );
          this.targetItems = loadedItems;
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingData.set(false);
        this.toastService.error('Error al buscar la orden de servicio');
      },
    });
  }

  searchPersons(event: AutoCompleteCompleteEvent): void {
    this.personService.getPaged({ page: 1, itemsPerPage: 20, search: event.query }).subscribe({
      next: (response) => {
        this.personSuggestions = (response.value?.items ?? [])
          .filter((p) => p.isClient)
          .map((p) => ({
            id: p.id,
            displayName: `${p.names} ${p.surnames}`,
            identification: p.identification,
          }));
      },
    });
  }

  onMoveToTarget(event: { items: SalesPickListItem[] }): void {
    const bundles = event.items.filter((i) => i.type === 'bundle');
    if (bundles.length === 0) return;

    for (const bundle of bundles) {
      this.targetItems = this.targetItems.filter((i) => i.id !== bundle.id);

      this.bundleItemService.getAll(bundle.id).subscribe((response) => {
        if (response.value) {
          const newItems: SalesPickListItem[] = response.value
            .filter((bi) => !this.targetItems.some((ti) => ti.id === bi.itemId))
            .map((bi) => ({
              id: bi.itemId,
              name: bi.itemName,
              description: bi.itemDescription,
              price: this.sourceItems.find((si) => si.id === bi.itemId)?.price ?? 0,
              type: 'item' as const,
              itemTypeName: bi.itemTypeName,
              number: bi.itemAmount || 1,
            }));
          this.sourceItems = this.sourceItems.filter(
            (si) => !newItems.some((ni) => ni.id === si.id)
          );
          this.targetItems = [...this.targetItems, ...newItems];
        }
      });
    }
  }

  protected isInTarget(id: string): boolean {
    return this.targetItems.some((i) => i.id === id);
  }

  get totalPrice(): number {
    return this.targetItems.reduce((sum, item) => sum + item.price * item.number, 0);
  }

  onSave(): void {
    if (!this.consecutive) {
      this.toastService.error('Debe ingresar el consecutivo');
      return;
    }
    if (!this.selectedPerson) {
      this.toastService.error('Debe seleccionar un cliente');
      return;
    }
    if (this.targetItems.length === 0) {
      this.toastService.error('Debe seleccionar al menos un artículo');
      return;
    }

    this.saving.set(true);
    this.serviceOrderService
      .create({
        customerId: this.selectedPerson.id,
        consecutive: this.consecutive,
        price: this.totalPrice,
        items: this.targetItems.map((item) => ({
          itemId: item.id,
          number: item.number,
          price: item.price,
        })),
      })
      .subscribe({
        next: (response) => {
          this.saving.set(false);
          if (response.value) {
            this.toastService.success('Venta registrada exitosamente');
            this.onClear();
          } else if (response.error) {
            this.toastService.error(response.error.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Error al registrar la venta');
        },
      });
  }

  onUpdate(): void {
    if (!this.loadedOrderId || !this.consecutive) return;

    this.saving.set(true);
    this.serviceOrderService
      .update({
        id: this.loadedOrderId,
        consecutive: this.consecutive,
        price: this.totalPrice,
        items: this.targetItems.map((item) => ({
          itemId: item.id,
          number: item.number,
          price: item.price,
        })),
      })
      .subscribe({
        next: (response) => {
          this.saving.set(false);
          if (response.value) {
            this.toastService.success('Venta actualizada exitosamente');
            this.onClear();
          } else if (response.error) {
            this.toastService.error(response.error.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Error al actualizar la venta');
        },
      });
  }

  onClear(): void {
    this.selectedPerson = null;
    this.consecutive = null;
    this.loadedOrderId = null;
    this.targetItems = [];
    this.loadSourceData();
  }
}
