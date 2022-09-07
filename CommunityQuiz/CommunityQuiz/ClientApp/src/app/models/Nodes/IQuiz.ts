export interface IQuiz {
  Id: number;
  GroupId: number;
  QuizName: string;
  Published: Boolean;
}

export class Quiz implements IQuiz {
  Id: number;
  GroupId: number;
  QuizName: string;
  Published: Boolean;

  constructor() {
    this.Id = 0;
    this.GroupId = 0;
    this.QuizName = '';
    this.Published = false;
  }
}
