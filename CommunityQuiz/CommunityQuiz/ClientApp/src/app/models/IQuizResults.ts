import { IAnswerEventConnected } from './Connected/IAnswerEventConnected';
import { IAnswerEvent } from './Nodes/IAnswerEvent';
import { IUserQuizEvent, UserQuizEvent } from './Nodes/IUserQuizEvent';

export interface IQuizResults {
  QuizzEvent: IUserQuizEvent;
  AnswersEvents: IAnswerEventConnected[];
}

export class QuizResults implements IQuizResults {
  QuizzEvent: IUserQuizEvent;
  AnswersEvents: IAnswerEventConnected[];

  constructor() {
    this.QuizzEvent = new UserQuizEvent();
    this.AnswersEvents = [];
  }
}
