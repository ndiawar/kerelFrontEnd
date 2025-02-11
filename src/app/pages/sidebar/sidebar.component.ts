import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/UserServices';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserConnected().then(user => {
      if (user) {
        this.userRole = user.role;
        console.log('User role:', this.userRole);
      }
    }).catch(error => {
      console.error('Erreur lors de la récupération de lutilisateur connecté:', error);
    });
  }
}