import { Component, ViewChild } from '@angular/core';
import { SignatureFieldComponent } from 'src/app/components/common/signature-field/signature-field.component';

@Component({
  selector: 'app-sample-signature',
  templateUrl: './sample-signature.component.html'
})
export class SampleSignatureComponent {
  @ViewChild(SignatureFieldComponent, { static: true })
  signature: SignatureFieldComponent;

  clear(): void {
    this.signature.clear();
  }

  save(): void {
    if (this.signature.isEmpty()) {
      console.log('signature is blank');
    } else {
      console.log(this.signature.toPngDataURL());
    }
  }
}
