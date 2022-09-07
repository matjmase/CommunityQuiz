import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormModalModel } from 'src/app/models/FormModalModel';
import { IQuiz, Quiz } from 'src/app/models/Nodes/IQuiz';

@Component({
  selector: 'app-quiz-add-edit-modal',
  templateUrl: './quiz-add-edit-modal.component.html',
  styleUrls: ['./quiz-add-edit-modal.component.scss'],
})
export class QuizAddEditModalComponent implements OnInit {
  @ViewChild('modal')
  private modalContent!: TemplateRef<QuizAddEditModalComponent>;
  private modalRef!: NgbModalRef;

  @Input() Communicate!: FormModalModel<IQuiz, IQuiz>;
  sub: Subscription | undefined;

  form: FormGroup;
  item: IQuiz = new Quiz();

  constructor(private modalService: NgbModal) {
    this.form = new FormGroup(this.CreateForm(new Quiz()));
  }

  ngOnInit(): void {
    this.sub = this.Communicate.OnOpen().subscribe({
      next: (val) => {
        this.item = val;
        this.form = new FormGroup(this.CreateForm(val));
        if (val.Published) this.form.disable();
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

  private CreateForm(input: IQuiz): any {
    const inner: any = {};

    const keys = Object.keys(input) as (keyof IQuiz)[];
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
