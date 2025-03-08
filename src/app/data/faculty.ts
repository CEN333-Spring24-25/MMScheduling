export class Faculty{
    id: string;
    name: string;
    load: number; 
    release: number; 
    campus: string;
    travels: number;
    constructor(id:string, name: string, load: number,release: number, campus: string, travels: number){
        this.id = id;
        this.name = name; 
        this.load = load; 
        this.release = release;
        this.campus = campus;
        this.travels = travels;
    }
}