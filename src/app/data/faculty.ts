export class Faculty{
    id: string;
    name: string;
    load: number; 
    release: number; 
    campus: string;
    constructor(id:string, name: string, load: number,release: number, campus: string){
        this.id = id;
        this.name = name; 
        this.load = load; 
        this.release = release;
        this.campus = campus;
    }
}