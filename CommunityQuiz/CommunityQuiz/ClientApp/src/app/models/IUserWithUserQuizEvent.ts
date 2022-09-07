import { IUser } from './Nodes/IUser';
import { IUserQuizEvent } from './Nodes/IUserQuizEvent';

export interface IUserWithUserQuizEvent {
  User: IUser;
  QuizEvents: IUserQuizEvent[];
}
