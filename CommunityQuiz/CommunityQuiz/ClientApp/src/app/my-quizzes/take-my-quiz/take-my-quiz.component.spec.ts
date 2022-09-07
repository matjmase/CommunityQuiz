import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeMyQuizComponent } from './take-my-quiz.component';

describe('TakeMyQuizComponent', () => {
  let component: TakeMyQuizComponent;
  let fixture: ComponentFixture<TakeMyQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeMyQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeMyQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
