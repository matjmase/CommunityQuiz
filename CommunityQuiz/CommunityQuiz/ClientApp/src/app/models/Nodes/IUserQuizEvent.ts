export interface IUserQuizEvent {
  Id: number;
  UserId: number;
  QuizId: number;
  Date: Date;
}

export class UserQuizEvent implements IUserQuizEvent {
  Id: number;
  UserId: number;
  QuizId: number;
  Date: Date;

  constructor() {
    this.Id = 0;
    this.UserId = 0;
    this.QuizId = 0;
    this.Date = new Date();
  }
}
