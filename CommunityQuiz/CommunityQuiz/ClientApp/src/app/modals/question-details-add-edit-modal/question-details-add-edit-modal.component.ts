import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AnswerConnected } from 'src/app/models/Connected/IAnswerConnected';
import {
  IQuestionConnected,
  QuestionConnected,
} from 'src/app/models/Connected/IQuestionConnected';
import { FormModalModel } from 'src/app/models/FormModalModel';
import { IAnswer, Answer } from 'src/app/models/Nodes/IAnswer';
import { IQuiz, Quiz } from 'src/app/models/Nodes/IQuiz';
import { IQuestionWithQuiz } from 'src/app/quiz-overview/quiz-details/quiz-details.component';
import { QuestionConnect } from 'src/app/services/controllers/QuestionConnect';

@Component({
  selector: 'app-question-details-add-edit-modal',
  templateUrl: './question-details-add-edit-modal.component.html',
  styleUrls: ['./question-details-add-edit-modal.component.scss'],
})
export class QuestionDetailsAddEditModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  private modalContent!: TemplateRef<QuestionDetailsAddEditModalComponent>;
  private modalRef!: NgbModalRef;

  @Input() Communicate!: FormModalModel<IQuestionWithQuiz, IQuestionConnected>;
  sub: Subscription | undefined;

  form: FormGroup;
  formAnswers = new FormArray<FormGroup>([]);
  item: IQuestionConnected = new QuestionConnected();
  quiz: IQuiz = new Quiz();

  constructor(private modalService: NgbModal) {
    this.form = new FormGroup(this.CreateForm(new QuestionConnected()));
  }
  ngOnInit(): void {
    this.sub = this.Communicate.OnOpen().subscribe({
      next: (val) => {
        this.item = val.Question;
        this.quiz = val.Quiz;
        this.form = new FormGroup(this.CreateForm(val.Question));
        if (val.Quiz.Published) this.form.disable();
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

  private RecursiveCopy(val: any) {
    const inner: any = {};

    const keys = Object.keys(val) as (keyof any)[];
    keys.forEach((key) => {
      if (!Array.isArray(val[key]) && typeof val[key] !== 'object') {
        inner[key] = new FormControl(val[key]);
      } else if (!Array.isArray(val[key]) && typeof val[key] === 'object') {
        inner[key] = new FormGroup(this.RecursiveCopy(val[key]));
      }
    });

    return inner;
  }

  private CreateForm(input: IQuestionConnected): any {
    const inner = this.RecursiveCopy(input);

    this.formAnswers = new FormArray<FormGroup>(
      input.Answers.map((e) => new FormGroup(this.RecursiveCopy(e)))
    );

    inner['Answers'] = this.formAnswers;

    return inner;
  }

  Accept(form: FormGroup) {
    this.Communicate.CloseInit(form.value);
    this.Close();
  }

  AddAnswer() {
    const toAdd = new AnswerConnected();
    toAdd.Answer.QuestionId = this.item.Question.Id;

    this.formAnswers.push(new FormGroup(this.RecursiveCopy(toAdd)));
  }

  RemoveAnswer(index: number) {
    this.formAnswers.removeAt(index);
  }

  ModelError(): string | undefined {
    const model = <IQuestionConnected>this.form.value;
    if (!model.Question.MultiAnswer) {
      let count = 0;
      model.Answers.forEach((answer) => {
        if (answer.Answer.Correct) count++;
      });

      if (count > 1)
        return 'Multiple correct answers for a non Multi answer question.';
      else if (count === 0) return 'No Answer has been selected.';
    } else {
      let count = 0;
      model.Answers.forEach((answer) => {
        if (answer.Answer.Correct) count++;
      });

      if (count === 0) return 'No Answer has been selected.';
    }

    return undefined;
  }
}
