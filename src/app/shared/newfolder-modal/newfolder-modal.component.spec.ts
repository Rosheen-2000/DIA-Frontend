import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfolderModalComponent } from './newfolder-modal.component';

describe('NewfolderModalComponent', () => {
  let component: NewfolderModalComponent;
  let fixture: ComponentFixture<NewfolderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewfolderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewfolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
