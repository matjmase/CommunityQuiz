export interface IUser {
  Id: number;
  UserName: string;
}

export class User implements IUser {
  Id: number;
  UserName: string;

  constructor() {
    this.Id = 0;
    this.UserName = '';
  }
}
