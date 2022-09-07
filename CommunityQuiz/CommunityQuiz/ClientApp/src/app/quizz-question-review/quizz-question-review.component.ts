import { Component, Input, OnInit } from '@angular/core';
import { IQuestionConnected } from '../models/Connected/IQuestionConnected';

@Component({
  selector: 'app-quizz-question-review',
  templateUrl: './quizz-question-review.component.html',
  styleUrls: ['./quizz-question-review.component.scss'],
})
export class QuizzQuestionReviewComponent implements OnInit {
  questions: IQuestionConnected[] = [];
  selectedId: number[] = [];

  @Input() set MyQuestions(val: IQuestionConnected[]) {
    this.questions = val;
    this.SetSelection(this.questions);
  }

  constructor() {}

  ngOnInit(): void {}

  SetSelection(questions: IQuestionConnected[]) {
    this.selectedId = [];
    for (let i = 0; i < questions.length; i++) {
      this.selectedId.push(
        questions[i].Answers.find(
          (e) => e.AnswerEvents[0].AnswerEvent.Selection === true
        )?.Answer?.Id ?? -1
      );
    }
  }

  IsCorrectAnswerGroup(val: IQuestionConnected): boolean {
    return val.Answers.every(
      (e) => e.Answer.Correct === e.AnswerEvents[0].AnswerEvent.Selection
    );
  }

  TotalScore() {
    let sum = 0;
    let correct = 0;

    this.questions.forEach((question) => {
      sum += question.Question.Weighting;

      if (this.IsCorrectAnswerGroup(question)) {
        correct += question.Question.Weighting;
      }
    });

    return (correct / sum) * 100;
  }
}
