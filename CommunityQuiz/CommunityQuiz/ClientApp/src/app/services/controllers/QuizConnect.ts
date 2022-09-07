import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuiz } from 'src/app/models/Nodes/IQuiz';

export class QuizConnect {
  private _baseUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this._baseUrl = baseApiUrl + 'quiz';
  }

  GetAll(): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(this._baseUrl);
  }
  Get(id: number): Observable<IQuiz> {
    return this.http.get<IQuiz>(this._baseUrl + `/${id}`);
  }
  Put(input: IQuiz): Observable<void> {
    return this.http.put<void>(this._baseUrl, input);
  }
  Post(input: IQuiz): Observable<number> {
    return this.http.post<number>(this._baseUrl, input);
  }
  Delete(id: number): Observable<void> {
    return this.http.delete<void>(this._baseUrl + `/${id}`);
  }

  GetGroupQuizes(groupId: number): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(this._baseUrl + `/group/${groupId}`);
  }

  PutPublish(id: number): Observable<void> {
    return this.http.put<void>(this._baseUrl + `/${id}`, {});
  }
}
