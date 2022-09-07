import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormModalModel } from 'src/app/models/FormModalModel';

@Component({
  selector: 'app-comfirmation-modal',
  templateUrl: './comfirmation-modal.component.html',
  styleUrls: ['./comfirmation-modal.component.scss'],
})
export class ComfirmationModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  private modalContent!: TemplateRef<ComfirmationModalComponent>;
  private modalRef!: NgbModalRef;

  @Input() Communicate!: FormModalModel<string, void>;
  sub: Subscription | undefined;

  content: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.sub = this.Communicate.OnOpen().subscribe({
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
    this.Communicate.CloseInit();
    this.Close();
  }
}
