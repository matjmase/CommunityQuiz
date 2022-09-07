import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGroup } from 'src/app/models/Nodes/IGroup';

export class GroupConnect {
  protected baseUrl: string;

  constructor(private http: HttpClient, baseApiUrl: string) {
    this.baseUrl = baseApiUrl + 'group';
  }

  GetMyGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(this.baseUrl + '/mygroups');
  }

  GetAll(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(this.baseUrl);
  }
  Get(id: number): Observable<IGroup> {
    return this.http.get<IGroup>(this.baseUrl + `/${id}`);
  }
  Put(input: IGroup): Observable<void> {
    return this.http.put<void>(this.baseUrl, input);
  }
  Post(input: IGroup): Observable<number> {
    return this.http.post<number>(this.baseUrl, input);
  }
  Delete(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + `/${id}`);
  }
}
