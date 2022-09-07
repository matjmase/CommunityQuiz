export interface IAnswer {
  Id: number;
  QuestionId: number;
  Statement: string;
  Correct: boolean;
}

export class Answer implements IAnswer {
  Id: number;
  QuestionId: number;
  Statement: string;
  Correct: boolean;

  constructor() {
    this.Id = 0;
    this.QuestionId = 0;
    this.Statement = '';
    this.Correct = false;
  }
}
