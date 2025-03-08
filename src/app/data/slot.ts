import { Section } from "./section";

export class Slot{
    code: number;
    days: string; 
    starttime: string; 
    endtime: string;
    sections: Section[]; 
    campus: string; 
    constructor(code: number, days: string, starttime: string, endtime: string,sections: Section[], campus: string){
        this.code = code; 
        this.days = days; 
        this.starttime = starttime; 
        this.endtime = endtime; 
        this.sections = sections;
        this.campus = campus;
    }
}