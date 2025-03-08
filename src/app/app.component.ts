import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
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
import { getDatabase, ref, get, update, set } from 'firebase/database';
import { SlotsLoader } from './services/slotsLoader';
import { ErrorsWarningsTableComponent } from './components/errors-warnings-table/errors-warnings-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    FilterPipe,
    FacultyLoadComponent,
    ErrorsWarningsTableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [FilterPipe],
})
export class AppComponent implements OnInit {
  selectedCourse: Course | null = null;
  selectedFaculty: Faculty | null = null;

  numSections: number = 1;
  sections: Section[] = [];
  nums: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '22/66',
    '33/77',
    '44/88',
    '55/99',
  ];

  faculty: Faculty[] = [];
  campuses = ['AbuDhabi', 'AlAin'];
  columnFilters = [
    { campus: 'AbuDhabi', days: 'MW' },
    { campus: 'AbuDhabi', days: 'TR' },
    { campus: 'AbuDhabi', days: 'F' },
    { campus: 'AlAin', days: 'MW' },
    { campus: 'AlAin', days: 'TR' },
    { campus: 'AlAin', days: 'F' },
  ];

  needsList: Section[] = [];
  courses: Course[] = [];
  slots: Slot[] = [];

  constructor(
    private slotsLoader: SlotsLoader,
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

  async ngOnInit() {
    this.faculty = await this.facultyLoader.fetchFacultyFromFirebase();
    await this.slotsLoader.initializeSlotsInFirebase();
    this.slots = await this.slotsLoader.loadSlotsFromFirebase();

    this.slots.forEach((slot) => {
      if (!slot.sections) {
        slot.sections = [];
      }
    });

    await this.loadSectionNeedsFromFirebase();
    const scheduledSections = new Set(
      this.slots.flatMap((slot) =>
        slot.sections ? slot.sections.map((s) => s.num) : []
      )
    );

    this.needsList = this.needsList.filter(
      (section) => !scheduledSections.has(section.num)
    );

    await this.updateSectionNeedsInFirebase();
    this.loadOfferedCourses();
  }

  loadOfferedCourses(): void {
    let allPrograms: Program[] = [
      this.cenService.getProgram(),
      this.eenService.getProgram(),
      this.eenroService.getProgram(),
      this.rsnService.getProgram(),
      this.bmeService.getProgram(),
      this.ainService.getProgram(),
      this.cenaiService.getProgram(),
    ];

    let offeredSemesters = [1, 3, 5, 7];
    let uniqueCourses = new Map<string, Course>();

    allPrograms.forEach((program) => {
      offeredSemesters.forEach((sem) => {
        if (program.semesters[sem - 1]) {
          program.semesters[sem - 1].courses.forEach((course) => {
            if (/^(RSN|AIN|ECS|BME|CEN|AIRE|EEN|CSC303)/.test(course.code)) {
              uniqueCourses.set(course.code, course);
            }
          });
        }
      });
    });

    this.courses = Array.from(uniqueCourses.values());
  }

  onCourseSelect(): void {
    this.sections = [];
  }

  onAddSections(): void {
    if (this.selectedCourse && this.numSections > 0) {
      for (let i = 0; i < this.numSections; i++) {
        this.sections.push(
          new Section(
            this.nums[i],
            this.selectedCourse,
            new Faculty('-1', 'TBD', 100, 0, 'UK', 0),
            'AD'
          )
        );
      }
    }
  }

  async onAddToNeedsList(): Promise<void> {
    this.needsList = [...this.needsList, ...this.sections];

    let facultyTravelDays = new Map<string, Set<string>>();

    this.sections.forEach((section) => {
      let assignedFaculty = this.faculty.find(
        (f) => f.id === section.faculty.id
      );
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

    this.faculty = this.faculty.map((member) => ({
      ...member,
      travels: facultyTravelDays.get(member.id)?.size || 0,
    }));

    await this.updateSectionNeedsInFirebase();

    this.sections = [];
    this.numSections = 0;
    this.selectedCourse = null;

    this.updateFacultyTravels();
  }

  async loadSectionNeedsFromFirebase(): Promise<void> {
    let db = getDatabase();
    try {
      const needsRef = ref(db, 'sectionNeeds');
      const snapshot = await get(needsRef);
      if (snapshot.exists()) {
        const allSections = snapshot.val() as Section[];

        const assignedSections = new Set(
          this.slots.flatMap((slot) => slot.sections.map((s) => s.num))
        );

        this.needsList = allSections.filter(
          (section) => !assignedSections.has(section.num)
        );

        console.log('Section Needs loaded from Firebase:', this.needsList);
      }
    } catch (error) {
      console.error('Error loading Section Needs from Firebase:', error);
    }
  }

  async updateSectionNeedsInFirebase(): Promise<void> {
    const db = getDatabase();
    try {
      const updatedNeedsList = this.needsList.reduce((acc, section) => {
        acc[section.num] = section;
        return acc;
      }, {} as Record<string, any>);

      await set(ref(db, 'sectionNeeds'), updatedNeedsList);
      console.log('Section Needs updated in Firebase successfully');
    } catch (error) {
      console.error('Error updating Section Needs in Firebase:', error);
    }
  }

  async drop(event: CdkDragDrop<Section[]>) {
    console.log('Previous Container:', event.previousContainer.id);
    console.log('New Container:', event.container.id);

    if (!event.previousContainer.data || !event.container.data) {
      console.error('Drop event contains undefined data.');
      return;
    }

    const movedSection = event.previousContainer.data[event.previousIndex];

    if (!movedSection) {
      console.error('⚠️ Moved section is undefined.');
      return;
    }

    console.log('Moving Section:', movedSection);

    if (event.previousContainer === event.container) {
      // Moving inside the same container
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Check if moving from needsList
      if (
        event.previousContainer.id === 'needsList' &&
        event.container.id !== 'needsList'
      ) {
        this.needsList = this.needsList.filter(
          (section) => section.num !== movedSection.num
        );
        await this.updateSectionNeedsInFirebase();
      }

      // Find the slot where the section is being added
      const targetSlot = this.slots.find(
        (slot) => slot.sections === event.container.data
      );
      if (!targetSlot) {
        console.error('⚠️ Could not find the target slot.');
        return;
      }

      console.log('Adding Section to Slot:', targetSlot.code);

      // Move the section to the new container
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Ensure the slot is updated properly
      targetSlot.sections = event.container.data;

      // Update Firebase with new slots
      await this.updateSlotsInFirebase();
    }

    // Update faculty travels
    this.updateFacultyTravels();
  }

  updateFacultyTravels(): void {
    let facultyTravelDays = new Map<string, Set<string>>();

    this.slots.forEach((slot) => {
      if (!slot.sections) slot.sections = [];
      slot.sections.forEach((section) => {
        let assignedFaculty = this.faculty.find(
          (f) => f.id === section.faculty.id
        );
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

    this.faculty = this.faculty.map((member) => ({
      ...member,
      travels: Array.from(facultyTravelDays.get(member.id) || []).reduce(
        (sum, day) => {
          if (day === 'MW' || day === 'TR') return sum + 2;
          if (day === 'F') return sum + 1;
          return sum;
        },
        0
      ),
    }));

    this.faculty.forEach((faculty) =>
      this.facultyLoader.updateFacultyInFirebase(faculty)
    );
  }

  async loadSlotsFromFirebase(): Promise<void> {
    const db = getDatabase();
    try {
      const slotsRef = ref(db, 'slots');
      const snapshot = await get(slotsRef);
      if (snapshot.exists()) {
        this.slots = Object.values(snapshot.val());
        console.log('Slots loaded from Firebase:', this.slots);
      } else {
        console.warn('⚠️ No slot data found in Firebase.');
      }
    } catch (error) {
      console.error('Error fetching slots from Firebase:', error);
    }
  }

  async updateSlotsInFirebase(): Promise<void> {
    const db = getDatabase();
    try {
      const slotUpdates = this.slots.reduce((acc, slot) => {
        acc[slot.code] = { ...slot, sections: slot.sections || [] };
        return acc;
      }, {} as Record<string, any>);

      await set(ref(db, 'slots'), slotUpdates);
      console.log('Slots updated in Firebase successfully.');
    } catch (error) {
      console.error('Error updating slots in Firebase:', error);
    }
  }
}
