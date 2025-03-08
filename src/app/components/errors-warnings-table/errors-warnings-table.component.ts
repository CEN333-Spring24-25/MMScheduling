import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Course } from '../../data/course';
import { Section } from '../../data/section';
import { Slot } from '../../data/slot';
import { Faculty } from '../../data/faculty';
import { Program } from '../../data/program';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BMEProgramService } from '../../services/BMEProgramService';
import { CENProgramService } from '../../services/CENProgramService';
import { EENProgramService } from '../../services/EENProgramService';
import { AINProgramService } from '../../services/AINProgramService';
import { RSNProgramService } from '../../services/RSNProgramService';

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
  uncoveredCourses: string[] = [];
  facultyLoadIssues: string[] = [];
  facultyConflicts: string[] = [];
  cohortOverloads: string[] = [];

  courseToCohortMap = new Map<string, string>(); // Course code -> Cohort

  constructor(
    private bmeProgramService: BMEProgramService,
    private cenProgramService: CENProgramService,
    private eenProgramService: EENProgramService,
    private ainProgramService: AINProgramService,
    private rsnProgramService: RSNProgramService
  ) {
    this.buildCourseToCohortMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkErrorsAndWarnings();
  }

  checkErrorsAndWarnings(): void {
    this.errors = [];
    this.warnings = [];
    this.uncoveredCourses = [];
    this.facultyLoadIssues = [];
    this.facultyConflicts = [];
    this.cohortOverloads = [];

    this.checkForUncoveredCourses();
    this.checkForFacultyLoadIssues();
    this.checkForFacultyTimeConflict();
    this.checkForFacultyCampusConflict();
    this.checkForCohortOverload();
  }

  private buildCourseToCohortMap(): void {
    const programs = [
      this.bmeProgramService.getProgram(),
      this.cenProgramService.getProgram(),
      this.eenProgramService.getProgram(),
      this.ainProgramService.getProgram(),
      this.rsnProgramService.getProgram()
    ];

    programs.forEach(program => {
      program.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          this.courseToCohortMap.set(course.code, `${semester.major} - Semester ${semester.num}`);
        });
      });
    });

    console.log("Course-to-Cohort Map Built:", this.courseToCohortMap);
  }
 
  checkForCohortOverload() {
    let cohortDayCourses = new Map<string, Map<string, Set<string>>>(); 
    // Key: "Cohort", Value: (Day -> Set of Courses)

    this.slots.forEach(slot => {
      let day = slot.days;

      slot.sections.forEach(section => {
        let cohort = this.courseToCohortMap.get(section.course.code);
        if (!cohort) return;

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
          this.warnings.push(`Warning - Cohort ${cohort} is taking four or more courses on ${day}.`);
        }
      });
    });
  }

  checkForUncoveredCourses() {
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
        this.uncoveredCourses.push(`Course ${course.title} (${course.code}) is not covered in AbuDhabi and AlAin.`);
      } else if (!coveredInAbuDhabi) {
        this.uncoveredCourses.push(`Course ${course.title} (${course.code}) is not covered in AbuDhabi.`);
      } else if (!coveredInAlAin) {
        this.uncoveredCourses.push(`Course ${course.title} (${course.code}) is not covered in AlAin.`);
      }
    });
  }


  checkForFacultyLoadIssues() {
    this.faculty.forEach(fac => {
      let totalLoad = fac.load + fac.release;

      if (totalLoad < 12) {
        this.facultyLoadIssues.push(`Warning - ${fac.name} is underloaded.`);
      } else if (totalLoad > 12) {
        this.facultyLoadIssues.push(`Warning - ${fac.name} is overloaded.`);
      }
    });
  }

  checkForFacultyTimeConflict() {
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
          this.facultyConflicts.push(`Error - ${section.faculty.name} has a scheduling conflict: assigned to both ${scheduledCampus} and ${section.campus} at ${timeSlotKey}.`);
        } else {
          facultySchedules.get(facultyId)!.set(timeSlotKey, section.campus);
        }
      });
    });
  }
  checkForFacultyCampusConflict() {
    let facultyDaySchedules = new Map<string, Map<string, Set<string>>>();

    this.slots.forEach(slot => {
      slot.sections.forEach(section => {
        let facultyId = section.faculty.id;
        let day = slot.days;
        let campus = section.campus;

        if (!facultyDaySchedules.has(facultyId)) {
          facultyDaySchedules.set(facultyId, new Map());
        }

        if (!facultyDaySchedules.get(facultyId)!.has(day)) {
          facultyDaySchedules.get(facultyId)!.set(day, new Set());
        }

        facultyDaySchedules.get(facultyId)!.get(day)!.add(campus);
      });
    });

    facultyDaySchedules.forEach((daySchedule, facultyId) => {
      daySchedule.forEach((campuses, day) => {
        if (campuses.size > 1) {
          let facultyName = this.faculty.find(f => f.id === facultyId)?.name || 'Unknown Faculty';
          this.facultyConflicts.push(`Warning - ${facultyName} is assigned to both AbuDhabi and AlAin on ${day}.`);
        }
      });
    });
  }


}
