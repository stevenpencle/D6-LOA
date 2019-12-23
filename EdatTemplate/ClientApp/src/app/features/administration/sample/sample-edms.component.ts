import { Component, OnInit } from '@angular/core';
import { IEdmsDocument } from 'src/app/model/model';

@Component({
  selector: 'app-sample-edms',
  templateUrl: './sample-edms.component.html'
})
export class SampleEdmsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  documentUploaded(edmsDocuments: IEdmsDocument[]): void {
    // if (metadatas && metadatas.length) {
    //   for (let i = 0; i < metadatas.length; i++) {
    //     console.log('document uploaded key = ' + metadatas[i].id);
    //   }
    // }
    // this.getDocuments();
  }
}
