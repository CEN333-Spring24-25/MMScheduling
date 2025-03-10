import { Injectable } from '@angular/core';
import { Slot } from '../../data/slot';
import { Faculty } from '../../data/faculty';
import { ErrorDetail, ErrorType } from '../../data/errorDetail';

@Injectable({
  providedIn: 'root'
})
export class FacultyCampusConflictService {
  checkFacultyCampusConflicts(slots: Slot[], faculty: Faculty[]): ErrorDetail[] {
    let warnings: ErrorDetail[] = [];
    let facultyDaySchedules = new Map<string, Map<string, Set<string>>>(); // Faculty ID -> Day -> Set of Campuses

    slots.forEach(slot => {
      slot.sections.forEach(section => {
        let facultyId = section.faculty.id;
        let day = slot.days;
        let campus = section.campus;

        if (!facultyDaySchedules.has(facultyId)) {
          facultyDaySchedules.set(facultyId, new Map());
        }

        if (!facultyDaySchedules.get(facultyId)!.has(day)) {
          facultyDaySchedules.get(facultyId)!.set(day, new Set());
        }

        facultyDaySchedules.get(facultyId)!.get(day)!.add(campus);
      });
    });

    facultyDaySchedules.forEach((daySchedule, facultyId) => {
      daySchedule.forEach((campuses, day) => {
        if (campuses.size > 1) {
          let facultyName = faculty.find(f => f.id === facultyId)?.name || 'Unknown Faculty';
          warnings.push({ type: ErrorType.WARNING, message: `${facultyName} is assigned to both AbuDhabi and AlAin on ${day}.` });
        }
      });
    });

    return warnings;
  }
}
