import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { ResourceInput } from '@fullcalendar/resource';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { PersonService } from '../../../../core/services/person.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Person } from '../../../../core/models/person.model';

interface ProfessionalOption {
  id: string;
  displayName: string;
  identification: string;
}

@Component({
  selector: 'app-calendar-professional',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, AutoCompleteModule, ButtonModule],
  templateUrl: './calendar-professional.view.html',
})
export class CalendarProfessionalView implements OnInit {
  private readonly personService = inject(PersonService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly toastService = inject(ToastService);

  protected selectedProfessional: ProfessionalOption | null = null;
  protected professionalSuggestions: ProfessionalOption[] = [];
  protected loading = signal(false);

  private allProfessionals: Person[] = [];
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
            this.applyFilter(null);
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al cargar las citas');
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar los profesionales');
      },
    });
  }

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

  onProfessionalSelect(): void {
    this.applyFilter(this.selectedProfessional);
  }

  onClearFilter(): void {
    this.selectedProfessional = null;
    this.applyFilter(null);
  }

  private applyFilter(professional: ProfessionalOption | null): void {
    const professionals = professional
      ? this.allProfessionals.filter((p) => p.id === professional.id)
      : this.allProfessionals;

    const resources: ResourceInput[] = professionals.map((p) => ({
      id: p.id,
      title: `${p.names} ${p.surnames}`,
    }));

    const events = professional
      ? this.allEvents.filter((e) => e['resourceId'] === professional.id)
      : this.allEvents;

    this.calendarOptions.update((opts) => ({ ...opts, resources, events }));
  }
}
