import { Injectable } from '@angular/core';
import { Course } from '../../data/course';
import { Section } from '../../data/section';
import { Slot } from '../../data/slot';
import { ErrorDetail, ErrorType } from '../../data/errorDetail';

@Injectable({
  providedIn: 'root'
})
export class UncoveredCoursesService {
  checkUncoveredCourses(courses: Course[], slots: Slot[], needsList: Section[]): ErrorDetail[] {
    let errors: ErrorDetail[] = [];
    
    let coveredCoursesAbuDhabi = new Set([
      ...needsList.filter(s => s.campus === 'AbuDhabi').map(s => s.course.code),
      ...slots.flatMap(slot => slot.sections.map(s => s.course.code))
    ]);
    let coveredCoursesAlAin = new Set([
      ...needsList.filter(s => s.campus === 'AlAin').map(s => s.course.code),
      ...slots.flatMap(slot => slot.sections.map(s => s.course.code))
    ]);
    
    courses.forEach(course => {
      const coveredInAbuDhabi = coveredCoursesAbuDhabi.has(course.code);
      const coveredInAlAin = coveredCoursesAlAin.has(course.code);

      if (!coveredInAbuDhabi && !coveredInAlAin) {
        errors.push({
          type: ErrorType.ERROR,
          message: `Course ${course.title} (${course.code}) is not covered in AbuDhabi and AlAin.`});
      } else if (!coveredInAbuDhabi) {
        errors.push({
          type: ErrorType.ERROR,
          message: `Course ${course.title} (${course.code}) is not covered in AbuDhabi.`});
      } else if (!coveredInAlAin) {
        errors.push({
          type: ErrorType.ERROR,
          message: `Course ${course.title} (${course.code}) is not covered in AlAin.`});
      }

    });

    return errors;
  }
}
