import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAddEditModalComponent } from './quiz-add-edit-modal.component';

describe('QuizAddEditModalComponent', () => {
  let component: QuizAddEditModalComponent;
  let fixture: ComponentFixture<QuizAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizAddEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
