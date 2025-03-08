import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { Semester } from '../data/semester';
import { SemesterLoader } from './semesterLoader';
import { OfferingsLoader } from './offeringsLoader';

@Injectable({
  providedIn: 'root'
})
export class EENProgramService {

  constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}

  getProgram(): Program {
    let program = new Program();
    let allCourses = this.offeringsLoader.getCourses();

    let EENSemester1 = this.semesterLoader.createSemester('Electrical Engineering', 'Fall', 1, allCourses, [
      'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)'
    ]);

    let EENSemester2 = this.semesterLoader.createSemester('Electrical Engineering', 'Spring', 2, allCourses, [
      'FWS205', 'ENG200', 'COE101', 'PHY102', 'PHY102L', 'MTT200'
    ]);

    let EENSemester3 = this.semesterLoader.createSemester('Electrical Engineering', 'Fall', 3, allCourses, [
      'CSC201', 'PHY201', 'PHY201L', 'CSC303/EEN210', 'CHE205', 'CHE201L', 'MTT201'
    ]);

    let EENSemester4 = this.semesterLoader.createSemester('Electrical Engineering', 'Spring', 4, allCourses, [
      'CEN466/EEN466', 'CEN333/BME433', 'CEN201', 'COE202', 'MTT205', 'MTT204'
    ]);

    let EENSemester5 = this.semesterLoader.createSemester('Electrical Engineering', 'Fall', 5, allCourses, [
      'CEN320/BME320', 'EEN220', 'CEN325/BME325/AIN325/RSN325', 'OE1', 'EEN338', 'CEN304'
    ]);

    let EENSemester6 = this.semesterLoader.createSemester('Electrical Engineering', 'Spring', 6, allCourses, [
      'EEN340', 'EEN335', 'EEN337', 'CEN324', 'CEN425/BME425/AIN425', 'CEN330/EEN330'
    ]);

    let EENSemester7 = this.semesterLoader.createSemester('Electrical Engineering', 'Fall', 7, allCourses, [
      'CSC305', 'FWS310', 'ME1', 'OE2', 'CEN464/BME464', 'EEN451'
    ]);

    let EENSemester8 = this.semesterLoader.createSemester('Electrical Engineering', 'Spring', 8, allCourses, [
      'EEN365', 'ME2', 'EEN449', 'EEN452', 'EEN339', 'ME3'
    ]);

    program.semesters = [
      EENSemester1,
      EENSemester2,
      EENSemester3,
      EENSemester4,
      EENSemester5,
      EENSemester6,
      EENSemester7,
      EENSemester8
    ];

    return program;
  }
}
