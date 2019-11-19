import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

@Injectable()
export class PdfDocumentService {
  constructor() {}

  generateDocument(pages: Array<HTMLElement>): void {
    const margins = {
      top: 80,
      bottom: 60,
      left: 40,
      width: 522
    };
    const doc = new jsPDF('p', 'pt', 'letter');
    for (let i = 0; i < pages.length; i++) {
      doc.fromHTML(
        pages[i],
        margins.left,
        margins.top,
        {
          width: margins.width
        },
        () => {
          if (i + 1 === pages.length) {
            doc.save('test.pdf');
          }
        },
        margins
      );
      doc.addPage('letter', 'p');
    }
  }
}
