import { Injectable } from '@angular/core';
import { Course } from '../data/course';

@Injectable({
  providedIn: 'root'
})
export class OfferingsLoader {
  offeringsList: Course[] = [];

  constructor() {
    this.initializeOfferings();
  }

  initializeOfferings(): void {
    this.offeringsList = [

      new Course('ECS100/ECS200/RSN200', 'Intro. to Engr. & Computing / Renewable & Sustainable Energy Eng.', 3),
      new Course('CSC303/EEN210', 'Digital Logic Design', 3),
      new Course('CEN333/BME433', 'Cross-platform Mobile App. Develop.', 3),
      new Course('CEN320/BME320', 'Signals and Systems', 3),
      new Course('CEN325/BME325/AIN325/RSN325', 'IoT: Foundations & Design / Internet of Energy Efficient Things', 3),
      new Course('CEN425/BME425/AIN425', 'IoT: Applications & Networking / Internet of AI-powered Things', 3),
      new Course('CEN330/EEN330', 'Probability and Stochastic Processes', 3),
      new Course('CEN464/BME464', 'Digital Signal Processing', 3),
      new Course('CEN466/EEN466', 'Advanced Digital System Design', 3),

      new Course('ARL101(A)', 'Comm. Skills in Arabic Lang.', 3),
      new Course('MTT102', 'Calculus I', 3),
      new Course('STT100', 'General Statistics', 3),
      new Course('ISL100(A)', 'Islamic Culture', 3),
      new Course('FWS205', 'UAE and GCC Society', 3),
      new Course('ENG200', 'English II', 3),
      new Course('COE101', 'Introductory Artificial Intelligence', 3),
      new Course('PHY102', 'Physics & Engr. Applications I', 3),
      new Course('PHY102L', 'Physics & Engr. Applications I Lab', 1),
      new Course('MTT200', 'Calculus II', 3),
      new Course('MTT201', 'Calculus III', 3),
      new Course('FWS100(E)', 'Academic Skills for Success', 3),
      new Course('BIO205', 'General Biology', 3),
      new Course('BIO205L', 'General Biology Lab', 3),
      new Course('BME380', 'Human Biology I', 3),
      new Course('BME381', 'Human Biology II', 3),
      new Course('BME401', 'Introduction to Biotechnology', 3),
      new Course('BME301', 'Applied Molecular & Cellular Biology for Engineers', 3),
      new Course('FWS305', 'Tech. Comm. for Workplace', 3),
      new Course('BME330', 'Physiological Modeling', 3),
      new Course('BME310', 'Biomedical Instrumentation', 3),
      new Course('BME312', 'Medical Device Design', 3),
      new Course('BME413', 'Biomedical Sensors and Transducers', 3),
      new Course('BME441', 'Medical Imaging Systems', 3),
      new Course('OE', 'Open Elective', 3),
      new Course('BME491', 'Biomedical Engineering Design Project I', 3),
      new Course('BME310L', 'Biomedical Instrumentation Lab', 3),
      new Course('BME492', 'Biomedical Engineering Design Project II', 3),
      
      new Course('CSC201', 'Computer Programming I', 3),
      new Course('PHY201', 'Physics & Engr. Applications II', 3),
      new Course('PHY201L', 'Physics & Engr. Applications II Lab', 1),
      new Course('OE1', 'Open Elective I', 3),
      new Course('MTT202', 'Discrete Structures and Applications', 3),
      new Course('CSC202', 'Computer Programming II', 3),
      new Course('CEN201', 'Electric Circuits I', 3),
      new Course('COE202', 'Engineering Ethics, Economy, and Law', 3),
      new Course('MTT205', 'Differential Equations', 3),
      new Course('MTT204', 'Introduction to Linear Algebra', 3),
      new Course('CSC301', 'Data Structures and Algorithms', 3),
      new Course('CSC305', 'Data Communications and Networks', 3),
      new Course('CEN304', 'Electronic Devices and Circuits', 3),
      new Course('GEN300', 'IoT: Foundation & Design', 3),
      new Course('CSC308', 'Operating Systems', 3),
      new Course('CSC408', 'Distributed Information Systems', 3),
      new Course('CEN324', 'Digital and Analog Electronics', 3),
      new Course('FWS310', 'Fund. of Innovation & Entrepreneurship', 3),
      new Course('OE2', 'Open Elective II', 3),
      new Course('ME1', 'Major Elective I', 3),
      new Course('CEN468', 'Computer Architecture and Organization', 3),
      new Course('CEN455', 'Fund. of Sec. for Computer & Embedded Systems', 3),
      new Course('CEN451', 'Computer Engineering Design Project I', 1),
      new Course('EEN365', 'Control Systems', 3),
      new Course('ME2', 'Major Elective II', 3),
      new Course('CEN452', 'Computer Engineering Design Project II', 2),
      new Course('CEN454', 'Computer Vision and Machine Learning', 3),
      new Course('ME3', 'Major Elective III', 3),
      new Course('CHE205', 'General Chemistry I ', 3),
      new Course('CHE201L', 'Chemistry Lab', 1),
      
      new Course('EEN340', 'Energy Conversion', 3),
      new Course('EEN220', 'Electric Circuits II', 3),
      new Course('EEN338', 'Electromagnetic Fields and Waves', 3),
      new Course('EEN335', 'Power Systems', 3),
      new Course('EEN337', 'Analog and Digital Communication', 3),
      new Course('EEN420', 'Autonomous Systems', 3),
      new Course('EEN366', 'Robotics and Control', 3),
      new Course('EEN310', 'Mechatronics', 3),
      new Course('EEN451', 'Electrical Engineering Design Project I', 3),
      new Course('EEN449', 'Renewable Energy', 3),
      new Course('EEN452', 'Electrical Engineering Design Project II', 2),
      new Course('EEN339', 'Communication Systems', 3),
      new Course('EEN413', 'Embedded Systems for Robotics', 3),
      new Course('EEN345', 'Power Systems', 3),
      new Course('EEN441', 'Power Systems', 3),

      new Course('AIRE305/AIN305', 'Artificial Intelligence for Engineers', 3),
      new Course('CEN401L', 'Embedded and IoT Lab', 3),
      new Course('AIRE310/AIN310', 'Machine Learning and Pattern Recognition', 3),
      new Course('CSC202L', 'Programming Lab', 3),
      new Course('CEN464L', 'Signal Processing Lab', 3),
      new Course('AIN482', 'Natural Language Processing', 3),
      new Course('AIN475', 'Self-Driving Cars', 3),
      new Course('AIN333', 'Mobile Computer Vision and Machine Learning', 3),
      new Course('AIRE410/AIN410', 'Deep Learning', 3),
      new Course('AIN451', 'Artificial Intelligence Engineering Design Project I', 3),
      new Course('AIN452', 'Artificial Intelligence Engineering Design Project II', 3),
      new Course('CE1', 'Concentration Elective I', 3),
      new Course('CE2', 'Concentration Elective II', 3),

      new Course('IEN220', 'Probability and Statistics', 3),
      new Course('RSN215', 'Engineering Mechanics', 3),
      new Course('RSN301', 'Energy Materials', 3),
      new Course('MEC320', 'Thermodynamics I', 3),
      new Course('MEC350', 'Fluid Mechanics', 3),
      new Course('RSN323', 'Modeling and Simulation of Energy Systems', 3),
      new Course('RSN352', 'Thermal Energy', 3),
      new Course('MEC410', 'Control Systems', 3),
      new Course('RSN460A', 'Hybrid Smart Vehicles Project - Materials & Energy', 3),
      new Course('RSN455', 'Wind Energy', 3),
      new Course('MEC420', 'Heat Transfer', 3),
      new Course('RSN450A', 'RSN Engineering Design Project I', 3),
      new Course('RSN460B', 'Hybrid Smart Vehicles Project - MEC Design', 3),
      new Course('RSN480A', 'Energy-Efficient Green Building Design I', 3),
      new Course('RSN399i', 'Internship in Renewable & Sustainable Energy Eng I', 2),
      new Course('RSN399ii', 'Internship in Renewable & Sustainable Energy Eng II', 1),
      new Course('RSN450B', 'RSN Engineering Design Project II', 2),
      new Course('RSN460C', 'Hybrid Smart Vehicles Project - AI Design', 3),
      new Course('RSN480B', 'Energy-Efficient Green Building Design II', 3),
      new Course('RSN477', 'Nuclear Energy', 3),
      new Course('RSN411', 'Grid Integration of Renewable Energy', 3),
      new Course('RSN485', 'Energy Storage', 3),
      new Course('RSN404', 'UAE Energy Regulations and Standards', 3),

      new Course('CEN399i', 'Internship in Computer Engineering I', 2),
      new Course('CEN399ii', 'Internship in Computer Engineering II', 1),
      new Course('EEN399i', 'Internship in Electrical Engineering I', 2),
      new Course('EEN399ii', 'Internship in Electrical Engineering II', 1),
      new Course('RSN399i', 'Internship in Renewable & Sustainable Energy Eng I', 2),
      new Course('RSN399ii', 'Internship in Renewable & Sustainable Energy Eng II', 1)
    ];
  }

  getCourses(): Course[] {
    return this.offeringsList;
  }

  getCourseByCode(code: string): Course | undefined {
    return this.offeringsList.find(course => course.code === code);
  }
}
