import { HttpClient } from '@angular/common/http';
import { Subject, Observable, tap } from 'rxjs';
import { ILoginCredentials } from 'src/app/models/ILoginCredentials';
import { ILoginResponse } from 'src/app/models/ILoginResponse';
import { IRegisterCredentials } from 'src/app/models/IRegisterCredentials';

export class AuthenticationConnect {
  public RolesHaveChanged = new Subject<void>();

  private _baseAuthUrl: string;

  constructor(private http: HttpClient, _baseApiUrl: string) {
    this._baseAuthUrl = _baseApiUrl + 'authentication/';
  }

  public GetAllRoles(): Observable<string[]> {
    return this.http.get<string[]>(this._baseAuthUrl + 'roles');
  }

  public Login(creds: ILoginCredentials): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(this._baseAuthUrl + 'login', creds)
      .pipe(
        tap({
          next: (val) => this.SaveResponse(val),
        })
      );
  }

  public Register(creds: IRegisterCredentials): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(this._baseAuthUrl + 'register', creds)
      .pipe(
        tap({
          next: (val) => this.SaveResponse(val),
        })
      );
  }

  public Logout(): void {
    this.RemoveSession();
  }

  private SaveResponse(response: ILoginResponse) {
    localStorage.setItem('Authentication', JSON.stringify(response));
    this.RolesHaveChanged.next();
  }

  private RemoveSession() {
    localStorage.clear();
    this.RolesHaveChanged.next();
  }

  public GetSavedResponse(): ILoginResponse | undefined {
    const strResp = localStorage.getItem('Authentication');

    if (!strResp) {
      return undefined;
    } else {
      var response = <ILoginResponse>JSON.parse(strResp);

      if (new Date(response.ValidUntil) < new Date()) {
        this.RemoveSession();
        return undefined;
      }

      return response;
    }
  }
}
