import { Injectable } from '@angular/core';
import { Slot } from '../../data/slot';
import { ErrorDetail, ErrorType } from '../../data/errorDetail';

@Injectable({
  providedIn: 'root'
})
export class CohortOverloadService {
  checkCohortOverload(slots: Slot[]): ErrorDetail[] {
    let warnings: ErrorDetail[] = [];
    let cohortDayCourses = new Map<string, Map<string, Set<string>>>(); // Cohort -> Day -> Set of Courses

    slots.forEach(slot => {
      let day = slot.days;

      slot.sections.forEach(section => {
        let cohort = section.course.code;
        if (!cohortDayCourses.has(cohort)) {
          cohortDayCourses.set(cohort, new Map());
        }

        if (!cohortDayCourses.get(cohort)!.has(day)) {
          cohortDayCourses.get(cohort)!.set(day, new Set());
        }

        cohortDayCourses.get(cohort)!.get(day)!.add(section.course.code);
      });
    });

    cohortDayCourses.forEach((daySchedule, cohort) => {
      daySchedule.forEach((courses, day) => {
        if (courses.size > 3) {
          warnings.push({ type: ErrorType.WARNING, message: `Cohort ${cohort} is taking four or more courses on ${day}.` });
        }
      });
    });

    return warnings;
  }
}
