import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { OfferingsLoader } from './services/DataLoaders/offeringsLoader';
import { FacultyLoader } from './services/DataLoaders/facultyLoader';
import { CENProgramService } from './services/ProgramServices/CENProgramService';
import { EENProgramService } from './services/ProgramServices/EENProgramService';
import { EENROProgramService } from './services/ProgramServices/EENROProgramService';
import { RSNProgramService } from './services/ProgramServices/RSNProgramService';
import { BMEProgramService } from './services/ProgramServices/BMEProgramService';
import { AINProgramService } from './services/ProgramServices/AINProgramService';
import { CENAIProgramService } from './services/ProgramServices/CENAIProgramService';
import { Course } from './data/course';
import { Faculty } from './data/faculty';
import { Section } from './data/section';
import { Slot } from './data/slot';
import { Program } from './data/program';
import { FilterPipe } from './filters/filter.pipe';
import { FacultyLoadComponent } from './components/faculty-load/faculty-load.component';
import { getDatabase, ref, get, update, set } from 'firebase/database';
import { SlotsLoader } from './services/DataLoaders/slotsLoader';
import { ErrorsWarningsTableComponent } from './components/errors-warnings-table/errors-warnings-table.component';
import { ActionItemsComponent } from './components/action-items/action-items.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    FilterPipe,
    FacultyLoadComponent,
    ErrorsWarningsTableComponent,
    ActionItemsComponent
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
  versions: string[] = [];
  selectedVersion1: string = '';
  selectedVersion2: string = '';
  comparisonResults: string[] = [];
  scheduleDifferences: string[] = [];

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
    await this.loadAvailableVersions();
  }
  async saveVersion(): Promise<void> {
    const db = getDatabase();
    const versionNumber = `v${this.versions.length + 1}`;
    
    try {
      await set(ref(db, `scheduleVersions/${versionNumber}`), this.slots);
      console.log(`Schedule saved as ${versionNumber}`);
      this.versions.push(versionNumber);
    } catch (error) {
      console.error('Error saving schedule version:', error);
    }
  }
  async loadAvailableVersions(): Promise<void> {
    const db = getDatabase();
    try {
      const snapshot = await get(ref(db, 'scheduleVersions'));
      if (snapshot.exists()) {
        this.versions = Object.keys(snapshot.val());
        
      }
    } catch (error) {
      console.error('Error loading schedule versions:', error);
    }
  }
  async compareSchedules() {
    if (!this.selectedVersion1 || !this.selectedVersion2) {
        console.error("Error: Both versions must be selected.");
        return;
    }

    try {
        let db = getDatabase();
        let version1Ref = ref(db, `scheduleVersions/${this.selectedVersion1}`);
        let version2Ref = ref(db, `scheduleVersions/${this.selectedVersion2}`);

        let [version1Snapshot, version2Snapshot] = await Promise.all([
            get(version1Ref),
            get(version2Ref)
        ]);

        let schedule1: Slot[] = version1Snapshot.exists() ? Object.values(version1Snapshot.val()) : [];
        let schedule2: Slot[] = version2Snapshot.exists() ? Object.values(version2Snapshot.val()) : [];

        if (schedule1.length === 0 || schedule2.length === 0) {
            console.error("Error: One or both schedules are missing or empty.");
            return;
        }

        this.scheduleDifferences = this.getScheduleDifferences(schedule1, schedule2);
        console.log("Schedule Differences:", this.scheduleDifferences);
    } catch (error) {
        console.error("Error comparing schedules:", error);
    }
}


private getScheduleDifferences(schedule1: Slot[], schedule2: Slot[]): string[] {
  let changes: string[] = [];

  let slotMap1 = new Map(schedule1.map(slot => [slot.code, slot]));
  let slotMap2 = new Map(schedule2.map(slot => [slot.code, slot]));

  schedule1 = Object.values(schedule1);
  schedule2 = Object.values(schedule2);
  
  console.log("Schedule 1:", schedule1);
  console.log("Schedule 2:", schedule2);

  schedule1.forEach(slot1 => {
      let slot2 = slotMap2.get(slot1.code);

      let sections1 = slot1.sections || []; // Ensure sections1 is an array

      if (slot2) {
          let sections2 = slot2.sections || []; // Ensure sections2 is an array

          sections1.forEach(section1 => {
              let section2 = sections2.find(s => s.course.code === section1.course.code);
              
              if (!section2) {
                  changes.push(`Removed course ${section1.course.code} from ${slot1.days} ${slot1.starttime}-${slot1.endtime}`);
              }
          });
      } else {
          sections1.forEach(section => {
              changes.push(`Removed course ${section.course.code} from ${slot1.days} ${slot1.starttime}-${slot1.endtime}`);
          });
      }
  });

  schedule2.forEach(slot2 => {
      let slot1 = slotMap1.get(slot2.code);

      let sections2 = slot2.sections || []; // Ensure sections2 is an array

      sections2.forEach(section2 => {
          if (slot1) {
              let sections1 = slot1.sections || []; // Ensure sections1 is an array

              let section1 = sections1.find(s => s.course.code === section2.course.code);

              if (!section1) {
                  changes.push(`Assigned course ${section2.course.code} to ${slot2.days} ${slot2.starttime}-${slot2.endtime}`);
              }
          } else {
              changes.push(`Assigned course ${section2.course.code} to ${slot2.days} ${slot2.starttime}-${slot2.endtime}`);
          }
      });
  });

  return changes;
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

      targetSlot.sections = event.container.data;
      await this.updateSlotsInFirebase();
    }

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

  async resetDatabase(): Promise<void> {
    const db = getDatabase();
    try {
      console.log('Resetting Database...');
  
      await set(ref(db, 'slots'), {});
      await set(ref(db, 'sectionNeeds'), {});
      await set(ref(db, 'faculty'), {});
  
      console.log('Database cleared. Reinitializing data...');
  
      await this.slotsLoader.initializeSlotsInFirebase();
      this.slots = await this.slotsLoader.loadSlotsFromFirebase();
      this.faculty = await this.facultyLoader.fetchFacultyFromFirebase();
      this.needsList = [];
  
      await this.updateSectionNeedsInFirebase();
      await this.updateSlotsInFirebase();
  
      console.log('Database Reset Completed Successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  }


  
}
