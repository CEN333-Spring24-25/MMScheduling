import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CENProgramService } from './services/CENProgramService'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MMScheduling';
  constructor(cen: CENProgramService){
    console.log(cen.getProgram());

  } 
}
