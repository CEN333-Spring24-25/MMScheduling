import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { SemesterLoader } from './semesterLoader';
import { OfferingsLoader } from './offeringsLoader';

@Injectable({
  providedIn: 'root'
})
export class EENROProgramService {

  constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}

  getProgram(): Program {
    let program = new Program();
    let allCourses = this.offeringsLoader.getCourses();

    let EENROSemester1 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Fall', 1, allCourses, [
      'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)'
    ]);

    let EENROSemester2 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Spring', 2, allCourses, [
      'FWS205', 'ENG200', 'COE101', 'PHY102', 'PHY102L', 'MTT200'
    ]);

    let EENROSemester3 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Fall', 3, allCourses, [
      'CSC201', 'PHY201', 'PHY201L', 'CSC303/EEN210', 'CHE205', 'CHE201L', 'MTT201'
    ]);

    let EENROSemester4 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Spring', 4, allCourses, [
      'CEN466/EEN466', 'CEN333/BME433', 'CEN201', 'COE202', 'MTT205', 'MTT204'
    ]);

    let EENROSemester5 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Fall', 5, allCourses, [
      'CEN320/BME320', 'EEN220', 'CEN325/BME325/AIN325/RSN325', 'FWS310', 'EEN338', 'CEN304'
    ]);

    let EENROSemester6 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Spring', 6, allCourses, [
      'CEN425/BME425/AIN425', 'EEN335', 'EEN337', 'CEN324', 'EEN365', 'CEN330/EEN330'
    ]);

    let EENROSemester7 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Fall', 7, allCourses, [
      'EEN420', 'CSC305', 'EEN366', 'EEN310', 'CEN464/BME464', 'EEN451'
    ]);

    let EENROSemester8 = this.semesterLoader.createSemester('Electrical Engineering (Robotics)', 'Spring', 8, allCourses, [
      'EEN340', 'CEN454', 'EEN449', 'EEN452', 'EEN339', 'EEN413'
    ]);

    program.semesters = [
      EENROSemester1,
      EENROSemester2,
      EENROSemester3,
      EENROSemester4,
      EENROSemester5,
      EENROSemester6,
      EENROSemester7,
      EENROSemester8
    ];

    return program;
  }
}
