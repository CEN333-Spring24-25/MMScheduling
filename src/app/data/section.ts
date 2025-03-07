import { Course } from './course';
import { Faculty } from './faculty';
export class Section{
    num: string; 
    course: Course;
    faculty: Faculty; 
    constructor(num: string, course: Course, faculty: Faculty){
        this.num = num;
        this.course = course; 
        this.faculty = faculty;
    }
}