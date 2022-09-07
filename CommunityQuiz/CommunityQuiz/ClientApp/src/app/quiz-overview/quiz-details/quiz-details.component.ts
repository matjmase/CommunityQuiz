import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IQuestionConnected,
  QuestionConnected,
} from 'src/app/models/Connected/IQuestionConnected';
import { FormModalModel } from 'src/app/models/FormModalModel';
import { IQuestion } from 'src/app/models/Nodes/IQuestion';
import { IQuiz } from 'src/app/models/Nodes/IQuiz';
import { BackendConnectService } from 'src/app/services/backend-connect.service';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss'],
})
export class QuizDetailsComponent implements OnInit, OnDestroy {
  questionsWithQuizCommunication = new FormModalModel<
    IQuestionWithQuiz,
    IQuestionConnected
  >();
  confirmDeleteQuizCommunication = new FormModalModel<string, void>();
  confirmDeleteQuestionCommunication = new FormModalModel<string, void>();
  confirmPublishCommunication = new FormModalModel<string, void>();
  subs: Subscription[] = [];

  quizId: number | undefined;

  quiz: IQuiz | undefined;
  questions: IQuestion[] = [];

  stagedDelete: IQuestion | undefined;

  constructor(
    private backend: BackendConnectService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = +this.activeRoute.snapshot.params['id'];

    this.LoadQuiz();
    this.LoadQuestions();

    this.subs.push(
      this.questionsWithQuizCommunication.OnClose().subscribe({
        next: (val) => {
          val.Question.QuizId = this.quiz!.Id;
          if (val.Question.Id === 0)
            this.backend.QuestionDetails.Post(val).subscribe({
              complete: () => this.LoadQuestions(),
            });
          else
            this.backend.QuestionDetails.Put(val).subscribe({
              complete: () => this.LoadQuestions(),
            });
        },
      })
    );

    this.subs.push(
      this.confirmDeleteQuestionCommunication.OnClose().subscribe({
        next: () => {
          this.backend.Question.Delete(this.stagedDelete!.Id).subscribe({
            complete: () => this.LoadQuestions(),
          });
        },
      })
    );

    this.subs.push(
      this.confirmPublishCommunication.OnClose().subscribe({
        next: () => {
          this.backend.Quiz.PutPublish(this.quiz!.Id).subscribe({
            complete: () => this.LoadQuiz(),
          });
        },
      })
    );

    this.subs.push(
      this.confirmDeleteQuizCommunication.OnClose().subscribe({
        next: () =>
          this.backend.Quiz.Delete(this.quiz!.Id).subscribe({
            complete: () => this.router.navigate(['/quiz', 'overview']),
          }),
      })
    );
  }

  private LoadQuiz() {
    this.backend.Quiz.Get(this.quizId!).subscribe({
      next: (val) => (this.quiz = val),
    });
  }

  private LoadQuestions() {
    this.backend.Question.GetAll(this.quizId!).subscribe({
      next: (val) => {
        this.questions = val;
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  AddNewQuestion() {
    this.questionsWithQuizCommunication.OpenInit({
      Question: new QuestionConnected(),
      Quiz: this.quiz!,
    });
  }

  EditQuestion(val: IQuestion) {
    this.backend.QuestionDetails.Get(val.Id).subscribe({
      next: (val) =>
        this.questionsWithQuizCommunication.OpenInit({
          Question: val,
          Quiz: this.quiz!,
        }),
    });
  }

  DeleteQuestion(val: IQuestion) {
    this.stagedDelete = val;

    this.confirmDeleteQuestionCommunication.OpenInit(
      'Are you sure you want to delete this Question?'
    );
  }

  PublishQuiz() {
    this.confirmPublishCommunication.OpenInit(
      'Are you sure you want to publish the quiz? Changes will not be possible after this point and the users will be able to take it.'
    );
  }

  RemoveQuizInit(event: MouseEvent) {
    event.stopPropagation();

    this.confirmDeleteQuizCommunication.OpenInit(
      `Are you sure you want to delete quiz: '${this.quiz!.QuizName}'?`
    );
  }
}

export interface IQuestionWithQuiz {
  Question: IQuestionConnected;
  Quiz: IQuiz;
}
