import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { DataNavigation } from '../../../services/data/data-navigation.service';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html'
})
export class SortButtonComponent<T> implements OnInit {
  @Output()
  sort = new EventEmitter<string>();
  @Input()
  label: string;
  @Input()
  textClass: string;
  @Input()
  field: string;

  @Input()
  sortData: DataNavigation<T>;

  ngOnInit(): void {}

  invokeSort(): void {
    this.sort.emit(this.field);
  }
}
