import { Injectable } from '@angular/core';
import { Faculty } from '../../data/faculty';
import { ErrorDetail, ErrorType } from '../../data/errorDetail';

@Injectable({
  providedIn: 'root'
})
export class FacultyLoadService {
  checkFacultyLoad(faculty: Faculty[]): ErrorDetail[] {
    let warnings: ErrorDetail[] = [];

    faculty.forEach(fac => {
      let totalLoad = fac.load + fac.release;

      if (totalLoad < 12) {
        warnings.push({ type: ErrorType.WARNING, message: `${fac.name} is underloaded.` });
      } else if (totalLoad > 12) {
        warnings.push({ type: ErrorType.WARNING, message: `${fac.name} is overloaded.` });
      }
    });

    return warnings;
  }
}
