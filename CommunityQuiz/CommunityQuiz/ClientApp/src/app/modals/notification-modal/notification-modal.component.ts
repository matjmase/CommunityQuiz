import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
})
export class NotificationModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  private modalContent!: TemplateRef<NotificationModalComponent>;
  private modalRef!: NgbModalRef;

  @Input() Communicate!: Subject<string>;
  sub: Subscription | undefined;

  content: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.sub = this.Communicate.subscribe({
      next: (val) => {
        this.content = val;
        this.Open();
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  Open() {
    this.modalRef = this.modalService.open(this.modalContent);
  }

  Close() {
    this.modalRef?.close();
  }

  Accept() {
    this.Close();
  }
}
