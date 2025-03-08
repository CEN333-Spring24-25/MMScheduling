import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], conditions: { campus?: string, days?: string }): any[] {
    return value.filter(item => {
      const campusMatch = conditions.campus ? item.campus === conditions.campus : true;
      const daysMatch = conditions.days ? item.days === conditions.days : true;
      return campusMatch && daysMatch;
    });
  }
}
