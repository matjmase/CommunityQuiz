import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAnswerEvent } from 'src/app/models/Nodes/IAnswerEvent';
import { IQuizResults } from 'src/app/models/IQuizResults';
import { BackendConnectService } from 'src/app/services/backend-connect.service';
import { IAnswer } from 'src/app/models/Nodes/IAnswer';
import {
  IQuizConnected,
  QuizConnected,
} from 'src/app/models/Connected/IQuizConnected';
import { IQuestionConnected } from 'src/app/models/Connected/IQuestionConnected';
import { IAnswerConnected } from 'src/app/models/Connected/IAnswerConnected';
import { IAnswerEventConnected } from 'src/app/models/Connected/IAnswerEventConnected';
import { FormModalModel } from 'src/app/models/FormModalModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-take-my-quiz',
  templateUrl: './take-my-quiz.component.html',
  styleUrls: ['./take-my-quiz.component.scss'],
})
export class TakeMyQuizComponent implements OnInit {
  quizSubmitConfirmation = new FormModalModel<string, void>();
  sub: Subscription | undefined;

  quizId: number | undefined;

  takeQuiz: IQuizConnected | undefined;

  form: FormGroup;
  questions = new FormArray<FormGroup>([]);
  answers: FormArray<FormGroup>[] = [];

  constructor(
    private backend: BackendConnectService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = new FormGroup(this.GenerateForm(new QuizConnected()));
  }

  ngOnInit(): void {
    this.quizId = +this.activeRoute.snapshot.params['id'];

    this.backend.QuizTake.Get(this.quizId).subscribe({
      next: (val) => {
        this.takeQuiz = val;
        this.form = new FormGroup(this.GenerateForm(val));
      },
    });

    this.sub = this.quizSubmitConfirmation.OnClose().subscribe({
      next: () => this.Accept(),
    });
  }

  private ShallowCopy(val: any) {
    const inner: any = {};

    const keys = Object.keys(val) as (keyof any)[];
    keys.forEach((key) => {
      inner[key] = new FormControl(val[key]);
    });

    return inner;
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

  private GenerateForm(val: IQuizConnected) {
    const inner: any = this.RecursiveCopy(val);

    const questions: FormGroup[] = [];
    (<IQuestionConnected[]>val['Questions']).forEach((question) => {
      questions.push(new FormGroup(this.GenerateQuestion(question)));
    });

    this.questions = new FormArray(questions);
    inner['Questions'] = this.questions;

    return inner;
  }

  private GenerateQuestion(val: IQuestionConnected): any {
    const inner: any = this.RecursiveCopy(val);

    const currentAnswers: FormGroup[] = [];

    (<IAnswerConnected[]>val['Answers']).forEach((answer) => {
      currentAnswers.push(new FormGroup(this.GenereateAnswer(answer)));
    });

    this.answers.push(new FormArray(currentAnswers));
    inner['Answers'] = new FormArray(currentAnswers);

    inner['Selection'] = new FormControl(undefined);

    return inner;
  }

  private GenereateAnswer(val: IAnswerConnected): any {
    const inner: any = this.RecursiveCopy(val);

    inner['Selection'] = new FormControl(false);

    return inner;
  }

  GetAnswer(i: number, j: number, prop: any): FormControl {
    return <FormControl>(
      (<FormGroup>this.answers[i].controls[j].controls['Answer']).controls[prop]
    );
  }

  GetAnswerConnected(i: number, j: number, prop: any): FormControl {
    return <FormControl>(<FormGroup>this.answers[i].controls[j]).controls[prop];
  }

  GetQuestion(i: number, prop: any): FormControl {
    return <FormControl>(
      (<FormGroup>this.questions.controls[i].controls['Question']).controls[
        prop
      ]
    );
  }

  GetQuestionConnected(i: number, prop: any): FormControl {
    return <FormControl>(<FormGroup>this.questions.controls[i]).controls[prop];
  }

  AllQuestionsAnswers() {
    let allAnswered = true;

    this.questions.controls.forEach((question) => {
      let hasAnswer = false;

      (<any[]>question.value['Answers']).forEach((answer) => {
        hasAnswer = hasAnswer || answer['Selection'];
      });

      allAnswered =
        allAnswered &&
        ((question.value['Question']['MultiAnswer'] && hasAnswer) ||
          (!question.value['Question']['MultiAnswer'] &&
            question.value['Selection']));
    });

    return allAnswered;
  }

  BlurFocusOnElement() {
    if (document.activeElement) {
      (<HTMLElement>document.activeElement).blur();
    }
  }

  AcceptConfirm() {
    this.quizSubmitConfirmation.OpenInit(
      'Are you sure you want to submit your Quizz?'
    );
  }

  Accept() {
    const quiz = <IQuizConnected>this.form.value;
    const answerEvents: IAnswerEventConnected[] = [];

    quiz.Questions.forEach((question) => {
      if (question.Question.MultiAnswer) {
        question.Answers.forEach((answer) => {
          answerEvents.push({
            AnswerEvent: {
              AnswerId: answer.Answer.Id,
              Selection: (<any>answer)['Selection'],
              Id: 0,
              UserQuizEventId: 0,
            },
          });
        });
      } else {
        question.Answers.forEach((answer) => {
          answerEvents.push({
            AnswerEvent: {
              AnswerId: answer.Answer.Id,
              Selection: (<any>question)['Selection'] === answer.Answer.Id,
              Id: 0,
              UserQuizEventId: 0,
            },
          });
        });
      }
    });

    this.backend.QuizTake.Post({
      AnswersEvents: answerEvents,
      QuizzEvent: {
        Id: 0,
        Date: new Date(),
        QuizId: quiz.Quiz.Id,
        UserId: this.backend.Auth.GetSavedResponse()!.Id,
      },
    }).subscribe({
      next: (val) =>
        this.router.navigate(['/results', 'overview', 'quiz', val]),
    });
  }
}
