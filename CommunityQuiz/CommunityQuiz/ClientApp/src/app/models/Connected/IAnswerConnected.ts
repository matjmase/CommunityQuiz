import { Answer, IAnswer } from '../Nodes/IAnswer';
import { IAnswerEvent } from '../Nodes/IAnswerEvent';
import { IAnswerEventConnected } from './IAnswerEventConnected';

export interface IAnswerConnected {
  Answer: IAnswer;
  AnswerEvents: IAnswerEventConnected[];
}

export class AnswerConnected implements IAnswerConnected {
  Answer: IAnswer;
  AnswerEvents: IAnswerEventConnected[];

  constructor() {
    this.Answer = new Answer();
    this.AnswerEvents = [];
  }
}
