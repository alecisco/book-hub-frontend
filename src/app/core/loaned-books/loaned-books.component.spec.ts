import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanedBooksComponent } from './loaned-books.component';

describe('LoanedBooksComponent', () => {
  let component: LoanedBooksComponent;
  let fixture: ComponentFixture<LoanedBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanedBooksComponent]
    });
    fixture = TestBed.createComponent(LoanedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
