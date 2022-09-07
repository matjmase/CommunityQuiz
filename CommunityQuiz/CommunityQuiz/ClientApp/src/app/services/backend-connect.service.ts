import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthenticationConnect } from './controllers/AuthenticationConnect';
import { GroupConnect } from './controllers/GroupConnect';
import { GroupDetailsConnect } from './controllers/GroupDetailsConnect';
import { QuestionConnect } from './controllers/QuestionConnect';
import { QuestionDetailsConnect } from './controllers/QuestionDetailsConnect';
import { QuizConnect } from './controllers/QuizConnect';
import { QuizResultConnect } from './controllers/QuizResultConnect';
import { QuizResultOverviewConnect } from './controllers/QuizResultOverviewConnect';
import { QuizTakeConnect } from './controllers/QuizTakeConnect';
import { UserConnect } from './controllers/UserConnect';
import { UserGroupConnect } from './controllers/UserGroupConnect';

@Injectable({
  providedIn: 'root',
})
export class BackendConnectService {
  private _authorize: AuthenticationConnect;
  private _user: UserConnect;
  private _userGroup: UserGroupConnect;
  private _group: GroupConnect;
  private _quiz: QuizConnect;
  private _question: QuestionConnect;
  private _questionDetails: QuestionDetailsConnect;
  private _groupDetails: GroupDetailsConnect;
  private _quizTake: QuizTakeConnect;
  private _quizResultsOverView: QuizResultOverviewConnect;
  private _quizResults: QuizResultConnect;

  get Auth(): AuthenticationConnect {
    return this._authorize;
  }
  get User(): UserConnect {
    return this._user;
  }
  get UserGroup(): UserGroupConnect {
    return this._userGroup;
  }
  get Group(): GroupConnect {
    return this._group;
  }
  get Quiz(): QuizConnect {
    return this._quiz;
  }
  get Question(): QuestionConnect {
    return this._question;
  }
  get QuestionDetails(): QuestionDetailsConnect {
    return this._questionDetails;
  }
  get GroupDetails(): GroupDetailsConnect {
    return this._groupDetails;
  }
  get QuizTake(): QuizTakeConnect {
    return this._quizTake;
  }
  get QuizResultsOverview(): QuizResultOverviewConnect {
    return this._quizResultsOverView;
  }
  get QuizResults(): QuizResultConnect {
    return this._quizResults;
  }

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    const baseApiUrl = baseUrl + 'api/';

    this._authorize = new AuthenticationConnect(http, baseApiUrl);
    this._user = new UserConnect(http, baseApiUrl);
    this._userGroup = new UserGroupConnect(http, baseApiUrl);
    this._group = new GroupConnect(http, baseApiUrl);
    this._quiz = new QuizConnect(http, baseApiUrl);
    this._question = new QuestionConnect(http, baseApiUrl);
    this._questionDetails = new QuestionDetailsConnect(http, baseApiUrl);
    this._groupDetails = new GroupDetailsConnect(http, baseApiUrl);
    this._quizTake = new QuizTakeConnect(http, baseApiUrl);
    this._quizResultsOverView = new QuizResultOverviewConnect(http, baseApiUrl);
    this._quizResults = new QuizResultConnect(http, baseApiUrl);
  }
}
