import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestion } from 'src/app/models/Nodes/IQuestion';

export class QuestionConnect {
  baseQuestUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this.baseQuestUrl = baseApiUrl + 'question';
  }

  GetAll(quizId: number): Observable<IQuestion[]> {
    return this.http.get<IQuestion[]>(this.baseQuestUrl + `/all/${quizId}`);
  }

  Get(id: number): Observable<IQuestion> {
    return this.http.get<IQuestion>(this.baseQuestUrl + `/${id}`);
  }
  Put(input: IQuestion): Observable<void> {
    return this.http.put<void>(this.baseQuestUrl, input);
  }
  Post(input: IQuestion): Observable<number> {
    return this.http.post<number>(this.baseQuestUrl, input);
  }
  Delete(id: number): Observable<void> {
    return this.http.delete<void>(this.baseQuestUrl + `/${id}`);
  }
}
