import { Component, OnInit } from '@angular/core';
import { IDocumentMetadata, IEdmsDocumentType } from '../../../model/model';
import { EdmsService } from 'src/app/services/data/edms.service';

@Component({
  selector: 'app-sample-edms',
  templateUrl: './sample-edms.component.html'
})
export class SampleEdmsComponent implements OnInit {
  documents: Array<IDocumentMetadata> = [];
  documentTypes: Array<IEdmsDocumentType> = [];
  selectedDocumentType: IEdmsDocumentType = null;

  constructor(private edmsService: EdmsService) {}

  ngOnInit(): void {
    this.edmsService.getDocumentTypes(documentTypes => {
      this.documentTypes = documentTypes;
      if (documentTypes.length > 0) {
        this.selectedDocumentType = documentTypes[0];
      }
    });
  }
}
