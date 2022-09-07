import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserGroup } from 'src/app/models/Nodes/IUserGroup';

export class UserGroupConnect {
  private _url: string;

  constructor(private http: HttpClient, _baseApiUrl: string) {
    this._url = _baseApiUrl + 'usergroup';
  }

  public PostUserGroup(input: IUserGroup): Observable<void> {
    return this.http.post<void>(this._url, input);
  }

  public DeleteUserGroup(input: IUserGroup): Observable<void> {
    return this.http.delete<void>(this._url, { body: input });
  }
}
