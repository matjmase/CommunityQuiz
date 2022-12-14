import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizOverviewComponent } from './quiz-overview.component';

describe('QuizOverviewComponent', () => {
  let component: QuizOverviewComponent;
  let fixture: ComponentFixture<QuizOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
