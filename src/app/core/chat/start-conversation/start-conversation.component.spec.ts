import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartConversationComponent } from './start-conversation.component';

describe('StartConversationComponent', () => {
  let component: StartConversationComponent;
  let fixture: ComponentFixture<StartConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartConversationComponent]
    });
    fixture = TestBed.createComponent(StartConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
