import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormModalModel } from '../models/FormModalModel';
import { IGroup } from '../models/Nodes/IGroup';
import { IQuiz, Quiz } from '../models/Nodes/IQuiz';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: ['./quiz-overview.component.scss'],
})
export class QuizOverviewComponent implements OnInit, OnDestroy {
  addEditCommunicate = new FormModalModel<IQuiz, IQuiz>();
  subs: Subscription[] = [];

  groupCollection: IGroup[] = [];
  quizCollection: IQuiz[] = [];

  selectedGroup: IGroup | undefined;
  stageDeleteQuiz: IQuiz | undefined;

  constructor(private backend: BackendConnectService, private router: Router) {}

  ngOnInit(): void {
    this.subs.push(
      this.addEditCommunicate.OnClose().subscribe({
        next: (val) => this.AddNewQuizFinal(val),
      })
    );

    this.LoadGroupsFromBackend();
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  LoadGroupsFromBackend() {
    this.backend.Group.GetMyGroups().subscribe({
      next: (val) => (this.groupCollection = val),
    });
  }

  SelectGroup(input: IGroup) {
    this.selectedGroup = input;
    this.LoadQuizzesFromBackend(this.selectedGroup.Id);
  }

  LoadQuizzesFromBackend(groupId: number) {
    return this.backend.Quiz.GetGroupQuizes(groupId).subscribe({
      next: (quizzes) => (this.quizCollection = quizzes),
    });
  }

  AddNewQuizInit() {
    this.addEditCommunicate.OpenInit(new Quiz());
  }

  private AddNewQuizFinal(val: IQuiz) {
    val.GroupId = this.selectedGroup!.Id;

    if (val.Id === 0) {
      this.backend.Quiz.Post(val).subscribe({
        next: (val) => this.LoadQuizzesFromBackend(this.selectedGroup!.Id),
      });
    } else {
      this.backend.Quiz.Put(val).subscribe({
        next: (val) => this.LoadQuizzesFromBackend(this.selectedGroup!.Id),
      });
    }
  }

  EditNewQuizInit(event: MouseEvent, quiz: IQuiz) {
    event.stopPropagation();
    this.addEditCommunicate.OpenInit(quiz);
  }

  ViewQuizDetails(event: MouseEvent, quiz: IQuiz) {
    event.stopPropagation();
    this.router.navigate(['/quiz', 'overview', 'details', quiz.Id.toString()]);
  }
}
