import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyLoadComponent } from './faculty-load.component';

describe('FacultyLoadComponent', () => {
  let component: FacultyLoadComponent;
  let fixture: ComponentFixture<FacultyLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
