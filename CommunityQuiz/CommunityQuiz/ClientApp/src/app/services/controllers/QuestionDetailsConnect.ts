import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestionConnected } from 'src/app/models/Connected/IQuestionConnected';

export class QuestionDetailsConnect {
  baseQuestUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this.baseQuestUrl = baseApiUrl + 'questiondetails';
  }

  GetAll(quizId: number): Observable<IQuestionConnected[]> {
    return this.http.get<IQuestionConnected[]>(
      this.baseQuestUrl + `/all/${quizId}`
    );
  }

  Get(id: number): Observable<IQuestionConnected> {
    return this.http.get<IQuestionConnected>(this.baseQuestUrl + `/${id}`);
  }

  Put(input: IQuestionConnected): Observable<void> {
    return this.http.put<void>(this.baseQuestUrl, input);
  }

  Post(input: IQuestionConnected): Observable<number> {
    return this.http.post<number>(this.baseQuestUrl, input);
  }
}
