import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BackendConnectService } from '../services/backend-connect.service';

@Directive({
  selector: '[appAuthenticate]',
})
export class AuthenticateDirective implements OnInit, OnDestroy {
  @Input() appAuthenticate = true;

  sub: Subscription | undefined;

  constructor(
    private backend: BackendConnectService,
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef
  ) {}
  ngOnInit(): void {
    this.SetView();
    this.sub = this.backend.Auth.RolesHaveChanged.subscribe({
      next: () => this.SetView(),
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private SetView() {
    if (
      (this.backend.Auth.GetSavedResponse() != undefined &&
        this.appAuthenticate) ||
      (this.backend.Auth.GetSavedResponse() == undefined &&
        !this.appAuthenticate)
    ) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else {
      this.vcr.clear();
    }
  }
}
