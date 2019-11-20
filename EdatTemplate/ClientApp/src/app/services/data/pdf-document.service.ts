import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

export class PdfPageMargin {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

export class PdfPage {
  element: HTMLElement;
  orientation: 'l' | 'p';
  pageMargin: PdfPageMargin | null;
}
@Injectable()
export class PdfDocumentService {

  margin: PdfPageMargin = {
    top: 80,
    bottom: 60,
    left: 40,
    width: 520
  };

  constructor() {}

  fromHtml(pages: Array<PdfPage>, fileName: string): void {
    if (pages === undefined || pages === null || pages.length === 0) {
      return;
    }
    const doc = new jsPDF(pages[0].orientation, 'pt', 'letter');
    for (let i = 0; i < pages.length; i++) {
      const margin = pages[i].pageMargin === null ? this.margin : pages[i].pageMargin;
      doc.fromHTML(
        pages[i].element,
        margin.left,
        margin.top,
        {
          width: margin.width
        },
        () => {
          if (i + 1 === pages.length) {
            doc.save(fileName);
          }
        },
        margin
      );
      if (i + 1 < pages.length) {
        doc.addPage('letter', pages[i + 1].orientation);
      }
    }
  }
}
