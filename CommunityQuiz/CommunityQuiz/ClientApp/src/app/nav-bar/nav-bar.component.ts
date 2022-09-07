import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {}

  logoutClicked() {
    this.backend.Auth.Logout();
    this.router.navigate(['']);
  }
}
