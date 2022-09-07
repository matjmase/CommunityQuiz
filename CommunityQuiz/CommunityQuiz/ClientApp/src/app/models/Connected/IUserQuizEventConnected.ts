import { IUserQuizEvent } from '../Nodes/IUserQuizEvent';
import { IAnswerEventConnected } from './IAnswerEventConnected';

export interface IUserQuizEventConnected {
  QuizzEvent: IUserQuizEvent;
  AnswersEvents: IAnswerEventConnected[];
}
