import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GroupsService } from '../../../Services/groups.service';
import { Group } from '../../../models';

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './groups-page.component.html',
  styleUrl: './groups-page.component.scss'
})
export class GroupsPageComponent implements OnInit {
  private readonly groups = inject(GroupsService);

  myGroups = signal<Group[]>([]);
  suggested = signal<Group[]>([]);

  ngOnInit(): void {
    this.groups.getMyGroups().subscribe({ next: g => this.myGroups.set(Array.isArray(g) ? g : []) });
    this.groups.getSuggested().subscribe({ next: g => this.suggested.set(Array.isArray(g) ? g : []) });
  }

  join(id: number): void {
    this.groups.join(id).subscribe({ next: () => this.ngOnInit() });
  }
}
