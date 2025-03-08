import { Injectable } from '@angular/core';
import { Program } from '../data/program';
import { CENProgramService } from './CENProgramService';
import { EENProgramService } from './EENProgramService';
import { BMEProgramService } from './BMEProgramService';
import { CENAIProgramService } from './CENAIProgramService';
import { EENROProgramService } from './EENROProgramService';
import { RSNProgramService } from './RSNProgramService';
import { AINProgramService } from './AINProgramService';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  constructor(
    private cenService: CENProgramService,
    private eenService: EENProgramService,
    private bmeService: BMEProgramService,
    private cenaiService: CENAIProgramService,
    private eenroService: EENROProgramService,
    private rsnService: RSNProgramService,
    private ainService: AINProgramService
  ) {}

  getProgram(programCode: string): Program | null {
    switch (programCode.toUpperCase()) {
      case 'CEN': return this.cenService.getProgram();
      case 'EEN': return this.eenService.getProgram();
      case 'BME': return this.bmeService.getProgram();
      case 'CENAI': return this.cenaiService.getProgram();
      case 'EENRO': return this.eenroService.getProgram();
      case 'RSN': return this.rsnService.getProgram();
      case 'AIN': return this.ainService.getProgram();
      default: return null;  
    }
  }
}
