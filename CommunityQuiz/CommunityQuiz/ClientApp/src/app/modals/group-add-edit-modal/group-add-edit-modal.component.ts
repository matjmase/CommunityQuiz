import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormModalModel } from 'src/app/models/FormModalModel';
import { IGroup, Group } from 'src/app/models/Nodes/IGroup';

@Component({
  selector: 'app-group-add-edit-modal',
  templateUrl: './group-add-edit-modal.component.html',
  styleUrls: ['./group-add-edit-modal.component.scss'],
})
export class GroupAddEditModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  private modalContent!: TemplateRef<GroupAddEditModalComponent>;
  private modalRef!: NgbModalRef;

  @Input() Communicate!: FormModalModel<IGroup, IGroup>;
  sub: Subscription | undefined;

  form: FormGroup;
  item: IGroup = new Group();

  constructor(private modalService: NgbModal) {
    this.form = new FormGroup(this.CreateForm(new Group()));
  }

  ngOnInit(): void {
    this.sub = this.Communicate.OnOpen().subscribe({
      next: (val) => {
        this.item = val;
        this.form = new FormGroup(this.CreateForm(val));
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

  private CreateForm(input: IGroup): any {
    const inner: any = {};

    const keys = Object.keys(input) as (keyof IGroup)[];
    keys.forEach((key) => {
      inner[key] = new FormControl(input[key]);
    });

    return inner;
  }

  Accept(form: FormGroup) {
    this.Communicate.CloseInit(form.value);
    this.Close();
  }
}
