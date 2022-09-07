import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConnectService } from '../services/backend-connect.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private backend: BackendConnectService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const idToken = this.backend.Auth.GetSavedResponse()?.Token;

    if (idToken) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + idToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
