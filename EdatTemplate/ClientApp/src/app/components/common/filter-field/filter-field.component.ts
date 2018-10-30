import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { FilterEvent } from '../../../services/data/data-navigation.service';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html'
})
export class FilterFieldComponent implements AfterViewInit {
  @Output()
  filter = new EventEmitter<FilterEvent>();
  @Input()
  label: string;
  @Input()
  field: string;
  @Input()
  type: 'text' | 'select';
  @Input()
  selectValues: Array<{ label: string; value: string }>;
  filterVal = '';
  keyUp: Subscription;
  @ViewChild('filterText')
  inputElRef: ElementRef;
  @ViewChild('filterSelect')
  selectElRef: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    if (this.type === 'text') {
      const obs = fromEvent(this.inputElRef.nativeElement, 'keyup').pipe(
        map((i: any) => i.currentTarget.value)
      );
      const debouncedInput = obs.pipe(debounceTime(1000));
      debouncedInput.subscribe(val => {
        this.filter.emit({ field: this.field, value: val });
      });
    }
    if (this.type === 'select') {
      fromEvent(this.selectElRef.nativeElement, 'change')
        .pipe(map((i: any) => i.currentTarget.value))
        .pipe()
        .subscribe(val => {
          this.filter.emit({ field: this.field, value: val });
        });
    }
  }

  invokeFilter(): void {
    this.filter.emit({ field: this.field, value: this.filterVal });
  }
}
