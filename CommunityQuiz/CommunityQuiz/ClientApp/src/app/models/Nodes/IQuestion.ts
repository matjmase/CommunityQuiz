export interface IQuestion {
  Id: number;
  QuizId: number;
  Statement: string;
  MultiAnswer: boolean;
  Weighting: number;
}

export class Question implements IQuestion {
  Id: number;
  QuizId: number;
  Statement: string;
  MultiAnswer: boolean;
  Weighting: number;

  constructor() {
    this.Id = 0;
    this.QuizId = 0;
    this.Statement = '';
    this.MultiAnswer = false;
    this.Weighting = 1;
  }
}
