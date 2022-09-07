import { IUserWithUserQuizEvent } from './IUserWithUserQuizEvent';
import { IQuiz } from './Nodes/IQuiz';

export interface IQuizUserResultsOverview {
  Quiz: IQuiz;
  Users: IUserWithUserQuizEvent[];
}
