import { Injectable } from '@angular/core';
import { Semester } from '../../data/semester';
import { Course } from '../../data/course';

@Injectable({
  providedIn: 'root'
})
export class SemesterLoader {

  constructor() {}

  createSemester(major: string, term: string, number: number, allCourses: Course[], courseCodes: string[]): Semester {
    const semesterCourses = courseCodes.map(code => {
      const course = allCourses.find(c => c.code === code);
      if (!course) {
        throw new Error(`Course with code ${code} not found`);
      }
      return course;
    });

    return new Semester(major, term, number, semesterCourses);
  }
}
