export class Course{
    code: string;
    title: string;
    credits: number;

    constructor(code: string, title: string, credits: number){
        this.code = code; 
        this.title = title; 
        this.credits = credits; 
    }
}