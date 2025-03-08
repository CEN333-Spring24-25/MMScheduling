import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { SemesterLoader } from './semesterLoader';
import { OfferingsLoader } from './offeringsLoader';

@Injectable({
    providedIn: 'root'
  })
  export class AINProgramService {
  
    constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}
  
    getProgram(): Program {
      let program = new Program();
      let allCourses = this.offeringsLoader.getCourses();
  
      let AINSemester1 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Fall', 1, allCourses, [
        'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)', 'ENG200'
      ]);
  
      let AINSemester2 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Spring', 2, allCourses, [
        'FWS205', 'OE1', 'COE101', 'PHY102', 'PHY102L', 'MTT200'
      ]);
  
      let AINSemester3 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Fall', 3, allCourses, [
        'CSC201', 'PHY201', 'PHY201L', 'CSC303/EEN210', 'COE202', 'MTT202'
      ]);
  
      let AINSemester4 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Spring', 4, allCourses, [
        'CSC202', 'CEN333/BME433', 'CEN201', 'AIRE305/AIN305', 'MTT205', 'MTT204'
      ]);
  
      let AINSemester5 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Fall', 5, allCourses, [
        'CEN320/BME320', 'CSC301', 'CSC305', 'CEN304', 'CEN325/BME325/AIN325/RSN325', 'OE2'
      ]);
  
  
      let AINSemester6 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Spring', 6, allCourses, [
        'CEN330/EEN330', 'EEN365', 'FWS310', 'CEN401L', 'CEN425/BME425/AIN425', 'AIRE310/AIN310', 'CSC202L'
      ]);
  
      let AINSemester7 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Fall', 7, allCourses, [
        'GEN300', 'ME1', 'AIRE410/AIN410', 'ME2', 'AIN451', 'CEN464/BME464', 'CEN464L'
      ]);

      let AINSemester8 = this.semesterLoader.createSemester('Artificial Intelligence Engineering', 'Spring', 8, allCourses, [
        'AIN482', 'AIN475', 'AIN333', 'AIN452', 'CEN454', 'ME3'
      ]);
  
      program.semesters = [
        AINSemester1,
        AINSemester2,
        AINSemester3,
        AINSemester4,
        AINSemester5,
        AINSemester6,
        AINSemester7,
        AINSemester8
      ];
  
      return program;
    }
  }
  