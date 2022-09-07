import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IQuizConnected,
  QuizConnected,
} from 'src/app/models/Connected/IQuizConnected';
import { IQuizResults, QuizResults } from 'src/app/models/IQuizResults';
import { BackendConnectService } from 'src/app/services/backend-connect.service';

@Component({
  selector: 'app-my-quiz-results',
  templateUrl: './my-quiz-results.component.html',
  styleUrls: ['./my-quiz-results.component.scss'],
})
export class MyQuizResultsComponent implements OnInit {
  quizId: number | undefined;

  results: IQuizConnected = new QuizConnected();

  constructor(
    private backend: BackendConnectService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.quizId = +this.activeRoute.snapshot.params['id'];

    this.backend.QuizResults.GetMyQuizResults(this.quizId).subscribe({
      next: (val) => {
        this.results = val;
      },
    });
  }
}
