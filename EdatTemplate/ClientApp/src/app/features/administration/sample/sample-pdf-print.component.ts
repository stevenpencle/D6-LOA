import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { PdfDocumentService, PdfPage } from 'src/app/services/data/pdf-document.service';

@Component({
  selector: 'app-sample-pdf-print',
  templateUrl: './sample-pdf-print.component.html'
})
export class SamplePdfPrintComponent implements OnInit, OnDestroy {
  @ViewChild('pdfDocPage1', { static: true }) pdfDocPage1: ElementRef;
  @ViewChild('pdfDocPage2', { static: true }) pdfDocPage2: ElementRef;
  @ViewChild('pdfDocPage3', { static: true }) pdfDocPage3: ElementRef;
  documentTitle = 'This is the Title';

  constructor(private pdfDocumentService: PdfDocumentService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  createPdf(): void {
    const pages: Array<PdfPage> = [];
    const page1: PdfPage = {
      element: this.pdfDocPage1.nativeElement,
      orientation: 'p',
      pageMargin: null
    };
    pages.push(page1);
    const page2: PdfPage = {
      element: this.pdfDocPage2.nativeElement,
      orientation: 'p',
      pageMargin: null
    };
    pages.push(page2);
    const page3: PdfPage = {
      element: this.pdfDocPage3.nativeElement,
      orientation: 'l',
      pageMargin: {
        top: 80,
        bottom: 60,
        left: 40,
        width: 700
      }
    };
    pages.push(page3);
    this.pdfDocumentService.fromHtml(pages, 'test.pdf');
  }
}
