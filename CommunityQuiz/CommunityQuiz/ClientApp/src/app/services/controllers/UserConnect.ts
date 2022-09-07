import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/models/Nodes/IUser';

export class UserConnect {
  private _url: string;

  constructor(private http: HttpClient, _baseApiUrl: string) {
    this._url = _baseApiUrl + 'user';
  }

  public GetAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this._url);
  }

  public GetUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(this._url + `/${id}`);
  }

  public DeleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this._url + `/${id}`);
  }

  public GetUserGroupMember(groupId: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(this._url + `/groupmember/${groupId}`);
  }
  public GetUserGroupNonMember(groupId: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(this._url + `/groupnonmember/${groupId}`);
  }
}
