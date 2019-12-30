import { Component, ViewChild, OnInit } from '@angular/core';
import { SignatureFieldComponent } from 'src/app/components/common/signature-field/signature-field.component';
import { HttpService } from 'src/app/services/http/http.service';
import {
  IStringRequest,
  IDocumentMetadata,
  IStringResponse
} from 'src/app/model/model';

@Component({
  selector: 'app-sample-signature',
  templateUrl: './sample-signature.component.html'
})
export class SampleSignatureComponent implements OnInit {
  @ViewChild(SignatureFieldComponent, { static: true })
  signature: SignatureFieldComponent;
  sig: string = null;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.httpService.get<IStringResponse>(
      'api/Sample/GetSignature',
      response => {
        if (response.data !== null) {
          this.sig = response.data;
        }
      }
    );
  }

  clear(): void {
    this.signature.clear();
    this.httpService.post<IStringRequest, IDocumentMetadata>(
      'api/Sample/SaveSignature',
      { data: null },
      () => {
        this.sig = null;
      }
    );
  }

  save(): void {
    if (this.signature.isEmpty()) {
      console.log('signature is blank');
    } else {
      const pngDataUrl = this.signature.toPngDataURL();
      this.httpService.post<IStringRequest, IDocumentMetadata>(
        'api/Sample/SaveSignature',
        { data: pngDataUrl },
        () => {
          this.load();
        }
      );
      console.log(pngDataUrl);
    }
  }
}
