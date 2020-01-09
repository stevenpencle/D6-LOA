import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { IEdmsDocument } from '../../../model/model';
import { EdmsService } from 'src/app/services/data/edms.service';
import { isInteger } from 'lodash';

@Component({
  selector: 'app-edms-file-upload',
  templateUrl: './edms-file-upload.component.html'
})
export class EdmsFileUploadComponent {
  hasErrors = false;
  errorMessage = '';
  filesToUpload: Array<File> = [];
  selectedFileNames: string[] = [];
  isLoadingData: Boolean = false;
  @ViewChild('fileUpload', { static: false }) fileUploadVar: any;
  @Output() documentUploaded = new EventEmitter<IEdmsDocument>();
  @Input() accept: string;
  @Input() documentTypeId: string | null = null;
  @Input() existingEdmsDocumentId: number | null = null;

  constructor(private edmsService: EdmsService) {}

  fileChangeEvent(fileInput: any) {
    this.clearErrors();
    this.filesToUpload = <Array<File>>fileInput.target.files;
    for (let i = 0; i < this.filesToUpload.length; i++) {
      this.selectedFileNames.push(this.filesToUpload[i].name);
    }
  }

  clearErrors() {
    this.hasErrors = false;
    this.errorMessage = '';
  }

  cancelUpload() {
    this.filesToUpload = [];
    this.fileUploadVar.nativeElement.value = '';
    this.selectedFileNames = [];
    this.clearErrors();
  }

  upload() {
    if (this.filesToUpload.length === 0) {
      this.hasErrors = true;
      this.errorMessage = 'Please select at least 1 file to upload.';
    } else if (this.filesToUpload.length > 1) {
      this.hasErrors = true;
      this.errorMessage = 'Please select a maximum of 1 file to upload.';
    } else {
      this.uploadFiles();
    }
  }

  private uploadFiles() {
    this.clearErrors();
    if (this.filesToUpload.length > 0) {
      this.isLoadingData = true;
      const formData: FormData = new FormData();

      if (this.filesToUpload.length === 1) {
        if (
          this.existingEdmsDocumentId !== null &&
          isInteger(this.existingEdmsDocumentId)
        ) {
          formData.append(
            this.existingEdmsDocumentId.toString(),
            this.filesToUpload[0],
            this.filesToUpload[0].name
          );
          this.edmsService.update(
            formData,
            edmsDocument => {
              this.errorMessage = '';
              this.isLoadingData = false;
              this.selectedFileNames = [];
              this.filesToUpload = [];
              this.documentUploaded.emit(edmsDocument);
            },
            (error: string) => {
              this.errorMessage = error;
              this.isLoadingData = false;
              this.selectedFileNames = [];
              this.filesToUpload = [];
            }
          );
        } else {
          if (this.documentTypeId !== null) {
            formData.append(
              this.documentTypeId,
              this.filesToUpload[0],
              this.filesToUpload[0].name
            );
            this.edmsService.add(
              formData,
              edmsDocument => {
                this.errorMessage = '';
                this.isLoadingData = false;
                this.selectedFileNames = [];
                this.filesToUpload = [];
                this.documentUploaded.emit(edmsDocument);
              },
              (error: string) => {
                this.errorMessage = error;
                this.isLoadingData = false;
                this.selectedFileNames = [];
                this.filesToUpload = [];
              }
            );
          } else {
            throw Error(
              'Either an existing EDMS document ID or valid EDMS document type must be provided'
            );
          }
        }
      }
    }
  }
}
