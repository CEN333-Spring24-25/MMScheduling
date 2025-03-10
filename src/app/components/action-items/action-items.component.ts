import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-action-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css'],
})
export class ActionItemsComponent {
  @Input() comparisonResults: string[] = [];
}
