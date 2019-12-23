import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { IDocumentMetadata, IEdmsDocument } from '../../../model/model';
import { BlobService } from '../../../services/data/blob.service';
import { EdmsService } from 'src/app/services/data/edms.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent {
  hasErrors = false;
  errorMessage = '';
  filesToUpload: Array<File> = [];
  selectedFileNames: string[] = [];
  isLoadingData: Boolean = false;
  @ViewChild('fileUpload', { static: false })
  fileUploadVar: any;
  @Input()
  useEdms = false;
  @Input()
  blobDirectory: string;
  @Output()
  documentUploaded = new EventEmitter<IDocumentMetadata[] | IEdmsDocument[]>();
  @Input()
  accept: string;

  constructor(
    private blobService: BlobService,
    private edmsService: EdmsService
  ) {}

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
      const directory =
        this.blobDirectory == null
          ? ''
          : this.blobDirectory
              .toString()
              .toLowerCase()
              .trim();
      const formData: FormData = new FormData();
      for (let i = 0; i < this.filesToUpload.length; i++) {
        formData.append(
          directory,
          this.filesToUpload[i],
          this.filesToUpload[i].name
        );
      }
      if (this.useEdms) {
        this.edmsService.add(
          formData,
          edmsDocuments => {
            this.errorMessage = '';
            this.isLoadingData = false;
            this.selectedFileNames = [];
            this.filesToUpload = [];
            this.documentUploaded.emit(edmsDocuments);
          },
          (error: string) => {
            this.errorMessage = error;
            this.isLoadingData = false;
            this.selectedFileNames = [];
            this.filesToUpload = [];
          }
        );
      } else {
        this.blobService.add(
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
}
