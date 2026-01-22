import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [],
  templateUrl: './appointments.page.html',
})
export class AppointmentsPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Citas');
  }
}
