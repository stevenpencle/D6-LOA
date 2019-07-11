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
import { StaffPickerComponent } from 'src/app/components/common/staff-picker/staff-picker.component';
import { ModelStateValidations } from 'src/app/services/http/http.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 
import { Inject} from "@angular/core"; 
import { DOCUMENT } from "@angular/common"; 

@Component({
  selector: 'app-sample-modal',
  templateUrl: './sample-modal.component.html'
})
export class SampleModalComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtn', { static: true })
  closeBtn: ElementRef;
  @ViewChild(StaffPickerComponent, { static: true })
  staffPickerComponent: StaffPickerComponent;
  @ViewChild('modalContent', { static: true }) 
  modalContent: ElementRef;

  hasErrors = false;
  errors = '';
  validations: ModelStateValidations;
  tempSample: ISample = {};
  statusCode = StatusCode;
  birthDate: moment.Moment;
  selectedStaff: IStaff;

  constructor(
    private sampleStoreService: SampleStoreService,
    private staffService: StaffService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.closeEditModal();
  }

  private closeEditModal(): void {
    this.closeBtn.nativeElement.click();
  }

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
        this.closeEditModal();
      },
      errors => {
        this.hasErrors = true;
        this.errors = errors.list();
        this.validations = errors;
      }
    );
  }

  setTempSample(sample: ISample): void {
    this.clearErrors();
    this.staffPickerComponent.clearInput();
    if (sample.assignedStaffId != undefined && sample.assignedStaffId != null && sample.assignedStaffId > 0) {
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
      this.setBirthDate(this.tempSample);
      this.sampleStoreService.update(
        this.tempSample,
        () => {
          this.tempSample = {};
          this.clearErrors();
          this.closeEditModal();
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

  private setBirthDate(sample: ISample): void {
    if (this.birthDate != undefined && this.birthDate != null && this.birthDate.isValid()) {
      sample.birthDate = this.birthDate.toDate();
    } else {
      sample.birthDate = null;
    }
  }

  printtoPDF(): void{
   
    let selectedElement;
    var leftMargin = 15;
    //Get the DOM For the Div element Modal Content
    selectedElement = this.modalContent.nativeElement;
     //Scroll the element to the top in order to Capture
     this.document.documentElement.scrollTop = 0;
   

    // set up your pdf. This is in portrait mode, used millimeters for measurement, and the paper size is letter
    let pdf = new jsPDF('p', 'mm', 'letter');
    if (selectedElement!= null) {
   
        // pass your content into html2canvas, then set up the print job
        html2canvas(selectedElement).then(canvas => {

               var docWidth = pdf.internal.pageSize.getWidth();
               var docHeight = pdf.internal.pageSize.getHeight(); 
          
            if (selectedElement != null) {
  
                 // I used bitmap here but the image type seems irrelevant, however the canvas.toDataUrl is required
                const selectedElementUrl = canvas.toDataURL('image/png');
                 // use the image properties when scaling the image to fit the page
              const imageProperties = pdf.getImageProperties(selectedElementUrl);
              
                 // get the width of the image to maintain the ratio. This content is “tall” so I scale the width to maintain the aspect. 
                // I also reduced the width and height by 20 mm to leave a margin
              docWidth = ((imageProperties.width * docHeight) / imageProperties.height) - 20;
  
                 // add the image to the pdf
                pdf.addImage(selectedElementUrl, 'PNG', 10,10,docWidth,docHeight-20);
            //}
            
            var filename = this.tempSample.name.length>0 ?  this.tempSample.name : `New`;
           
            // save the pdf with whatever name you choose
           pdf.save(filename + " " +  'Modal.pdf');
           this.closeEditModal();
           
            }
        });
        
    }
  
  }


}
