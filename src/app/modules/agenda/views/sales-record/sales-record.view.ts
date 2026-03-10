import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { ServiceOrderService } from '../../../../core/services/service-order.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { RoomService } from '../../../../core/services/room.service';
import { PersonService } from '../../../../core/services/person.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ServiceOrder } from '../../../../core/models/service-order.model';
import { Room } from '../../../../core/models/room.model';
import { Person } from '../../../../core/models/person.model';

type PersonOption = Person & { fullName: string };

@Component({
  selector: 'app-sales-record',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CurrencyPipe, DatePipe,
    TableModule, PanelModule, ButtonModule, InputTextModule,
    IconFieldModule, InputIconModule, TagModule,
    DialogModule, DatePickerModule, TextareaModule,
    AutoCompleteModule, SelectModule,
  ],
  templateUrl: './sales-record.view.html',
})
export class SalesRecordView implements OnInit {
  private readonly serviceOrderService = inject(ServiceOrderService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly roomService = inject(RoomService);
  private readonly personService = inject(PersonService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly orders = signal<ServiceOrder[]>([]);
  protected readonly loading = signal(false);
  protected readonly totalRecords = signal(0);
  protected readonly rows = signal(10);
  protected readonly first = signal(0);
  protected readonly search = signal('');

  protected readonly dialogVisible = signal(false);
  protected readonly savingAppointment = signal(false);
  protected readonly loadingDialogData = signal(false);
  protected readonly selectedOrder = signal<ServiceOrder | null>(null);
  protected readonly rooms = signal<Room[]>([]);
  protected readonly patientSuggestions = signal<PersonOption[]>([]);
  protected readonly professionalSuggestions = signal<PersonOption[]>([]);
  protected readonly companionSuggestions = signal<PersonOption[]>([]);
  protected selectedPatient: PersonOption | null = null;
  protected selectedProfessional: PersonOption | null = null;
  protected selectedCompanion: PersonOption | null = null;

  protected readonly appointmentForm = this.fb.group({
    roomId: ['', Validators.required],
    professionalId: ['', Validators.required],
    companionId: [''],
    patientId: ['', Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadOrders(1, this.rows());
  }

  protected onStartDateSelect(date: Date): void {
    const order = this.selectedOrder();
    if (!order?.orderServiceDuration || !date) return;
    const endDate = this.calculateEndDate(date, order.orderServiceDuration);
    if (endDate) this.appointmentForm.patchValue({ endDate }, { emitEvent: false });
  }

  private calculateEndDate(start: Date, duration: string): Date | null {
    const d = duration.toLowerCase().trim();
    const end = new Date(start);

    // Format: HH:mm:ss or HH:mm
    const timeFormat = d.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (timeFormat) {
      end.setHours(end.getHours() + parseInt(timeFormat[1]));
      end.setMinutes(end.getMinutes() + parseInt(timeFormat[2]));
      return end;
    }

    // Format: plain number (treat as minutes)
    const plainNumber = d.match(/^(\d+)$/);
    if (plainNumber) {
      end.setMinutes(end.getMinutes() + parseInt(plainNumber[1]));
      return end;
    }

    const hours = d.match(/(\d+)\s*h(ora)?s?/);
    const minutes = d.match(/(\d+)\s*min(uto)?s?/);
    if (hours) end.setHours(end.getHours() + parseInt(hours[1]));
    if (minutes) end.setMinutes(end.getMinutes() + parseInt(minutes[1]));
    if (hours || minutes) return end;

    return null;
  }

  private toPersonOption(p: Person): PersonOption {
    return { ...p, fullName: `${p.names} ${p.surnames}` };
  }

  protected openAppointmentDialog(order: ServiceOrder): void {
    this.selectedOrder.set(order);
    this.appointmentForm.reset();
    this.selectedProfessional = null;
    this.selectedCompanion = null;
    this.selectedPatient = { id: order.customerId, fullName: order.customerFullName, identification: order.customerIdentification } as PersonOption;
    this.selectedCompanion = { id: order.customerId, fullName: order.customerFullName, identification: order.customerIdentification } as PersonOption;
    this.appointmentForm.patchValue({
      patientId: order.customerId,
      companionId: order.customerId,
    });
    this.dialogVisible.set(true);
    this.roomService.getPaged({ page: 1, itemsPerPage: 200 }).subscribe({
      next: (response) => {
        this.loadingDialogData.set(false);
        if (response.value) this.rooms.set(response.value.items);
      },
      error: () => {
        this.loadingDialogData.set(false);
        this.toastService.error('Error al cargar las cabinas');
      },
    });
  }

  protected searchPatients(event: AutoCompleteCompleteEvent): void {
    this.personService.getPaged({ page: 1, itemsPerPage: 10, search: event.query, isClient: true }).subscribe({
      next: (response) => {
        if (response.value) this.patientSuggestions.set(response.value.items.map(p => this.toPersonOption(p)));
      },
    });
  }

  protected onPatientSelect(person: PersonOption): void {
    this.appointmentForm.patchValue({ patientId: person.id });
  }

  protected onPatientClear(): void {
    this.appointmentForm.patchValue({ patientId: '' });
    this.selectedPatient = null;
  }

  protected searchProfessionals(event: AutoCompleteCompleteEvent): void {
    this.personService.getPaged({ page: 1, itemsPerPage: 10, search: event.query, isEmployee: true }).subscribe({
      next: (response) => {
        if (response.value) this.professionalSuggestions.set(response.value.items.map(p => this.toPersonOption(p)));
      },
    });
  }

  protected onProfessionalSelect(person: PersonOption): void {
    this.appointmentForm.patchValue({ professionalId: person.id });
  }

  protected onProfessionalClear(): void {
    this.appointmentForm.patchValue({ professionalId: '' });
    this.selectedProfessional = null;
  }

  protected searchCompanions(event: AutoCompleteCompleteEvent): void {
    this.personService.getPaged({ page: 1, itemsPerPage: 10, search: event.query }).subscribe({
      next: (response) => {
        if (response.value) this.companionSuggestions.set(response.value.items.map(p => this.toPersonOption(p)));
      },
    });
  }

  protected onCompanionSelect(person: PersonOption): void {
    this.appointmentForm.patchValue({ companionId: person.id });
  }

  protected onCompanionClear(): void {
    this.appointmentForm.patchValue({ companionId: '' });
    this.selectedCompanion = null;
  }

  protected onSaveAppointment(): void {
    if (this.appointmentForm.invalid) return;
    const order = this.selectedOrder();
    if (!order) return;

    const { roomId, professionalId, companionId, patientId, startDate, endDate, notes } = this.appointmentForm.value;

    this.savingAppointment.set(true);
    this.appointmentService.create({
      roomId: roomId!,
      professionalId: professionalId!,
      companionId: companionId ?? '',
      patientId: patientId!,
      appointmentHeaderId: order.appointmentsHeaderId,
      startDate: (startDate as Date).toISOString(),
      endDate: (endDate as Date).toISOString(),
      notes: notes ?? '',
    }).subscribe({
      next: (response) => {
        this.savingAppointment.set(false);
        if (response.error) {
          this.toastService.error(response.error.message);
        } else {
          this.toastService.success('Cita creada correctamente');
          this.dialogVisible.set(false);
        }
        response.advisories?.forEach((msg) => this.toastService.warn(msg, 'Advertencia'));
      },
      error: () => {
        this.savingAppointment.set(false);
        this.toastService.error('Error al crear la cita');
      },
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = Math.floor(first / rows) + 1;
    this.first.set(first);
    this.rows.set(rows);
    this.loadOrders(page, rows, this.search() || undefined);
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.first.set(0);
    this.loadOrders(1, this.rows(), value || undefined);
  }

  isOrderActive(order: ServiceOrder): boolean {
    const creation = new Date(order.orderCreationDate);
    const validity = order.orderServiceValidity.toLowerCase().trim();
    const expiry = new Date(creation);

    const days = validity.match(/(\d+)\s*d[íi]as?/);
    const months = validity.match(/(\d+)\s*mes(es)?/);
    const years = validity.match(/(\d+)\s*a[ñn]os?/);

    if (days) expiry.setDate(expiry.getDate() + parseInt(days[1]));
    else if (months) expiry.setMonth(expiry.getMonth() + parseInt(months[1]));
    else if (years) expiry.setFullYear(expiry.getFullYear() + parseInt(years[1]));
    else return true;

    return expiry >= new Date();
  }

  loadOrders(page: number = 1, itemsPerPage: number = 10, search?: string): void {
    this.loading.set(true);
    this.serviceOrderService.getPaged({ page, itemsPerPage, search }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.orders.set(response.value.items);
          this.totalRecords.set(response.value.totalCount);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar el registro de ventas');
      },
    });
  }
}
