import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports: [CommonModule,FormsModule],
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  users = [
    { name: 'Olivia Rhye', cardId: '---', email: 'olivia@untitled.com', assignation: 'assigner une carte', selected: false },
    { name: 'Phoenix Baker', cardId: '045678', email: 'phoenix@untitled.com', assignation: 'désassigner la carte', selected: false },
    { name: 'Lana Steiner', cardId: '069437', email: 'lana@untitled.com', assignation: 'assigner une carte', selected: false },
  ];
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.users.forEach(user => user.selected = checked);
  }
  
}
