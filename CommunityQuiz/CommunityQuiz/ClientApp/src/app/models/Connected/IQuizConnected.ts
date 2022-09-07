import { IQuiz, Quiz } from '../Nodes/IQuiz';
import { IQuestionConnected } from './IQuestionConnected';
import { IUserQuizEventConnected } from './IUserQuizEventConnected';

export interface IQuizConnected {
  Quiz: IQuiz;
  QuizzEvents: IUserQuizEventConnected[];
  Questions: IQuestionConnected[];
}

export class QuizConnected implements IQuizConnected {
  Quiz: IQuiz;
  QuizzEvents: IUserQuizEventConnected[];
  Questions: IQuestionConnected[];

  constructor() {
    this.Quiz = new Quiz();
    this.QuizzEvents = [];
    this.Questions = [];
  }
}
