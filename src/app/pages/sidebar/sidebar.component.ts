import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/UserServices';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {

    // Get the user from the local storage
    //const user = this.userService.getUser();
    // if (user) {
    //   this.userRole = user.role;
    // }
    //console.log('User récupéré:', user);
  }
}