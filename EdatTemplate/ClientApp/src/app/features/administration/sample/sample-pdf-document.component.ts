import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  PdfDocumentService,
  PdfPage
} from 'src/app/services/data/pdf-document.service';

@Component({
  selector: 'app-sample-pdf-document',
  templateUrl: './sample-pdf-document.component.html'
})
export class SamplePdfDocumentComponent implements OnInit, OnDestroy {
  @ViewChild('pdfDocHeader', { static: true }) pdfDocHeader: ElementRef;
  @ViewChild('pdfDocPage1', { static: true }) pdfDocPage1: ElementRef;
  @ViewChild('pdfDocPage2', { static: true }) pdfDocPage2: ElementRef;
  @ViewChild('pdfDocPage3', { static: true }) pdfDocPage3: ElementRef;
  documentTitle = 'PDF Document Service Example';
  showDocumentTemplate = false;

  constructor(private pdfDocumentService: PdfDocumentService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  toggleShowTemplate(): void {
    this.showDocumentTemplate = !this.showDocumentTemplate;
  }

  createPdf(): void {
    const pages: Array<PdfPage> = [];
    const page1: PdfPage = {
      html: this.pdfDocPage1.nativeElement.innerHTML
    };
    pages.push(page1);
    const page2: PdfPage = {
      html: this.pdfDocPage2.nativeElement.innerHTML
    };
    pages.push(page2);
    const page3: PdfPage = {
      html: this.pdfDocPage3.nativeElement.innerHTML,
      orientation: 'l'
    };
    pages.push(page3);
    this.pdfDocumentService.fromHtml(
      pages,
      this.pdfDocHeader.nativeElement.innerHTML,
      'test.pdf'
    );
  }
}
