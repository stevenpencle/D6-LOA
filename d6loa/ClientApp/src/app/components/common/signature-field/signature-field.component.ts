import {
  Component,
  ViewChild,
  ElementRef,
  AfterContentInit,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import SignaturePad, { IOptions } from 'signature_pad';
import { HttpService } from 'src/app/services/http/http.service';
import {
  IStringResponse,
  IDocumentMetadata,
  ISignatureRequest
} from 'src/app/model/model';

@Component({
  selector: 'app-signature-field',
  templateUrl: './signature-field.component.html'
})
export class SignatureFieldComponent implements AfterContentInit, OnInit {
  @ViewChild('signatureCanvas', { static: true })
  private signatureCanvas: ElementRef<HTMLCanvasElement>;
  private signaturePad: SignaturePad;
  private options: IOptions = {};
  sig: string = null;

  // inputs
  @Input() penRGB: string;
  @Input() signatureBlobFolder: string;
  @Input() width = 300;
  @Input() height = 150;
  @Input() showSaveAndClear = true;
  @Input() readOnly = false;
  // model
  private blobId = '';
  @Output() signatureBlobIdChange: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Input() set signatureBlobId(value: string) {
    this.blobId = value;
  }

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterContentInit(): void {
    this.options.penColor =
      this.penRGB !== null && this.penRGB !== '' ? this.penRGB : 'rgb(0, 0, 0)';
    const canvas = this.signatureCanvas.nativeElement;
    this.signaturePad = new SignaturePad(canvas, this.options);
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
    this.resizeCanvas();
  }

  load(): void {
    this.httpService.post<ISignatureRequest, IStringResponse>(
      'api/Signature/Load',
      {
        currentSignatureId: this.blobId,
        signatureBlobStorageFolder: this.signatureBlobFolder,
        pngDataUrl: null
      },
      response => {
        if (response.data !== null) {
          this.sig = response.data;
        }
      }
    );
  }

  clear(): void {
    if (this.readOnly) {
      return;
    }
    this.signaturePad.clear();
    this.httpService.post<ISignatureRequest, IDocumentMetadata>(
      'api/Signature/Save',
      {
        currentSignatureId: this.blobId,
        signatureBlobStorageFolder: this.signatureBlobFolder,
        pngDataUrl: null
      },
      response => {
        if (response === null) {
          this.blobId = '';
          this.sig = null;
          this.signatureBlobIdChange.emit(this.blobId);
        }
      }
    );
  }

  save(): void {
    if (this.readOnly) {
      return;
    }
    if (this.isEmpty()) {
      console.log('signature is blank');
    } else {
      const pngDataUrl = this.signaturePad.toDataURL();
      this.httpService.post<ISignatureRequest, IDocumentMetadata>(
        'api/Signature/Save',
        {
          currentSignatureId: this.blobId,
          signatureBlobStorageFolder: this.signatureBlobFolder,
          pngDataUrl: pngDataUrl
        },
        response => {
          this.blobId = response.id;
          this.sig = pngDataUrl;
          this.signatureBlobIdChange.emit(this.blobId);
        }
      );
      console.log(pngDataUrl);
    }
  }

  isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }

  private resizeCanvas(): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const canvas = this.signatureCanvas.nativeElement;
    canvas.width = this.width * ratio;
    canvas.height = this.height * ratio;
    canvas.style.height = this.height.toString() + 'px';
    canvas.style.width = this.width.toString() + 'px';
    canvas.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear();
  }
}
