import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CENProgramService } from './services/CENProgramService';
import { Course } from './data/course';
import { Faculty } from './data/faculty';
import { Section } from './data/section';

export interface Item {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule,DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  list1: Section[] = [
    new Section('001', new Course('CEN305','Math 101',3), new Faculty('1', 'Dr. Smith', 12, 0, 'AD')),
    new Section('002', new Course('CEN325','Math 102',3), new Faculty('2', 'Dr. Medo', 12, 0, 'AD')),
    new Section('003', new Course('CEN405','Math 103',3), new Faculty('3', 'Dr. Ala', 12, 0, 'AD'))
  ];

  list2: Section[] = [
  ];

  drop(event: CdkDragDrop<Section[]>) {
    if (event.previousContainer === event.container) {
      // Move item within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move item to the other list
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
