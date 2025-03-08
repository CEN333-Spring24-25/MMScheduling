import { Injectable } from '@angular/core';
import { Faculty } from '../data/faculty';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, set } from 'firebase/database';
import { environment } from '../../environments/environment';

const firebaseApp = initializeApp(environment.firebaseConfig);
const db = getDatabase(firebaseApp);

@Injectable({
  providedIn: 'root'
})
export class FacultyLoader {
  facultyList: Faculty[] = [];

  constructor() {
    this.initializeFaculty();
  }

  private initializeFaculty(): void {
    this.facultyList = [
      new Faculty('1', 'Prof. Mohammed Ghazal', 0, 9, 'AbuDhabi', 0),
      new Faculty('2', 'Prof. Montasir Qasymeh', 0, 9, 'AbuDhabi', 0),
      new Faculty('3', 'Dr. Jawad Yousaf', 0, 0, 'AlAin', 0),
      new Faculty('4', 'Dr. Taimur Hassan', 0, 0, 'AbuDhabi', 0),
      new Faculty('5', 'Dr. Syed Gilani', 0, 0, 'AbuDhabi', 0),
      new Faculty('6', 'Dr. Huma Zia', 0, 0, 'AbuDhabi', 0),
      new Faculty('7', 'Dr. Ahmed Ali', 0, 0, 'AbuDhabi', 0),
      new Faculty('8', 'Dr. Mohamad Jama', 0, 0, 'AlAin', 0),
      new Faculty('9', 'Dr. Mohammed Moursi', 0, 0, 'AbuDhabi', 0),
      new Faculty('10', 'Dr. Awad', 0, 0, 'AlAin', 0),
      new Faculty('11', 'Dr. Abdalla', 0, 0, 'AlAin', 0),
      new Faculty('12', 'NewHire1', 0, 0, 'AbuDhabi', 0),
      new Faculty('13', 'NewHire2', 0, 0, 'AlAin', 0),
    ];
  }

  getFaculty(): Faculty[] {
    return this.facultyList;
  }
  async fetchFacultyFromFirebase(): Promise<Faculty[]> {
    try {
      const facultyRef = ref(db, 'faculty');
      const snapshot = await get(facultyRef);
      if (snapshot.exists()) {
        this.facultyList = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => {
          return new Faculty(id, data.name, data.load, data.release, data.campus, data.travels);
        });
        console.log('aculty list loaded from Firebase:', this.facultyList);
      } else {
        console.warn('⚠️ No faculty data found in Firebase.');
      }
    } catch (error) {
      console.error('Error fetching faculty from Firebase:', error);
    }
    return this.facultyList;
  }

  async updateFacultyInFirebase(faculty: Faculty): Promise<void> {
    try {
      await update(ref(db, `faculty/${faculty.id}`), {
        name: faculty.name,
        load: faculty.load,
        release: faculty.release,
        campus: faculty.campus,
        travels: faculty.travels
      });
      console.log(`Updated faculty ${faculty.name} in Firebase`);
    } catch (error) {
      console.error('Error updating faculty in Firebase:', error);
    }
  }

  async updateFacultyListToFirebase(): Promise<void> {
    try {
      const facultyUpdates = this.facultyList.reduce((acc, faculty) => {
        acc[faculty.id] = {
          name: faculty.name,
          load: faculty.load,
          release: faculty.release,
          campus: faculty.campus,
          travels: faculty.travels
        };
        return acc;
      }, {} as Record<string, any>);

      await set(ref(db, 'faculty'), facultyUpdates);
      console.log('Faculty list updated in Firebase successfully');
    } catch (error) {
      console.error('Error updating faculty list in Firebase:', error);
    }
  }
}
