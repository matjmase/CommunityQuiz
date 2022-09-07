import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAddEditModalComponent } from './group-add-edit-modal.component';

describe('GroupAddEditModalComponent', () => {
  let component: GroupAddEditModalComponent;
  let fixture: ComponentFixture<GroupAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAddEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
