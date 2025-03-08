import { Component, Input } from '@angular/core';
import { Faculty } from '../../data/faculty';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-faculty-load',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-load.component.html',
  styleUrls: ['./faculty-load.component.css']
})
export class FacultyLoadComponent {
  @Input() faculty: Faculty[] = [];
}
