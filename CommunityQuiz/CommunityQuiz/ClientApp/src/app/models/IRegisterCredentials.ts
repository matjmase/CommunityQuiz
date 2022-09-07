import { ILoginCredentials } from './ILoginCredentials';

export interface IRegisterCredentials extends ILoginCredentials {
  UserName: string;
  Roles: string[];
}

export class RegisterCredentials implements IRegisterCredentials {
  UserName: string;
  Email: string;
  Password: string;
  Roles: string[];

  constructor(form: any) {
    this.Email = form.Email;
    this.UserName = form.UserName;
    this.Password = form.Password;
    this.Roles = [];

    const keys = Object.keys(form.Roles);

    keys.forEach((element) => {
      if (form.Roles[element] == true) {
        this.Roles.push(element);
      }
    });
  }
}
