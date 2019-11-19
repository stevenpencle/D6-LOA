import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { PdfDocumentService } from 'src/app/services/data/pdf-document.service';

@Component({
  selector: 'app-sample-pdf-print',
  templateUrl: './sample-pdf-print.component.html'
})
export class SamplePdfPrintComponent implements OnInit, OnDestroy {
  @ViewChild('pdfDocPage1', { static: true }) pdfDocPage1: ElementRef;
  @ViewChild('pdfDocPage2', { static: true }) pdfDocPage2: ElementRef;

  constructor(private pdfDocumentService: PdfDocumentService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  printToPdf(): void {
    this.pdfDocumentService.generateDocument([this.pdfDocPage1.nativeElement, this.pdfDocPage2.nativeElement]);
  }
}
