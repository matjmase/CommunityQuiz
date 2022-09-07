import { IGroup } from '../Nodes/IGroup';
import { IQuizConnected } from './IQuizConnected';
import { IUserConnected } from './IUserConnected';
import { IUserQuizEventConnected } from './IUserQuizEventConnected';

export interface IGroupConnected {
  Group: IGroup;
  Users: IUserConnected;
  Quizzes: IQuizConnected[];
  QuizzEvents: IUserQuizEventConnected[];
}
