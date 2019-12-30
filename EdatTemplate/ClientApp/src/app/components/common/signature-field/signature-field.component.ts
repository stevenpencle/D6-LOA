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
  @ViewChild('canvasContainer', { static: true })
  private canvasContainer: ElementRef<HTMLDivElement>;
  @ViewChild('signatureCanvas', { static: true })
  private signatureCanvas: ElementRef<HTMLCanvasElement>;
  private signaturePad: SignaturePad;
  private options: IOptions = {};
  sig: string = null;

  // inputs
  @Input() penRGB: string;
  @Input() signatureBlobFolder: string;
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
    this.options.onEnd = () => {};
    const canvas = this.signatureCanvas.nativeElement;
    const canvasContainer = this.canvasContainer.nativeElement;
    canvas.height = canvasContainer.clientHeight;
    canvas.width = canvasContainer.clientWidth;
    this.signaturePad = new SignaturePad(canvas, this.options);
    this.signaturePad.clear();
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
    if (this.isEmpty()) {
      console.log('signature is blank');
    } else {
      const pngDataUrl = this.toPngDataURL();
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

  public isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }

  public toPngDataURL(): string {
    return this.signaturePad.toDataURL();
  }

  public fromPngDataURL(data: string): void {
    this.signaturePad.fromDataURL(data);
  }
}
