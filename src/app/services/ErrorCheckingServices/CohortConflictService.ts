import { Injectable } from '@angular/core';
import { Slot } from '../../data/slot';
import { Program } from '../../data/program';
import { ErrorDetail, ErrorType } from '../../data/errorDetail';
import { AINProgramService } from '../ProgramServices/AINProgramService';
import { BMEProgramService } from '../ProgramServices/BMEProgramService';
import { CENProgramService } from '../ProgramServices/CENProgramService';
import { CENAIProgramService } from '../ProgramServices/CENAIProgramService';
import { EENProgramService } from '../ProgramServices/EENProgramService';
import { EENROProgramService } from '../ProgramServices/EENROProgramService';
import { RSNProgramService } from '../ProgramServices/RSNProgramService';

@Injectable({
  providedIn: 'root'
})
export class CohortConflictsService {
  private programs: Program[];

  constructor(
    private ainService: AINProgramService,
    private bmeService: BMEProgramService,
    private cenService: CENProgramService,
    private cenaiService: CENAIProgramService,
    private eenService: EENProgramService,
    private eenroService: EENROProgramService,
    private rsnService: RSNProgramService
  ) {
    this.programs = [
      this.ainService.getProgram(),
      this.bmeService.getProgram(),
      this.cenService.getProgram(),
      this.cenaiService.getProgram(),
      this.eenService.getProgram(),
      this.eenroService.getProgram(),
      this.rsnService.getProgram()
    ];
  }

  checkCohortConflicts(slots: Slot[]): ErrorDetail[] {
    let errors: ErrorDetail[] = [];

    this.programs.forEach(program => {
      program.semesters.forEach(semester => {
        let cohortKey = `${program.semesters[0].major}-Semester${semester.num}`;

        let requiredCourses = semester.courses.map(course => course.code);

        let assignedCourses = new Map<string, string[]>(); // course -> available time slots

        slots.forEach(slot => {
          slot.sections.forEach(section => {
            if (requiredCourses.includes(section.course.code)) {
              if (!assignedCourses.has(section.course.code)) {
                assignedCourses.set(section.course.code, []);
              }
              assignedCourses.get(section.course.code)!.push(`${slot.days} ${slot.starttime}-${slot.endtime}`);
            }
          });
        });

        requiredCourses = requiredCourses.filter(course => assignedCourses.has(course));

        if (requiredCourses.length > 0) {
          let takenTimes: Map<string, string> = new Map(); // Time -> Course

          for (let course of requiredCourses) {
            let availableSections = assignedCourses.get(course);
            if (!availableSections) continue;

            let foundSlot = false;
            for (let timeSlot of availableSections) {
              if (!takenTimes.has(timeSlot)) {
                takenTimes.set(timeSlot, course);
                foundSlot = true;
                break;
              }
            }

            if (!foundSlot) {
              let conflictingCourse = Array.from(takenTimes.keys())
                .find(time => availableSections.includes(time));
              
              let conflictingCourseCode = conflictingCourse ? takenTimes.get(conflictingCourse) : 'Unknown';

              errors.push({
                type: ErrorType.ERROR,
                message: `Cohort ${cohortKey} cannot take ${course} due to a scheduling conflict with ${conflictingCourseCode}.`
              });
            }
          }
        }
      });
    });

    return errors;
  }
}
