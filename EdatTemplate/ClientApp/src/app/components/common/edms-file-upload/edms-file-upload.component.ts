import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { IDocumentMetadata } from '../../../model/model';
import { EdmsService } from 'src/app/services/data/edms.service';

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
  @ViewChild('fileUpload', { static: false })
  fileUploadVar: any;
  @Input()
  blobDirectory: string;
  @Output()
  documentUploaded = new EventEmitter<IDocumentMetadata[]>();
  @Input()
  accept: string;

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
    } else if (this.filesToUpload.length > 3) {
      this.hasErrors = true;
      this.errorMessage = 'Please select a maximum of 3 files to upload.';
    } else {
      this.uploadFiles();
    }
  }

  private uploadFiles() {
    this.clearErrors();
    if (this.filesToUpload.length > 0) {
      this.isLoadingData = true;
      const formData: FormData = new FormData();
      for (let i = 0; i < this.filesToUpload.length; i++) {
        formData.append(
          'my file',
          this.filesToUpload[i],
          this.filesToUpload[i].name
        );
      }
      this.edmsService.add(
        formData,
        metadatas => {
          this.errorMessage = '';
          this.isLoadingData = false;
          this.selectedFileNames = [];
          this.filesToUpload = [];
          this.documentUploaded.emit(metadatas);
        },
        (error: string) => {
          this.errorMessage = error;
          this.isLoadingData = false;
          this.selectedFileNames = [];
          this.filesToUpload = [];
        }
      );
    }
  }
}
