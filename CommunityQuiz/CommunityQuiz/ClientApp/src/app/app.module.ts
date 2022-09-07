import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthenticateDirective } from './directives/authenticate.directive';
import { AuthorizeDirective } from './directives/authorize.directive';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotificationModalComponent } from './modals/notification-modal/notification-modal.component';
import { ComfirmationModalComponent } from './modals/comfirmation-modal/comfirmation-modal.component';
import { GroupComponent } from './group/group.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { GroupAddEditModalComponent } from './modals/group-add-edit-modal/group-add-edit-modal.component';
import { QuizOverviewComponent } from './quiz-overview/quiz-overview.component';
import { QuizAddEditModalComponent } from './modals/quiz-add-edit-modal/quiz-add-edit-modal.component';
import { QuizDetailsComponent } from './quiz-overview/quiz-details/quiz-details.component';
import { QuestionDetailsAddEditModalComponent } from './modals/question-details-add-edit-modal/question-details-add-edit-modal.component';
import { MyQuizzesComponent } from './my-quizzes/my-quizzes.component';
import { TakeMyQuizComponent } from './my-quizzes/take-my-quiz/take-my-quiz.component';
import { MyResultsComponent } from './my-results/my-results.component';
import { MyQuizResultsComponent } from './my-results/my-quiz-results/my-quiz-results.component';
import { StudentResultsComponent } from './student-results/student-results.component';
import { StudentQuizResultsComponent } from './student-results/student-quiz-results/student-quiz-results.component';
import { QuizzQuestionReviewComponent } from './quizz-question-review/quizz-question-review.component';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    AuthenticateDirective,
    AuthorizeDirective,
    LoginComponent,
    RegisterComponent,
    NotificationModalComponent,
    ComfirmationModalComponent,
    GroupComponent,
    GroupAddEditModalComponent,
    QuizOverviewComponent,
    QuizAddEditModalComponent,
    QuizDetailsComponent,
    QuestionDetailsAddEditModalComponent,
    MyQuizzesComponent,
    TakeMyQuizComponent,
    MyResultsComponent,
    MyQuizResultsComponent,
    StudentResultsComponent,
    StudentQuizResultsComponent,
    QuizzQuestionReviewComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'group',
        component: GroupComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrator'] },
      },
      {
        path: 'quiz',
        children: [
          {
            path: 'overview',
            canActivate: [AuthGuard],
            data: { roles: ['Tester'] },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: QuizOverviewComponent,
              },
              {
                path: 'details/:id',
                component: QuizDetailsComponent,
              },
            ],
          },
          {
            path: 'my',
            canActivate: [AuthGuard],
            data: { roles: ['User'] },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: MyQuizzesComponent,
              },
              {
                path: 'take/:id',
                component: TakeMyQuizComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'mystudents',
        canActivate: [AuthGuard],
        data: { roles: ['Tester'] },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: StudentResultsComponent,
          },
          {
            path: 'quiz/:userId/:quizId',
            component: StudentQuizResultsComponent,
          },
        ],
      },
      {
        path: 'results',
        canActivate: [AuthGuard],
        data: { roles: ['User'] },
        children: [
          {
            path: 'overview',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: MyResultsComponent,
              },
              {
                path: 'quiz/:id',
                component: MyQuizResultsComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ]),
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
