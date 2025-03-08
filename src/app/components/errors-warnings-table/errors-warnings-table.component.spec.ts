import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsWarningsTableComponent } from './errors-warnings-table.component';

describe('ErrorsWarningsTableComponent', () => {
  let component: ErrorsWarningsTableComponent;
  let fixture: ComponentFixture<ErrorsWarningsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorsWarningsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorsWarningsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
