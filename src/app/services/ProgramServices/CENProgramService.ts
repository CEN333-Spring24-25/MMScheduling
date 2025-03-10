import { Injectable } from '@angular/core';
import { Program } from '../../data/program';
import { SemesterLoader } from '../DataLoaders/semesterLoader';
import { OfferingsLoader } from '../DataLoaders/offeringsLoader';

@Injectable({
  providedIn: 'root'
})
export class CENProgramService {

  constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}

  getProgram(): Program {
    let program = new Program();
    let allCourses = this.offeringsLoader.getCourses();

    let CENSemester1 = this.semesterLoader.createSemester('Computer Engineering', 'Fall', 1, allCourses, [
      'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)'
    ]);

    let CENSemester2 = this.semesterLoader.createSemester('Computer Engineering', 'Spring', 2, allCourses, [
      'FWS205', 'ENG200', 'COE101', 'PHY102', 'PHY102L', 'MTT200'
    ]);

    let CENSemester3 = this.semesterLoader.createSemester('Computer Engineering', 'Fall', 3, allCourses, [
      'CSC201', 'PHY201', 'PHY201L', 'CSC303/EEN210', 'COE202', 'MTT202'
    ]);

    let CENSemester4 = this.semesterLoader.createSemester('Computer Engineering', 'Spring', 4, allCourses, [
      'CSC202', 'CEN333/BME433', 'CEN201', 'CEN325/BME325/AIN325/RSN325', 'MTT205', 'MTT204'
    ]);

    let CENSemester5 = this.semesterLoader.createSemester('Computer Engineering', 'Fall', 5, allCourses, [
      'CEN320/BME320', 'CSC301', 'CSC305', 'CEN304', 'CEN425/BME425/AIN425', 'FWS310'
    ]);


    let CENSemester6 = this.semesterLoader.createSemester('Computer Engineering', 'Spring', 6, allCourses, [
      'CEN330/EEN330', 'CSC308', 'CSC408', 'CEN324', 'CEN464/BME464', 'GEN300'
    ]);

    let CENSemester7 = this.semesterLoader.createSemester('Computer Engineering', 'Fall', 7, allCourses, [
      'CEN468', 'ME1', 'CEN455', 'CEN451', 'CEN466/EEN466'
    ]);

    let CENSemester8 = this.semesterLoader.createSemester('Computer Engineering', 'Spring', 8, allCourses, [
      'EEN365', 'ME2', 'CEN452', 'CEN454', 'ME3'
    ]);

    program.semesters = [
      CENSemester1,
      CENSemester2,
      CENSemester3,
      CENSemester4,
      CENSemester5,
      CENSemester6,
      CENSemester7,
      CENSemester8
    ];

    return program;
  }
}
