import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CENProgramService } from './services/CENProgramService';
import { Course } from './data/course';
import { Faculty } from './data/faculty';
import { Section } from './data/section';

@Component({
  selector: 'app-root',
  imports: [CommonModule, DragDropModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  selectedCourse: Course | null = null;
  numSections: number = 0;
  sections: Section[] = [];
  nums: string[] = ['1','2','3','4','5','6','7','51','52','53','54','55','56','57','22/66','33/77','44/88','55/99'];

  campuses = ['Abu Dhabi', 'Al-Ain'];
  needsList: Section[] = [];
  courses: Course[] = [
  new Course('CEN320', 'Signals and Systems', 3),
  new Course('CSC301', 'Data Structures and Algorithms', 3),
  new Course('CSC305', 'Data Communications and Networks', 3),
  new Course('CEN304', 'Electronic Devices and Circuits', 3),
  new Course('CEN425', 'IoT: Applications & Networking', 3),
  ];
  adslot1: Section[] = [];
  adslot2: Section[] = [];
  adslot3: Section[] = [];
  adslot4: Section[] = [];
  adslot5: Section[] = [];
  adslot6: Section[] = [];
  adslot7: Section[] = [];
  adslot8: Section[] = [];
  adslot9: Section[] = [];
  adslot10: Section[] = [];
  adslot11: Section[] = [];
  adslot12: Section[] = [];
  adslot13: Section[] = [];
  adslot14: Section[] = [];
  adslot15: Section[] = [];
  adslot16: Section[] = [];
  adslot17: Section[] = [];
  aaslot1: Section[] = [];
  aaslot2: Section[] = [];
  aaslot3: Section[] = [];
  aaslot4: Section[] = [];
  aaslot5: Section[] = [];
  aaslot6: Section[] = [];
  aaslot7: Section[] = [];
  aaslot8: Section[] = [];
  aaslot9: Section[] = [];
  aaslot10: Section[] = [];
  aaslot11: Section[] = [];
  aaslot12: Section[] = [];
  aaslot13: Section[] = [];
  aaslot14: Section[] = [];
  aaslot15: Section[] = [];
  aaslot16: Section[] = [];
  aaslot17: Section[] = [];

  constructor(private programService: CENProgramService){}
  
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
        this.sections.push(new Section(this.nums[i], this.selectedCourse, new Faculty("-1","TBA",100,0,"UK"), "AD"));
      }
    }
  }

  onAddToNeedsList(): void {
    this.needsList = [...this.needsList, ...this.sections];
    this.sections = []; // Reset after adding
    this.numSections = 0; // Reset section count
    this.selectedCourse = null; // Reset course selection
  }

 

  drop(event: CdkDragDrop<Section[]>) {
    if (event.previousContainer === event.container) {
      // Move item within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move item to the other list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
