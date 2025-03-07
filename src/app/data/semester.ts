import { Course } from './course'
export class Semester{
    major: string; 
    type: string; 
    num: number; 
    courses: Course[];
    constructor(major: string, type: string, num: number, courses: Course[]){
        this.major = major;
        this.type = type;
        this.num = num; 
        this.courses = courses;
    }
}