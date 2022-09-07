import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGroupConnected } from '../models/Connected/IGroupConnected';
import { FormModalModel } from '../models/FormModalModel';
import { IQuiz } from '../models/Nodes/IQuiz';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-my-quizzes',
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.scss'],
})
export class MyQuizzesComponent implements OnInit, OnDestroy {
  quizConfirmCommunicate = new FormModalModel<string, void>();
  sub: Subscription | undefined;

  groupDetails: IGroupConnected[] = [];

  stagedQuiz: IQuiz | undefined;

  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.quizConfirmCommunicate.OnClose().subscribe({
      next: () =>
        this.router.navigate([
          '/quiz',
          'my',
          'take',
          this.stagedQuiz!.Id.toString(),
        ]),
    });

    this.backend.GroupDetails.GetAll().subscribe({
      next: (val) => (this.groupDetails = val),
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  TakeQuiz(val: IQuiz) {
    this.stagedQuiz = val;

    this.quizConfirmCommunicate.OpenInit(
      `Are you sure you want to take quiz: ${this.stagedQuiz.QuizName}?`
    );
  }
}
