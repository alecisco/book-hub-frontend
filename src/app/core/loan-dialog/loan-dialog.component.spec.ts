import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDialogComponent } from './loan-dialog.component';

describe('LoanDialogComponent', () => {
  let component: LoanDialogComponent;
  let fixture: ComponentFixture<LoanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDialogComponent]
    });
    fixture = TestBed.createComponent(LoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
