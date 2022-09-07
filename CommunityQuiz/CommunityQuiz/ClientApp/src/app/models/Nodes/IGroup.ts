export interface IGroup {
  Id: number;
  GroupName: string;
}

export class Group implements IGroup {
  Id: number;
  GroupName: string;

  constructor() {
    this.Id = 0;
    this.GroupName = '';
  }
}
