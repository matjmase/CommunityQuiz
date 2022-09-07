import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuizResultsComponent } from './my-quiz-results.component';

describe('MyQuizResultsComponent', () => {
  let component: MyQuizResultsComponent;
  let fixture: ComponentFixture<MyQuizResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyQuizResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQuizResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
