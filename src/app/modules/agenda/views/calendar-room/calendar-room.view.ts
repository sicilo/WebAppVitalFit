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
import { RoomService } from '../../../../core/services/room.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Room } from '../../../../core/models/room.model';

@Component({
  selector: 'app-calendar-room',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, MultiSelectModule, ButtonModule, TooltipModule],
  templateUrl: './calendar-room.view.html',
})
export class CalendarRoomView implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly toastService = inject(ToastService);

  protected allRooms: Room[] = [];
  protected selectedRooms: Room[] = [];
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
        `Profesional: ${p['professionalFullName']} | Paciente: ${p['patientFullName']}${p['notes'] ? ' | ' + p['notes'] : ''}`
      );
    },
  });

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading.set(true);
    this.roomService.getPaged({ page: 1, itemsPerPage: 200 }).subscribe({
      next: (roomsResponse) => {
        this.allRooms = roomsResponse.value?.items ?? [];
        this.loadAppointments();
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar las salas');
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
          resourceId: appt.roomId,
          title: `${appt.professionalFullName} — ${appt.patientFullName}`,
          start: appt.startDate,
          end: appt.endDate,
          extendedProps: {
            professionalFullName: appt.professionalFullName,
            patientFullName: appt.patientFullName,
            companionFullName: appt.companionFullName,
            notes: appt.notes,
          },
        }));
        if (this.selectedRooms.length > 0) this.onRoomSelectionChange();
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

  onRoomClear(): void {
    this.selectedRooms = [];
    this.showCalendar.set(false);
  }

  onRoomSelectionChange(): void {
    if (!this.selectedRooms || this.selectedRooms.length === 0) {
      this.showCalendar.set(false);
      return;
    }

    const selectedIds = new Set(this.selectedRooms.map((r) => r.id));

    const resources: ResourceInput[] = this.selectedRooms.map((r) => ({
      id: r.id,
      title: r.name,
    }));

    const events = this.allEvents.filter((e) => selectedIds.has(e['resourceId'] as string));

    this.calendarOptions.update((opts) => ({ ...opts, resources, events }));
    this.showCalendar.set(true);
  }
}
