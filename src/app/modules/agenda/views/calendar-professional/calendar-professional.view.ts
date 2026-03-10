import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { ResourceInput } from '@fullcalendar/resource';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PersonService } from '../../../../core/services/person.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Person } from '../../../../core/models/person.model';

@Component({
  selector: 'app-calendar-professional',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, MultiSelectModule, ButtonModule, TooltipModule],
  templateUrl: './calendar-professional.view.html',
})
export class CalendarProfessionalView implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly toastService = inject(ToastService);

  protected allProfessionals: Person[] = [];
  protected selectedProfessionals: Person[] = [];
  protected loading = signal(false);
  protected showCalendar = signal(false);

  private allEvents: EventInput[] = [];

  protected calendarOptions = signal<CalendarOptions>({
    plugins: [resourceTimeGridPlugin, resourceDayGridPlugin, interactionPlugin],
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'resourceTimeGridDay',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'resourceTimeGridDay,resourceTimeGridWeek,resourceDayGridMonth',
    },
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
    resources: [],
    events: [],
    eventClick: (info) => {
      const p = info.event.extendedProps;
      this.toastService.info(
        `Paciente: ${p['patientFullName']} | Sala: ${p['roomName']}${p['notes'] ? ' | ' + p['notes'] : ''}`
      );
    },
  });

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading.set(true);
    this.personService.getPaged({ page: 1, itemsPerPage: 200, isEmployee: true }).subscribe({
      next: (personsResponse) => {
        this.allProfessionals = personsResponse.value?.items ?? [];
        this.loadAppointments();
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar los profesionales');
      },
    });
  }

  private loadAppointments(): void {
    this.loading.set(true);
    this.appointmentService.getFilteredBy({}).subscribe({
      next: (apptResponse) => {
        this.loading.set(false);
        this.allEvents = (apptResponse.value ?? []).map((appt) => ({
          id: appt.id,
          resourceId: appt.professionalId,
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
        if (this.selectedProfessionals.length > 0) this.onSelectionChange();
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar las citas');
      },
    });
  }

  reloadAppointments(): void {
    this.loadAppointments();
  }

  onSelectionChange(): void {
    if (!this.selectedProfessionals || this.selectedProfessionals.length === 0) {
      this.showCalendar.set(false);
      return;
    }

    const selectedIds = new Set(this.selectedProfessionals.map((p) => p.id));

    const resources: ResourceInput[] = this.selectedProfessionals.map((p) => ({
      id: p.id,
      title: `${p.names} ${p.surnames}`,
    }));

    const events = this.allEvents.filter((e) => selectedIds.has(e['resourceId'] as string));

    this.calendarOptions.update((opts) => ({ ...opts, resources, events }));
    this.showCalendar.set(true);
  }

  onClear(): void {
    this.selectedProfessionals = [];
    this.showCalendar.set(false);
  }
}
