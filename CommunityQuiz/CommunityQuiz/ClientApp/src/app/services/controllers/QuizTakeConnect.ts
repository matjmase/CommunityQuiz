import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuizConnected } from 'src/app/models/Connected/IQuizConnected';
import { IQuizResults } from 'src/app/models/IQuizResults';

export class QuizTakeConnect {
  private _baseUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this._baseUrl = baseApiUrl + 'quiztake';
  }

  Get(id: number): Observable<IQuizConnected> {
    return this.http.get<IQuizConnected>(this._baseUrl + `/${id}`);
  }

  Post(val: IQuizResults): Observable<number> {
    return this.http.post<number>(this._baseUrl, val);
  }
}
