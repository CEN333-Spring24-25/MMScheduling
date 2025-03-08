import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { SemesterLoader } from './semesterLoader';
import { OfferingsLoader } from './offeringsLoader';

@Injectable({
  providedIn: 'root'
})
export class CENAIProgramService {

  constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}

  getProgram(): Program {
    let program = new Program();
    let allCourses = this.offeringsLoader.getCourses();

    let CENAISemester1 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Fall', 1, allCourses, [
      'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)'
    ]);

    let CENAISemester2 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Spring', 2, allCourses, [
      'FWS205', 'ENG200', 'COE101', 'PHY102', 'PHY102L', 'MTT200'
    ]);

    let CENAISemester3 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Fall', 3, allCourses, [
      'CSC201', 'PHY201', 'PHY201L', 'CSC303/EEN210', 'COE202', 'MTT202'
    ]);

    let CENAISemester4 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Spring', 4, allCourses, [
      'CSC202', 'CEN333/BME433', 'CEN201', 'AIRE305/AIN305', 'MTT205', 'MTT204'
    ]);

    let CENAISemester5 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Fall', 5, allCourses, [
      'CEN320/BME320', 'CSC301', 'CSC305', 'CEN304', 'CEN325/BME325/AIN325/RSN325', 'FWS310'
    ]);

    let CENAISemester6 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Spring', 6, allCourses, [
      'CEN330/EEN330', 'CSC308', 'CSC408', 'CEN324', 'CEN425/BME425/AIN425', 'AIRE310/AIN310'
    ]);

    let CENAISemester7 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Fall', 7, allCourses, [
      'GEN300', 'CEN468', 'AIRE410/AIN410', 'CEN455', 'CEN464/BME464', 'CEN451'
    ]);


    let CENAISemester8 = this.semesterLoader.createSemester('Computer Engineering (AI)', 'Spring', 8, allCourses, [
      'EEN365', 'CE1', 'CEN466/EEN466', 'CEN452', 'CEN454', 'CE2'
    ]);

    program.semesters = [
      CENAISemester1,
      CENAISemester2,
      CENAISemester3,
      CENAISemester4,
      CENAISemester5,
      CENAISemester6,
      CENAISemester7,
      CENAISemester8
    ];

    return program;
  }
}
