import {
  Component,
  ViewChild,
  ElementRef,
  AfterContentInit,
  Input
} from '@angular/core';
import SignaturePad, { IOptions } from 'signature_pad';

@Component({
  selector: 'app-signature-field',
  templateUrl: './signature-field.component.html'
})
export class SignatureFieldComponent implements AfterContentInit {
  @Input() penRGB: string;
  @ViewChild('canvasContainer', { static: true })
  private canvasContainer: ElementRef<HTMLDivElement>;
  @ViewChild('signatureCanvas', { static: true })
  private signatureCanvas: ElementRef<HTMLCanvasElement>;
  private signaturePad: SignaturePad;
  private options: IOptions = {};
  private pngDataURL: string = null;

  public ngAfterContentInit(): void {
    this.options.penColor =
      this.penRGB !== null && this.penRGB !== '' ? this.penRGB : 'rgb(0, 0, 0)';
    this.options.onEnd = () => {
      this.pngDataURL = this.toPngDataURL();
    };
    const canvas = this.signatureCanvas.nativeElement;
    const canvasContainer = this.canvasContainer.nativeElement;
    canvas.height = canvasContainer.clientHeight;
    canvas.width = canvasContainer.clientWidth;
    this.signaturePad = new SignaturePad(canvas, this.options);
    this.signaturePad.clear();
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  public clear(): void {
    this.signaturePad.clear();
    this.pngDataURL = null;
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

  private resizeCanvas(): void {
    const ratio: number = Math.max(window.devicePixelRatio || 1, 1);
    const canvas = this.signatureCanvas.nativeElement;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear();
    if (this.pngDataURL !== null) {
      this.fromPngDataURL(this.pngDataURL);
    }
  }
}
