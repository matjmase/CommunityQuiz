import { IQuestion, Question } from '../Nodes/IQuestion';
import { IAnswerConnected } from './IAnswerConnected';

export interface IQuestionConnected {
  Question: IQuestion;
  Answers: IAnswerConnected[];
}

export class QuestionConnected implements IQuestionConnected {
  Question: IQuestion;
  Answers: IAnswerConnected[];

  constructor() {
    this.Question = new Question();
    this.Answers = [];
  }
}
