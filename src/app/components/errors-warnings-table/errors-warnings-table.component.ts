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

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.checkErrorsAndWarnings();
  }

  checkErrorsAndWarnings(): void {
    this.errors = [];
    this.warnings = [];

    this.checkForUncoveredCourses();
    this.checkForFacultyLoadIssues();
    this.checkForFacultyTimeConflict();
  }
  checkForUncoveredCourses(){
    let coveredCoursesAbuDhabi = new Set([
      ...this.needsList.filter(s => s.campus === 'AbuDhabi').map(s => s.course.code),
      ...this.slots.flatMap(slot => slot.sections.filter(s => s.campus === 'AbuDhabi').map(s => s.course.code))
    ]);

    let coveredCoursesAlAin = new Set([
      ...this.needsList.filter(s => s.campus === 'AlAin').map(s => s.course.code),
      ...this.slots.flatMap(slot => slot.sections.filter(s => s.campus === 'AlAin').map(s => s.course.code))
    ]);

    this.courses.forEach(course => {
      let coveredInAbuDhabi = coveredCoursesAbuDhabi.has(course.code);
      let coveredInAlAin = coveredCoursesAlAin.has(course.code);

      if (!coveredInAbuDhabi && !coveredInAlAin) {
        this.errors.push(`Course ${course.title} (${course.code}) is not covered in AbuDhabi and AlAin.`);
      } else if (!coveredInAbuDhabi) {
        this.errors.push(`Course ${course.title} (${course.code}) is not covered in AbuDhabi.`);
      } else if (!coveredInAlAin) {
        this.errors.push(`Course ${course.title} (${course.code}) is not covered in AlAin.`);
      }
    });
  }
  checkForFacultyLoadIssues(){
    this.faculty.forEach(fac => {
      let totalLoad = fac.load + fac.release;
      
      if (totalLoad < 12) {
        this.warnings.push(`Warning - ${fac.name} is underloaded.`);
      } else if (totalLoad > 12) {
        this.warnings.push(`Warning - ${fac.name} is overloaded.`);
      }
    });
  }
  checkForFacultyTimeConflict(){
    let facultySchedules = new Map<string, Map<string, string>>(); 

    this.slots.forEach(slot => {
      slot.sections.forEach(section => {
        let facultyId = section.faculty.id;
        let timeSlotKey = `${slot.days} ${slot.starttime}-${slot.endtime}`;
        
        if (!facultySchedules.has(facultyId)) {
          facultySchedules.set(facultyId, new Map());
        }

        let scheduledCampus = facultySchedules.get(facultyId)!.get(timeSlotKey);
        if (scheduledCampus && scheduledCampus !== section.campus) {
          this.errors.push(`Error - ${section.faculty.name} has a scheduling conflict: assigned to both ${scheduledCampus} and ${section.campus} at ${timeSlotKey}.`);
        } else {
          facultySchedules.get(facultyId)!.set(timeSlotKey, section.campus);
        }
      });
    });
  }
}
