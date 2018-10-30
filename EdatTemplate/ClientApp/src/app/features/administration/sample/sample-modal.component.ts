import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SampleStoreService } from './sample-store.service';
import { ISample, IStaff } from '../../../model/model';
import { StatusCode } from '../../../model/model.enums';
import * as moment from 'moment';
import { StaffService } from '../../../services/data/staff.service';

@Component({
  selector: 'app-sample-modal',
  templateUrl: './sample-modal.component.html'
})
export class SampleModalComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtn')
  closeBtn: ElementRef;

  hasErrors = false;
  errors = '';
  tempSample: ISample = {};
  statusCode = StatusCode;
  birthDate: moment.Moment;
  selectedStaff: IStaff;

  constructor(
    private sampleStoreService: SampleStoreService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  private closeEditModal(): void {
    this.closeBtn.nativeElement.click();
  }

  clearErrors(): void {
    this.tempSample = {};
    this.birthDate = null;
    this.selectedStaff = null;
    this.hasErrors = false;
    this.errors = '';
  }

  addNewSample(): void {
    this.setBirthDateAndCalculateAge(this.tempSample);
    this.sampleStoreService.add(
      this.tempSample,
      () => {
        this.clearErrors();
        this.closeEditModal();
      },
      errors => {
        this.hasErrors = true;
        this.errors = errors;
      }
    );
  }

  setTempSample(sample: ISample): void {
    this.hasErrors = false;
    this.errors = '';
    if (sample.assignedStaffId != null && sample.assignedStaffId > 0) {
      this.staffService.get(sample.assignedStaffId, staff => {
        this.selectedStaff = staff;
      });
    }
    if (sample.birthDate == null) {
      this.birthDate = null;
    } else {
      this.birthDate = moment(sample.birthDate);
    }
    this.tempSample = sample;
  }

  editSample(): void {
    if (this.tempSample.id == null || this.tempSample.id === 0) {
      this.addNewSample();
    } else {
      this.setBirthDateAndCalculateAge(this.tempSample);
      this.sampleStoreService.update(
        this.tempSample,
        () => {
          this.tempSample = {};
          this.clearErrors();
          this.closeEditModal();
        },
        errors => {
          this.hasErrors = true;
          this.errors = errors;
        }
      );
    }
  }

  changeAssignment(staff: IStaff) {
    if (staff == null) {
      this.tempSample.assignedStaffId = 0;
      this.tempSample.assignedStaffName = '';
    } else {
      this.tempSample.assignedStaffId = staff.id;
      this.tempSample.assignedStaffName =
        staff.firstName +
        ' ' +
        staff.lastName +
        ' (' +
        staff.district +
        '\\' +
        staff.racfId +
        ')';
    }
  }

  private setBirthDateAndCalculateAge(sample: ISample): void {
    if (this.birthDate != null && this.birthDate.isValid()) {
      sample.birthDate = this.birthDate.toDate();
    } else {
      sample.birthDate = null;
    }
  }
}
