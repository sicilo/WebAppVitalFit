import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [],
  templateUrl: './people.page.html',
})
export class PeoplePage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Personas');
  }
}
