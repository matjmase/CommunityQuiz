import { IUser } from '../Nodes/IUser';
import { IGroupConnected } from './IGroupConnected';

export interface IUserConnected {
  User: IUser;
  Groups: IGroupConnected[];
}
