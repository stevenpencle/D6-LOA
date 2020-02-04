import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnChanges
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { FilterEvent } from '../../../services/data/data-navigation.service';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html'
})
export class FilterFieldComponent implements OnInit, AfterViewInit, OnChanges {
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
  @Input() filterVal = '';
  @Output()
  filterValChange = new EventEmitter<string>();
  keyUp: Subscription;
  @ViewChild('filterText', { static: false })
  inputElRef: ElementRef;
  @ViewChild('filterSelect', { static: false })
  selectElRef: ElementRef;

  constructor() {}

  ngOnInit(): void {
    if (this.filterVal !== '') {
      this.filterValChange.emit(this.filterVal);
      this.invokeFilter();
    }
  }

  ngOnChanges(): void {
    if (this.filterVal === null) {
      this.filterVal = '';
    }
    this.filterValChange.emit(this.filterVal);
    this.invokeFilter();
  }

  ngAfterViewInit(): void {
    if (this.type === 'text') {
      const obs = fromEvent(this.inputElRef.nativeElement, 'keyup').pipe(
        map((i: any) => i.currentTarget.value)
      );
      const debouncedInput = obs.pipe(debounceTime(700));
      debouncedInput.subscribe(val => {
        this.filterVal = val;
        this.filterValChange.emit(this.filterVal);
        this.filter.emit({ field: this.field, value: val });
      });
    }
    if (this.type === 'select') {
      fromEvent(this.selectElRef.nativeElement, 'change')
        .pipe(map((i: any) => i.currentTarget.value))
        .subscribe(val => {
          this.filterVal = val;
          this.filterValChange.emit(this.filterVal);
          this.filter.emit({ field: this.field, value: val });
        });
    }
  }

  invokeFilter(): void {
    this.filter.emit({ field: this.field, value: this.filterVal.toString() });
  }
}
