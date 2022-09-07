import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ILoginCredentials } from '../models/ILoginCredentials';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  notification = new Subject<string>();

  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {}

  OnSubmit(input: NgForm) {
    const creds = <ILoginCredentials>input.value;
    this.backend.Auth.Login(creds).subscribe({
      complete: () => this.router.navigate(['']),
      error: (val: HttpErrorResponse) => {
        this.notification.next(val.error);
      },
    });
  }
}
