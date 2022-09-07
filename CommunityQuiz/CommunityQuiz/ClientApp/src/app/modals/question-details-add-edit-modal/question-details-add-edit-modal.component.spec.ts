import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDetailsAddEditModalComponent } from './question-details-add-edit-modal.component';

describe('QuestionDetailsAddEditModalComponent', () => {
  let component: QuestionDetailsAddEditModalComponent;
  let fixture: ComponentFixture<QuestionDetailsAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDetailsAddEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDetailsAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
