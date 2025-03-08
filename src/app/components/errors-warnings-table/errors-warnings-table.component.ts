import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Course } from '../../data/course';
import { Section } from '../../data/section';
import { Slot } from '../../data/slot';
import { Faculty } from '../../data/faculty';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-errors-warnings-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './errors-warnings-table.component.html',
  styleUrls: ['./errors-warnings-table.component.css']
})
export class ErrorsWarningsTableComponent implements OnChanges {
  @Input() courses: Course[] = [];
  @Input() needsList: Section[] = [];
  @Input() slots: Slot[] = [];
  @Input() faculty: Faculty[] = []; 

  errors: string[] = [];
  warnings: string[] = [];
  constructor(){

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.checkErrorsAndWarnings();
  }

  private checkErrorsAndWarnings(): void {
    this.errors = [];
    this.warnings = [];

    const coveredCoursesAbuDhabi = new Set([
      ...this.needsList.filter(s => s.campus === 'AbuDhabi').map(s => s.course.code),
      ...this.slots.flatMap(slot => slot.sections.filter(s => s.campus === 'AbuDhabi').map(s => s.course.code))
    ]);

    const coveredCoursesAlAin = new Set([
      ...this.needsList.filter(s => s.campus === 'AlAin').map(s => s.course.code),
      ...this.slots.flatMap(slot => slot.sections.filter(s => s.campus === 'AlAin').map(s => s.course.code))
    ]);

    this.courses.forEach(course => {
      const coveredInAbuDhabi = coveredCoursesAbuDhabi.has(course.code);
      const coveredInAlAin = coveredCoursesAlAin.has(course.code);

      if (!coveredInAbuDhabi && !coveredInAlAin) {
        this.errors.push(`Course ${course.title} (${course.code}) is not covered in AbuDhabi and AlAin.`);
      } else if (!coveredInAbuDhabi) {
        this.errors.push(`Course ${course.title} (${course.code}) is not covered in AbuDhabi.`);
      } else if (!coveredInAlAin) {
        this.errors.push(`Course ${course.title} (${course.code}) is not covered in AlAin.`);
      }
    });
    this.faculty.forEach(fac => {
      const totalLoad = fac.load + fac.release;
      
      if (totalLoad < 12) {
        this.warnings.push(`Warning - ${fac.name} is underloaded.`);
      } else if (totalLoad > 12) {
        this.warnings.push(`Warning - ${fac.name} is overloaded.`);
      }
    });
  }
}
