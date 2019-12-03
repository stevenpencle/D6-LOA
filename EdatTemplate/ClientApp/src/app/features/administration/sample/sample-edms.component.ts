import { Component, OnInit } from '@angular/core';
import { IDocumentMetadata } from '../../../model/model';
import { BlobService } from '../../../services/data/blob.service';

@Component({
  selector: 'app-sample-edms',
  templateUrl: './sample-edms.component.html'
})
export class SampleEdmsComponent implements OnInit {
  documents: Array<IDocumentMetadata> = [];
  documentContainerName = 'SAMPLE_DOCUMENTS';

  constructor(private blobService: BlobService) {}

  ngOnInit(): void {
    this.getDocuments();
  }

  documentUploaded(metadatas: IDocumentMetadata[]): void {
    if (metadatas && metadatas.length) {
      for (let i = 0; i < metadatas.length; i++) {
        console.log('document uploaded key = ' + metadatas[i].id);
      }
    }
    this.getDocuments();
  }

  getDocument(id: string, fileName: string): void {
    this.blobService.get(id, fileName);
  }

  removeDocument(id: string): void {
    this.blobService.remove(id, () => {
      this.getDocuments();
    });
  }

  private getDocuments(): void {
    this.blobService.list(this.documentContainerName, result => {
      this.documents = result;
    });
  }
}
