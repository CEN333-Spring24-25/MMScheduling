import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionNeedsComponent } from './section-needs.component';

describe('SectionNeedsComponent', () => {
  let component: SectionNeedsComponent;
  let fixture: ComponentFixture<SectionNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionNeedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
