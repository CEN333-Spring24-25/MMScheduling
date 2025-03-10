import { Injectable } from '@angular/core';
import { Program } from '../../data/program';
import { SemesterLoader } from '../DataLoaders/semesterLoader';
import { OfferingsLoader } from '../DataLoaders/offeringsLoader';

@Injectable({
  providedIn: 'root'
})
export class RSNProgramService {

  constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}

  getProgram(): Program {
    let program = new Program();
    let allCourses = this.offeringsLoader.getCourses();

    let RSNSemester1 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Fall', 1, allCourses, [
      'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)', 'FWS205'
    ]);

    let RSNSemester2 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Spring', 2, allCourses, [
      'IEN220', 'ENG200', 'COE101', 'PHY102', 'PHY102L', 'MTT200'
    ]);

    let RSNSemester3 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Fall', 3, allCourses, [
      'CSC201', 'PHY201', 'PHY201L', 'OE1', 'CHE205', 'CHE201L', 'RSN215'
    ]);

    let RSNSemester4 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Spring', 4, allCourses, [
      'MEC320', 'RSN301', 'CEN201', 'COE202', 'MTT205', 'MTT204'
    ]);

    let RSNSemester5 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Fall', 5, allCourses, [
      'CEN320/BME320', 'EEN220', 'CEN325/BME325/AIN325/RSN325', 'MEC350', 'RSN323', 'CEN304'
    ]);

    let RSNSemester6 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Spring', 6, allCourses, [
      'FWS310', 'EEN345', 'EEN441', 'MEC410', 'RSN352', 'RSN460A'
    ]);

    let RSNSemester7 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Fall', 7, allCourses, [
      'RSN455', 'MEC420', 'ME1', 'ME2', 'RSN450A', 'RSN460B', 'RSN480A'
    ]);

    let RSNSemester8 = this.semesterLoader.createSemester('Renewable & Sustainable Energy Engineering', 'Spring', 8, allCourses, [
      'RSN450B', 'RSN460C', 'RSN480B', 'RSN477', 'RSN411', 'RSN485', 'RSN404'
    ]);

    program.semesters = [
      RSNSemester1,
      RSNSemester2,
      RSNSemester3,
      RSNSemester4,
      RSNSemester5,
      RSNSemester6,
      RSNSemester7,
      RSNSemester8
    ];

    return program;
  }
}
