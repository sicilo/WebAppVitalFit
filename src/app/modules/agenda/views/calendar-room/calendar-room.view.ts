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
import { RoomService } from '../../../../core/services/room.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Room } from '../../../../core/models/room.model';

interface RoomOption {
  id: string;
  name: string;
  roomTypeName: string;
}

@Component({
  selector: 'app-calendar-room',
  standalone: true,
  imports: [FormsModule, FullCalendarModule, AutoCompleteModule, ButtonModule],
  templateUrl: './calendar-room.view.html',
})
export class CalendarRoomView implements OnInit {
  private readonly roomService = inject(RoomService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly toastService = inject(ToastService);

  protected selectedRoom: RoomOption | null = null;
  protected roomSuggestions: RoomOption[] = [];
  protected loading = signal(false);

  private allRooms: Room[] = [];
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
        this.toastService.error('Error al cargar las salas');
      },
    });
  }

  searchRooms(event: AutoCompleteCompleteEvent): void {
    this.roomService.getPaged({ page: 1, itemsPerPage: 20, search: event.query }).subscribe({
      next: (response) => {
        this.roomSuggestions = (response.value?.items ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          roomTypeName: r.roomTypeName,
        }));
      },
    });
  }

  onRoomSelect(): void {
    this.applyFilter(this.selectedRoom);
  }

  onClearFilter(): void {
    this.selectedRoom = null;
    this.applyFilter(null);
  }

  private applyFilter(room: RoomOption | null): void {
    const rooms = room
      ? this.allRooms.filter((r) => r.id === room.id)
      : this.allRooms;

    const resources: ResourceInput[] = rooms.map((r) => ({
      id: r.id,
      title: r.name,
    }));

    const events = room
      ? this.allEvents.filter((e) => e['resourceId'] === room.id)
      : this.allEvents;

    this.calendarOptions.update((opts) => ({ ...opts, resources, events }));
  }
}
