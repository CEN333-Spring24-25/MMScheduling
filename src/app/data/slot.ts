import { Section } from "./section";

export class Slot{
    code: number;
    days: string; 
    time: string; 
    sections: Section[]; 

    constructor(code: number, days: string, time: string){
        this.code = code; 
        this.days = days; 
        this.time = time; 
        this.sections = [];
    }
}