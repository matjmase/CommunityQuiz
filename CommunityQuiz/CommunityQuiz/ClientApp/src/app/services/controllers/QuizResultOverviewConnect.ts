import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuizConnected } from 'src/app/models/Connected/IQuizConnected';
import { IQuizUserResultsOverview } from 'src/app/models/IQuizUserResultsOverview';

export class QuizResultOverviewConnect {
  private _baseUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this._baseUrl = baseApiUrl + 'quizresultoverview';
  }

  GetMyResults(): Observable<IQuizConnected[]> {
    return this.http.get<IQuizConnected[]>(this._baseUrl);
  }

  GetMyStudentsResults(): Observable<IQuizUserResultsOverview[]> {
    return this.http.get<IQuizUserResultsOverview[]>(
      this._baseUrl + '/mystudents'
    );
  }
}
