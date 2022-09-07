import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuizConnected } from '../models/Connected/IQuizConnected';
import { IUserQuizEvent } from '../models/Nodes/IUserQuizEvent';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-my-results',
  templateUrl: './my-results.component.html',
  styleUrls: ['./my-results.component.scss'],
})
export class MyResultsComponent implements OnInit {
  results: IQuizConnected[] = [];

  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {
    this.backend.QuizResultsOverview.GetMyResults().subscribe({
      next: (val) => (this.results = val),
    });
  }

  ReviewResults(val: IUserQuizEvent) {
    this.router.navigate(['/results', 'overview', 'quiz', val.Id]);
  }
}
