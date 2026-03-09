import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { PersonService } from '../../../../core/services/person.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';

interface PersonOption {
  id: string;
  displayName: string;
  identification: string;
}

@Component({
  selector: 'app-calendar-personal',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, AutoCompleteModule],
  templateUrl: './calendar-personal.view.html',
})
export class CalendarPersonalView implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly toastService = inject(ToastService);

  protected selectedProfessional: PersonOption | null = null;
  protected professionalSuggestions: PersonOption[] = [];

  protected selectedClient: PersonOption | null = null;
  protected clientSuggestions: PersonOption[] = [];

  protected loading = signal(false);

  protected calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
    events: [],
    eventClick: (info) => {
      const p = info.event.extendedProps;
      this.toastService.info(
        `Paciente: ${p['patientFullName']} | Sala: ${p['roomName']}${p['notes'] ? ' | ' + p['notes'] : ''}`
      );
    },
  });

  ngOnInit(): void {}

  searchProfessionals(event: AutoCompleteCompleteEvent): void {
    this.personService
      .getPaged({ page: 1, itemsPerPage: 20, search: event.query, isEmployee: true })
      .subscribe({
        next: (response) => {
          this.professionalSuggestions = (response.value?.items ?? []).map((p) => ({
            id: p.id,
            displayName: `${p.names} ${p.surnames}`,
            identification: p.identification,
          }));
        },
      });
  }

  searchClients(event: AutoCompleteCompleteEvent): void {
    this.personService
      .getPaged({ page: 1, itemsPerPage: 20, search: event.query, isClient: true })
      .subscribe({
        next: (response) => {
          this.clientSuggestions = (response.value?.items ?? []).map((p) => ({
            id: p.id,
            displayName: `${p.names} ${p.surnames}`,
            identification: p.identification,
          }));
        },
      });
  }

  onProfessionalSelect(): void {
    this.loadAppointments();
  }

  onProfessionalClear(): void {
    this.selectedProfessional = null;
    this.loadAppointments();
  }

  onClientSelect(): void {
    this.loadAppointments();
  }

  onClientClear(): void {
    this.selectedClient = null;
    this.loadAppointments();
  }

  private loadAppointments(): void {
    if (!this.selectedProfessional && !this.selectedClient) {
      this.updateEvents([]);
      return;
    }
    this.loading.set(true);
    this.appointmentService
      .getFilteredBy({
        professionalIdentification: this.selectedProfessional?.identification,
        patientIdentification: this.selectedClient?.identification,
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          const events: EventInput[] = (response.value ?? []).map((appt) => ({
            id: appt.id,
            title: appt.patientFullName,
            start: appt.startDate,
            end: appt.endDate,
            extendedProps: {
              patientFullName: appt.patientFullName,
              roomName: appt.roomName,
              companionFullName: appt.companionFullName,
              notes: appt.notes,
            },
          }));
          this.updateEvents(events);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Error al cargar las citas');
        },
      });
  }

  private updateEvents(events: EventInput[]): void {
    this.calendarOptions.update((opts) => ({ ...opts, events }));
  }
}
