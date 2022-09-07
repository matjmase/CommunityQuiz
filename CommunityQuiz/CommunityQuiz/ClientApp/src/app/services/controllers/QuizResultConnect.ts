import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuizConnected } from 'src/app/models/Connected/IQuizConnected';

export class QuizResultConnect {
  private _baseUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this._baseUrl = baseApiUrl + 'quizresult';
  }

  GetMyQuizResults(quizId: number): Observable<IQuizConnected> {
    return this.http.get<IQuizConnected>(this._baseUrl + `/${quizId}`);
  }

  GetMyStudentsQuizResults(
    userId: number,
    quizId: number
  ): Observable<IQuizConnected> {
    return this.http.get<IQuizConnected>(
      this._baseUrl + `/${userId}/${quizId}`
    );
  }
}
