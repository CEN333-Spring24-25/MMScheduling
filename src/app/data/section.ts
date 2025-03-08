import { Course } from './course';
import { Faculty } from './faculty';
export class Section{
    num: string; 
    course: Course;
    faculty: Faculty; 
    campus: string;
    constructor(num: string, course: Course, faculty: Faculty, campus: string){
        this.num = num;
        this.course = course; 
        this.faculty = faculty;
        this.campus = campus; 
    }
}