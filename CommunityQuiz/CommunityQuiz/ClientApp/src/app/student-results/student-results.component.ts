import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuizUserResultsOverview } from '../models/IQuizUserResultsOverview';
import { IUserQuizEvent } from '../models/Nodes/IUserQuizEvent';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-student-results',
  templateUrl: './student-results.component.html',
  styleUrls: ['./student-results.component.scss'],
})
export class StudentResultsComponent implements OnInit {
  quizzes: IQuizUserResultsOverview[] = [];

  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {
    this.backend.QuizResultsOverview.GetMyStudentsResults().subscribe({
      next: (val) => {
        this.quizzes = val;
      },
    });
  }

  ReviewResults(val: IUserQuizEvent) {
    this.router.navigate(['/mystudents', 'quiz', val.UserId, val.Id]);
  }
}
