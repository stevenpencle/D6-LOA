import { Component, OnInit, ViewChild } from '@angular/core';
import { SignatureFieldComponent } from 'src/app/components/common/signature-field/signature-field.component';

@Component({
  selector: 'app-sample-signature',
  templateUrl: './sample-signature.component.html'
})
export class SampleSignatureComponent implements OnInit {
  @ViewChild(SignatureFieldComponent, { static: true })
  private signatureField: SignatureFieldComponent;
  signatureId = '';

  constructor() {}

  ngOnInit(): void {}

  load(): void {
    this.signatureField.load();
  }
}
