export interface ILoginResponse {
  Id: number;
  Email: string;
  UserName: string;
  Roles: string[];
  Token: string;
  ValidUntil: string;
}
