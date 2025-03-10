import { Injectable } from '@angular/core';
import { Slot } from '../../data/slot';
import { ErrorDetail, ErrorType } from '../../data/errorDetail';

@Injectable({
  providedIn: 'root'
})
export class FacultyTimeConflictService {
  checkFacultyTimeConflicts(slots: Slot[]): ErrorDetail[] {
    let errors: ErrorDetail[] = [];
    let facultySchedules = new Map<string, Map<string, string>>(); // Faculty ID -> TimeSlot -> Campus

    slots.forEach(slot => {
      slot.sections.forEach(section => {
        let facultyId = section.faculty.id;
        let timeSlotKey = `${slot.days} ${slot.starttime}-${slot.endtime}`;

        if (!facultySchedules.has(facultyId)) {
          facultySchedules.set(facultyId, new Map());
        }

        let scheduledCampus = facultySchedules.get(facultyId)!.get(timeSlotKey);
        if (scheduledCampus && scheduledCampus !== section.campus) {
          errors.push({
            type: ErrorType.ERROR,
            message: `${section.faculty.name} has a scheduling conflict: assigned to both ${scheduledCampus} and ${section.campus} at ${timeSlotKey}.`
          });
        } else {
          facultySchedules.get(facultyId)!.set(timeSlotKey, section.campus);
        }
      });
    });

    return errors;
  }
}
