import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SampleStoreService } from './sample-store.service';
import { ISample, IStaff } from '../../../model/model';
import { StatusCode } from '../../../model/model.enums';
import * as moment from 'moment';
import { StaffPickerComponent } from 'src/app/components/common/staff-picker/staff-picker.component';
import { ModelStateValidations } from 'src/app/services/http/http.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffService } from 'src/app/services/data/staff.service';
import { ToastService } from 'src/app/services/environment/toast.service';

@Component({
  selector: 'app-sample-modal',
  templateUrl: './sample-modal.component.html'
})
export class SampleModalComponent implements OnInit, OnDestroy {
  @ViewChild(StaffPickerComponent, { static: true })
  staffPickerComponent: StaffPickerComponent;
  hasErrors = false;
  errors = '';
  validations: ModelStateValidations;
  tempSample: ISample = {};
  statusCode = StatusCode;
  birthDate: moment.Moment;
  selectedStaff: IStaff;

  constructor(
    public activeModal: NgbActiveModal,
    private sampleStoreService: SampleStoreService,
    private staffService: StaffService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  clearErrors(): void {
    this.tempSample = {};
    this.birthDate = null;
    this.selectedStaff = null;
    this.hasErrors = false;
    this.errors = '';
    this.validations = new ModelStateValidations();
  }

  addNewSample(): void {
    this.setBirthDate(this.tempSample);
    this.sampleStoreService.add(
      this.tempSample,
      () => {
        this.clearErrors();
        this.activeModal.close();
        this.toastService.show('Sample added!', {
          classname: 'bg-success text-light',
          delay: 5000
        });
      },
      errors => {
        this.hasErrors = true;
        this.errors = errors.list();
        this.validations = errors;
      }
    );
  }

  editSample(): void {
    if (this.tempSample.id == null || this.tempSample.id === 0) {
      this.addNewSample();
    } else {
      this.setBirthDate(this.tempSample);
      this.tempSample.assignedFdotAppUser = null;
      this.tempSample.lastUpdatedAppUser = null;
      this.sampleStoreService.update(
        this.tempSample,
        () => {
          this.tempSample = {};
          this.clearErrors();
          this.activeModal.close();
          this.toastService.show('Sample updated!', {
            classname: 'bg-success text-light',
            delay: 5000
          });
        },
        errors => {
          this.hasErrors = true;
          this.errors = errors.list();
          this.validations = errors;
        }
      );
    }
  }

  changeAssignment(staff: IStaff) {
    if (staff == null) {
      this.tempSample.assignedFdotAppUserId = null;
    } else {
      this.staffService.saveFdotAppUser(staff, fdotAppUser => {
        this.tempSample.assignedFdotAppUserId = fdotAppUser.id;
      });
    }
  }

  private setBirthDate(sample: ISample): void {
    if (
      this.birthDate !== undefined &&
      this.birthDate !== null &&
      this.birthDate.isValid()
    ) {
      sample.birthDate = this.birthDate.toDate();
    } else {
      sample.birthDate = null;
    }
  }
}
