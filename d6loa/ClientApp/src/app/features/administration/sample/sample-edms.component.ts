import { Component, OnInit } from '@angular/core';
import { IEdmsDocument } from 'src/app/model/model';
import { EdmsService } from 'src/app/services/data/edms.service';

@Component({
  selector: 'app-sample-edms',
  templateUrl: './sample-edms.component.html'
})
export class SampleEdmsComponent implements OnInit {
  edmsDocument: IEdmsDocument = {};

  constructor(private edmsService: EdmsService) {}

  ngOnInit(): void {}

  documentUploaded(edmsDocument: IEdmsDocument): void {
    this.edmsDocument = edmsDocument;
  }

  getDocument(edmsDocumentId: number, edmsDocumentName: string): void {
    this.edmsService.get(edmsDocumentId, edmsDocumentName);
  }

  reset(): void {
    this.edmsDocument = {};
  }
}
