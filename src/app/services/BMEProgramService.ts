import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { SemesterLoader } from './semesterLoader';
import { OfferingsLoader } from './offeringsLoader';

@Injectable({
  providedIn: 'root'
})
export class BMEProgramService {

  constructor(private semesterLoader: SemesterLoader, private offeringsLoader: OfferingsLoader) {}

  getProgram(): Program {
    let program = new Program();
    let allCourses = this.offeringsLoader.getCourses();

    let BMESemester1 = this.semesterLoader.createSemester('Biomedical Engineering', 'Fall', 1, allCourses, [
      'ARL101(A)', 'ECS100/ECS200/RSN200', 'MTT102', 'STT100', 'ISL100(A)', 'FWS100(E)'
    ]);

    let BMESemester2 = this.semesterLoader.createSemester('Biomedical Engineering', 'Spring', 2, allCourses, [
      'BIO205', 'BIO205L', 'ENG200', 'PHY102', 'PHY102L', 'MTT200', 'COE101'
    ]);

    let BMESemester3 = this.semesterLoader.createSemester('Biomedical Engineering', 'Fall', 3, allCourses, [
      'FWS205', 'CSC303/EEN210', 'CSC201', 'CHE205', 'CHE201L', 'BME380'
    ]);

    let BMESemester4 = this.semesterLoader.createSemester('Biomedical Engineering', 'Spring', 4, allCourses, [
      'BME301', 'BME381', 'CEN201', 'COE202', 'MTT205', 'MTT204'
    ]);

    let BMESemester5 = this.semesterLoader.createSemester('Biomedical Engineering', 'Fall', 5, allCourses, [
      'CEN320/BME320', 'BME401', 'CEN325/BME325/AIN325/RSN325', 'FWS305', 'CEN304'
    ]);

    let BMESemester6 = this.semesterLoader.createSemester('Biomedical Engineering', 'Spring', 6, allCourses, [
      'BME330', 'CEN324', 'BME310', 'CEN330/EEN330', 'CEN425/BME425/AIN425', 'BME312'
    ]);

    let BMESemester7 = this.semesterLoader.createSemester('Biomedical Engineering', 'Fall', 7, allCourses, [
      'CEN464/BME464', 'BME413', 'BME441', 'ME1', 'OE', 'BME491', 'BME310L'
    ]);

    let BMESemester8 = this.semesterLoader.createSemester('Biomedical Engineering', 'Spring', 8, allCourses, [
      'EEN365', 'CEN454', 'BME492', 'FWS310', 'ME2'
    ]);

    program.semesters = [
      BMESemester1,
      BMESemester2,
      BMESemester3,
      BMESemester4,
      BMESemester5,
      BMESemester6,
      BMESemester7,
      BMESemester8
    ];

    return program;
  }
}
