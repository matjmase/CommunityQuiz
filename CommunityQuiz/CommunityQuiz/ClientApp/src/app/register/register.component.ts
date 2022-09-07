import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RegisterCredentials } from '../models/IRegisterCredentials';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  notification = new Subject<string>();

  roles: string[] = [];

  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {
    this.backend.Auth.GetAllRoles().subscribe({
      next: (val) => (this.roles = val),
    });
  }

  OnSubmit(form: NgForm) {
    const output = new RegisterCredentials(form.value);

    this.backend.Auth.Register(output).subscribe({
      complete: () => this.router.navigate(['']),
      error: (val: HttpErrorResponse) => this.notification.next(val.error),
    });
  }
}
