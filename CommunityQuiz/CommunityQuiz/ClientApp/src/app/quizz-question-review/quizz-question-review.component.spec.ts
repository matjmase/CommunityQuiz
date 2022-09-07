import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzQuestionReviewComponent } from './quizz-question-review.component';

describe('QuizzQuestionReviewComponent', () => {
  let component: QuizzQuestionReviewComponent;
  let fixture: ComponentFixture<QuizzQuestionReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizzQuestionReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizzQuestionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
