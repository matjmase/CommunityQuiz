import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BackendConnectService } from '../services/backend-connect.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private backend: BackendConnectService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const acceptedRoles = route.data.roles as Array<string>;

    const currentRoles = this.backend.Auth.GetSavedResponse()?.Roles;

    if (currentRoles) {
      return acceptedRoles.some((e) => currentRoles.some((f) => f === e));
    } else {
      return false;
    }
  }
}
