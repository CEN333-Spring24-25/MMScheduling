import { Semester } from "./semester";

export class Program {
    semesters: Semester[];

    constructor() {
        this.semesters = [];
    }

    getSemesterByNumber(number: number): Semester | undefined {
        return this.semesters.find(s => s.num === number);
    }
}
