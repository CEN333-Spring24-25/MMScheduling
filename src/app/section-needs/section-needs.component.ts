import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../data/course';
import { Faculty } from '../data/faculty';
import { Section } from '../data/section';
import { CENProgramService } from '../services/CENProgramService'

@Component({
  selector: 'app-section-needs',
  templateUrl: './section-needs.component.html',
  styleUrls: ['./section-needs.component.css'],
  imports: [CommonModule,FormsModule],
})
export class SectionNeedsComponent implements OnInit {
  // Dummy courses list (In real scenarios, you might fetch this data from the Program)
  courses: Course[] = [
    new Course('CEN320', 'Signals and Systems', 3),
    new Course('CSC301', 'Data Structures and Algorithms', 3),
    new Course('CSC305', 'Data Communications and Networks', 3),
    new Course('CEN304', 'Electronic Devices and Circuits', 3),
    new Course('CEN425', 'IoT: Applications & Networking', 3),
  ];

  // Selected course, sections, and faculty
  selectedCourse: Course | null = null;
  numSections: number = 0;
  sections: Section[] = [];
  facultyList: Faculty[] = [
    new Faculty('F001', 'Dr. John Doe', 20, 10, 'Abu Dhabi'),
    new Faculty('F002', 'Dr. Jane Smith', 20, 10, 'Al-Ain')
  ];

  selectedFaculty: Faculty | null = null;
  campuses = ['Abu Dhabi', 'Al-Ain'];

  needsList: Section[] = [];

  constructor(private programService: CENProgramService) {}

  ngOnInit(): void {}

  onCourseSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCourse = this.courses[selectElement.selectedIndex];
  
    if (selectedCourse) {
      this.selectedCourse = selectedCourse;
      this.sections = [];  // Reset sections on new course selection
    }
  }

  onAddSections(): void {
    if (this.selectedCourse && this.numSections > 0) {
      for (let i = 1; i <= this.numSections; i++) {
        this.sections.push(new Section(i.toString(), this.selectedCourse, this.selectedFaculty!, "AD"));
      }
    }
  }

  onAddToNeedsList(): void {
    this.needsList = [...this.needsList, ...this.sections];
    this.sections = []; // Reset after adding
    this.numSections = 0; // Reset section count
    this.selectedCourse = null; // Reset course selection
    this.selectedFaculty = null; // Reset faculty selection
  }
}
