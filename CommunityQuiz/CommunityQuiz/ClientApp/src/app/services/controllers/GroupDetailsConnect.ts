import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGroupConnected } from 'src/app/models/Connected/IGroupConnected';

export class GroupDetailsConnect {
  baseQuestUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this.baseQuestUrl = baseApiUrl + 'groupdetails';
  }

  GetAll(): Observable<IGroupConnected[]> {
    return this.http.get<IGroupConnected[]>(this.baseQuestUrl + `/all`);
  }
}
