import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.page.html',
})
export class UsersPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Usuarios');
  }
}
