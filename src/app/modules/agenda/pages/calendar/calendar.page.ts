import { Component, inject, OnInit, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TitleService } from '../../../../core/services/title.service';
import { CalendarPersonalView } from '../../views/calendar-personal/calendar-personal.view';
import { CalendarProfessionalView } from '../../views/calendar-professional/calendar-professional.view';
import { CalendarRoomView } from '../../views/calendar-room/calendar-room.view';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [TabsModule, CalendarPersonalView, CalendarProfessionalView, CalendarRoomView],
  templateUrl: './calendar.page.html',
})
export class CalendarPage implements OnInit {
  private readonly titleService = inject(TitleService);

  protected readonly activeTab = signal<string>('personal');

  ngOnInit(): void {
    this.titleService.setTitle('Calendario');
  }

  onTabChange(value: string | number | undefined): void {
    this.activeTab.set(value?.toString() ?? 'personal');
  }
}
