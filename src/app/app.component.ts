import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OfferingsLoader } from './services/offeringsLoader';
import { FacultyLoader } from './services/facultyLoader';
import { CENProgramService } from './services/CENProgramService';
import { EENProgramService } from './services/EENProgramService';
import { EENROProgramService } from './services/EENROProgramService';
import { RSNProgramService } from './services/RSNProgramService';
import { BMEProgramService } from './services/BMEProgramService';
import { AINProgramService } from './services/AINProgramService';
import { CENAIProgramService } from './services/CENAIProgramService';
import { Course } from './data/course';
import { Faculty } from './data/faculty';
import { Section } from './data/section';
import { Slot } from './data/slot';
import { Program } from './data/program';
import { FilterPipe } from './filters/filter.pipe';
import { FacultyLoadComponent } from './components/faculty-load/faculty-load.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, FilterPipe, FacultyLoadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [FilterPipe]
})
export class AppComponent implements OnInit {
  selectedCourse: Course | null = null;
  selectedFaculty: Faculty | null = null;

  numSections: number = 1;
  sections: Section[] = [];
  nums: string[] = ['1', '2', '3', '4', '5', '6', '7', '51', '52', '53', '54', '55', '56', '57', '22/66', '33/77', '44/88', '55/99'];

  faculty: Faculty[] = [];
  campuses = ['AbuDhabi', 'AlAin'];
  columnFilters = [
    { "campus": "AbuDhabi", "days": "MW" },
    { "campus": "AbuDhabi", "days": "TR" },
    { "campus": "AbuDhabi", "days": "F" },
    { "campus": "AlAin", "days": "MW" },
    { "campus": "AlAin", "days": "TR" },
    { "campus": "AlAin", "days": "F" }
  ];

  needsList: Section[] = [];
  courses: Course[] = [];
  slots: Slot[] = [];

  constructor(
    private offeringsLoader: OfferingsLoader,
    private facultyLoader: FacultyLoader,
    private cenService: CENProgramService,
    private eenService: EENProgramService,
    private eenroService: EENROProgramService,
    private rsnService: RSNProgramService,
    private bmeService: BMEProgramService,
    private ainService: AINProgramService,
    private cenaiService: CENAIProgramService
  ) {}

  ngOnInit(): void {
    this.loadFacultyFromFirebase(); // 🔥 Load faculty from Firebase on app start

    this.loadOfferedCourses(); // Load offered courses

    // Initialize slots dynamically
    const slotTimes = [
      { start: "09:00", end: "10:45" },
      { start: "10:55", end: "12:40" },
      { start: "12:50", end: "14:35" },
      { start: "15:00", end: "16:45" },
      { start: "16:55", end: "18:40" },
      { start: "18:50", end: "20:35" },
      { start: "20:45", end: "22:30" }
    ];

    const days = ["MW", "TR"];
    const locations = ["AbuDhabi", "AlAin"];

    locations.forEach(location => {
      days.forEach((day, index) => {
        slotTimes.forEach((time, i) => {
          this.slots.push(new Slot(index * slotTimes.length + i + 1, day, time.start, time.end, [], location));
        });
      });

      this.slots.push(new Slot(15, "F", "09:00", "12:30", [], location));
      this.slots.push(new Slot(16, "F", "03:00", "18:40", [], location));
      this.slots.push(new Slot(17, "F", "18:50", "10:30", [], location));
    });
}

async loadFacultyFromFirebase(): Promise<void> {
    this.faculty = await this.facultyLoader.fetchFacultyFromFirebase();
}


  loadOfferedCourses(): void {
    let allPrograms: Program[] = [
      this.cenService.getProgram(),
      this.eenService.getProgram(),
      this.eenroService.getProgram(),
      this.rsnService.getProgram(),
      this.bmeService.getProgram(),
      this.ainService.getProgram(),
      this.cenaiService.getProgram()
    ];

    let offeredSemesters = [1, 3, 5, 7];
    let uniqueCourses = new Map<string, Course>(); 

    allPrograms.forEach(program => {
      offeredSemesters.forEach(sem => {
        if (program.semesters[sem - 1]) {
          program.semesters[sem - 1].courses.forEach(course => {
            if (/^(RSN|AIN|ECS|BME|CEN|AIRE|EEN|CSC303)/.test(course.code)) {
              uniqueCourses.set(course.code, course);
            }
          });
        }
      });
    });

    this.courses = Array.from(uniqueCourses.values());
}


  onCourseSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCourse = this.courses[selectElement.selectedIndex] || null;
    this.sections = [];  // Reset sections on new course selection
  }


  onAddSections(): void {
    if (this.selectedCourse && this.numSections > 0) {
      for (let i = 0; i < this.numSections; i++) {
        this.sections.push(new Section(this.nums[i], this.selectedCourse, new Faculty("-1", "TBD", 100, 0, "UK",0), "AD",));
      }
    }
  }
  

  onAddToNeedsList(): void {
    this.needsList = [...this.needsList, ...this.sections];

    let facultyTravelDays = new Map<string, Set<string>>();

    this.sections.forEach(section => {
      let assignedFaculty = this.faculty.find(f => f.id === section.faculty.id);
      if (assignedFaculty) {
        assignedFaculty.load += 3; 

        if (assignedFaculty.campus !== section.campus) {
          if (!facultyTravelDays.has(assignedFaculty.id)) {
            facultyTravelDays.set(assignedFaculty.id, new Set());
          }
          facultyTravelDays.get(assignedFaculty.id)!.add(section.campus);
        }

        this.facultyLoader.updateFacultyInFirebase(assignedFaculty);
      }
    });

    this.faculty = this.faculty.map(member => ({
      ...member,
      travels: facultyTravelDays.get(member.id)?.size || 0
    }));

    this.sections = [];
    this.numSections = 0;
    this.selectedCourse = null;

    this.updateFacultyTravels();
}


drop(event: CdkDragDrop<Section[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.updateFacultyTravels();
}

updateFacultyTravels(): void {
  let facultyTravelDays = new Map<string, Set<string>>();

  this.slots.forEach(slot => {
    slot.sections.forEach(section => {
      let assignedFaculty = this.faculty.find(f => f.id === section.faculty.id);
      if (assignedFaculty) {
        if (assignedFaculty.campus !== section.campus) {
          if (!facultyTravelDays.has(assignedFaculty.id)) {
            facultyTravelDays.set(assignedFaculty.id, new Set());
          }
          facultyTravelDays.get(assignedFaculty.id)!.add(slot.days);
        }
      }
    });
  });

  this.faculty = this.faculty.map(member => ({
    ...member,
    travels: Array.from(facultyTravelDays.get(member.id) || []).reduce((sum, day) => {
      if (day === 'MW' || day === 'TR') return sum + 2;
      if (day === 'F') return sum + 1;
      return sum;
    }, 0)
  }));

  this.faculty.forEach(faculty => this.facultyLoader.updateFacultyInFirebase(faculty));
}

    
}
