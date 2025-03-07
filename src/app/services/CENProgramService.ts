import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { Semester } from '../data/semester';
import { Course } from '../data/course';

@Injectable({
  providedIn: 'root'
})
export class CENProgramService {

  constructor() {}

  private createCourses(courseData: { code: string, title: string, credits: number }[]): Course[] {
    return courseData.map(cd => new Course(cd.code, cd.title, cd.credits));
  }

  getProgram(): Program {
    const program = new Program();
    const semesters: Semester[] = [
      new Semester('Computer Engineering', 'Fall', 1, this.createCourses([
        { code: 'ARL101(A)', title: 'Comm. Skills in Arabic Lang.', credits: 3 },
        { code: 'ECS200', title: 'Intro. to Engr. & Computing', credits: 3 },
        { code: 'MTT102', title: 'Calculus I', credits: 3 },
        { code: 'STT100', title: 'General Statistics', credits: 3 },
        { code: 'ISL100(A)', title: 'Islamic Culture', credits: 3 },
      ])),

      new Semester('Computer Engineering', 'Spring', 2, this.createCourses([
        { code: 'FWS205', title: 'UAE and GCC Society', credits: 3 },
        { code: 'ENG200', title: 'English II', credits: 3 },
        { code: 'COE101', title: 'Introductory Artificial Intelligence', credits: 3 },
        { code: 'PHY102', title: 'Physics & Engr. Applications I', credits: 3 },
        { code: 'PHY102L', title: 'Physics & Engr. Applications I Lab', credits: 1 },
        { code: 'MTT200', title: 'Calculus II', credits: 3 },
      ])),

      new Semester('Computer Engineering', 'Fall', 3, this.createCourses([
        { code: 'CSC201', title: 'Computer Programming I', credits: 3 },
        { code: 'PHY201', title: 'Physics & Engr. Applications II', credits: 3 },
        { code: 'PHY201L', title: 'Physics & Engr. Applications II Lab', credits: 1 },
        { code: 'CSC303', title: 'Digital Logic Design', credits: 3 },
        { code: 'OE1', title: 'Open Elective I', credits: 3 },
        { code: 'MTT202', title: 'Discrete Structures and Applications', credits: 3 },
      ])),

      new Semester('Computer Engineering', 'Spring', 4, this.createCourses([
        { code: 'CSC202', title: 'Computer Programming II', credits: 3 },
        { code: 'CEN333', title: 'Cross-platform Mobile App. Develop.', credits: 3 },
        { code: 'CEN201', title: 'Electric Circuits I', credits: 3 },
        { code: 'COE202', title: 'Engineering Ethics, Economy, and Law', credits: 3 },
        { code: 'MTT205', title: 'Differential Equations', credits: 3 },
        { code: 'MTT204', title: 'Introduction to Linear Algebra', credits: 3 },
      ])),

      new Semester('Computer Engineering', 'Fall', 5, this.createCourses([
        { code: 'CEN320', title: 'Signals and Systems', credits: 3 },
        { code: 'CSC301', title: 'Data Structures and Algorithms', credits: 3 },
        { code: 'CSC305', title: 'Data Communications and Networks', credits: 3 },
        { code: 'CEN304', title: 'Electronic Devices and Circuits', credits: 3 },
        { code: 'CEN325', title: 'Numerical Methods', credits: 3 },
        { code: 'GEN300', title: 'IoT: Foundation & Design', credits: 3 },
      ])),

      new Semester('Computer Engineering', 'Spring', 6, this.createCourses([
        { code: 'CEN330', title: 'Probability and Stochastic Processes', credits: 3 },
        { code: 'CSC308', title: 'Operating Systems', credits: 3 },
        { code: 'CSC408', title: 'Distributed Information Systems', credits: 3 },
        { code: 'CEN324', title: 'Digital and Analog Electronics', credits: 3 },
        { code: 'CEN425', title: 'IoT: Applications & Networking', credits: 3 },
        { code: 'FWS310', title: 'Fund. of Innovation & Entrepreneurship', credits: 3 },
      ])),

      new Semester('Computer Engineering', 'Fall', 7, this.createCourses([
        { code: 'OE2', title: 'Open Elective 2', credits: 3 },
        { code: 'ME1', title: 'Major Elective 1', credits: 3 },
        { code: 'CEN468', title: 'Computer Architecture and Organization', credits: 3 },
        { code: 'CEN455', title: 'Fund. of Sec. for Computer & Embedded Systems', credits: 3 },
        { code: 'CEN464', title: 'Digital Signal Processing', credits: 3 },
        { code: 'CEN451', title: 'Computer Engineering Design Project I', credits: 1 },
      ])),

      new Semester('Computer Engineering', 'Spring', 8, this.createCourses([
        { code: 'EEN365', title: 'Control Systems', credits: 3 },
        { code: 'CEN466', title: 'Advanced Digital System Design', credits: 3 },
        { code: 'ME2', title: 'Major Elective II', credits: 3 },
        { code: 'CEN452', title: 'Computer Engineering Design Project II', credits: 2 },
        { code: 'CEN454', title: 'Computer Vision and Machine Learning', credits: 3 },
        { code: 'ME3', title: 'Major Elective III', credits: 3 },
      ]))
    ];
    program.semesters = semesters;
    return program;
  }
}
