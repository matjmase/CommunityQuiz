import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuizResultsComponent } from './student-quiz-results.component';

describe('StudentQuizResultsComponent', () => {
  let component: StudentQuizResultsComponent;
  let fixture: ComponentFixture<StudentQuizResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentQuizResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQuizResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
