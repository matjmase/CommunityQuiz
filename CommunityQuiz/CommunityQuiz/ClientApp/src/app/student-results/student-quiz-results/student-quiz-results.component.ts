import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IQuizConnected,
  QuizConnected,
} from 'src/app/models/Connected/IQuizConnected';
import { IUser, User } from 'src/app/models/Nodes/IUser';
import { BackendConnectService } from 'src/app/services/backend-connect.service';

@Component({
  selector: 'app-student-quiz-results',
  templateUrl: './student-quiz-results.component.html',
  styleUrls: ['./student-quiz-results.component.scss'],
})
export class StudentQuizResultsComponent implements OnInit {
  quizId: number | undefined;
  userId: number | undefined;

  user: IUser = new User();
  results: IQuizConnected = new QuizConnected();

  selectedId: number[] = [];

  constructor(
    private backend: BackendConnectService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.quizId = +this.activeRoute.snapshot.params['quizId'];
    this.userId = +this.activeRoute.snapshot.params['userId'];

    this.backend.User.GetUser(this.userId).subscribe({
      next: (val) => (this.user = val),
    });

    this.backend.QuizResults.GetMyStudentsQuizResults(
      this.userId,
      this.quizId
    ).subscribe({
      next: (val) => {
        this.results = val;
      },
    });
  }
}
