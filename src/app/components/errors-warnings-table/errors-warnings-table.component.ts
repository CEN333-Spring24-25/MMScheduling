import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Course } from '../../data/course';
import { Section } from '../../data/section';
import { Slot } from '../../data/slot';
import { Faculty } from '../../data/faculty';
import { ErrorDetail } from '../../data/errorDetail';
import { UncoveredCoursesService } from '../../services/ErrorCheckingServices/UncoveredCourses';
import { FacultyLoadService } from '../../services/ErrorCheckingServices/FacultyLoadService';
import { FacultyTimeConflictService } from '../../services/ErrorCheckingServices/FacultyTimeConflictService';
import { FacultyCampusConflictService } from '../../services/ErrorCheckingServices/FacultyCampusConflictService';
import { CohortOverloadService } from '../../services/ErrorCheckingServices/CohortOverloadService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-errors-warnings-table',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './errors-warnings-table.component.html',
  styleUrls: ['./errors-warnings-table.component.css'],
})
export class ErrorsWarningsTableComponent implements OnChanges {
  @Input() courses: Course[] = [];
  @Input() needsList: Section[] = [];
  @Input() slots: Slot[] = [];
  @Input() faculty: Faculty[] = [];

  errors: ErrorDetail[] = [];
  uncoveredCourses: ErrorDetail[] = [];
  facultyLoadIssues: ErrorDetail[] = [];
  facultyConflicts: ErrorDetail[] = [];
  cohortOverloads: ErrorDetail[] = [];

  constructor(
    private uncoveredCoursesService: UncoveredCoursesService,
    private facultyLoadService: FacultyLoadService,
    private facultyTimeConflictService: FacultyTimeConflictService,
    private facultyCampusConflictService: FacultyCampusConflictService,
    private cohortOverloadService: CohortOverloadService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.checkErrorsAndWarnings();
  }

  checkErrorsAndWarnings(): void {
    this.errors = [
      ...this.uncoveredCoursesService.checkUncoveredCourses(this.courses, this.slots, this.needsList),
      ...this.facultyLoadService.checkFacultyLoad(this.faculty),
      ...this.facultyTimeConflictService.checkFacultyTimeConflicts(this.slots),
      ...this.facultyCampusConflictService.checkFacultyCampusConflicts(this.slots, this.faculty),
      ...this.cohortOverloadService.checkCohortOverload(this.slots),
    ];

    this.uncoveredCourses = this.errors.filter(e => e.type === 'Error' && e.message.includes('not covered'));
    this.facultyLoadIssues = this.errors.filter(e => e.type === 'Warning' && (e.message.includes('underloaded') || e.message.includes('overloaded')));
    this.facultyConflicts = this.errors.filter(e => e.message.includes('scheduling conflict') || e.message.includes('assigned to both'));
    this.cohortOverloads = this.errors.filter(e => e.type === 'Warning' && e.message.includes('Cohort'));
  }
}
