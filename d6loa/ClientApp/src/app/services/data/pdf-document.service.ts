import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

export class PdfPageMargin {
  top: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export class PdfPage {
  html: string;
  orientation?: 'l' | 'p';
}
@Injectable()
export class PdfDocumentService {
  // Equivalent A4 paper dimensions in pixels at 300 DPI and 72 DPI respectively are:
  // 2480 pixels x 3508 pixels (print resolution)
  // 595 pixels x 842 pixels (screen resolution)

  portraitMargin: PdfPageMargin = {
    top: 40,
    bottom: 40,
    left: 40,
    width: 360,
    height: 545
  };

  landscapeMargin: PdfPageMargin = {
    top: 40,
    bottom: 40,
    left: 40,
    width: 545,
    height: 360
  };

  constructor() {}

  fromHtml(
    pages: Array<PdfPage>,
    header: string | null,
    fileName: string
  ): void {
    if (pages === undefined || pages === null || pages.length === 0) {
      return;
    }
    const doc = new jsPDF(pages[0].orientation, 'px', 'a4');
    for (let i = 0; i < pages.length; i++) {
      const margin =
        pages[i].orientation !== undefined && pages[i].orientation === 'l'
          ? this.landscapeMargin
          : this.portraitMargin;
      doc.setPage(i + 1);
      doc.setFont('courier');
      doc.setFontType('italic');
      doc.setFontSize(10);
      doc.text(
        (margin.left * 2 + margin.width) / 2,
        margin.height + margin.top + margin.bottom - 10,
        (i + 1).toString(),
        null,
        null,
        'center'
      );
      if (header !== null) {
        doc.fromHTML(
          header,
          margin.left,
          margin.top,
          {
            width: margin.width
          },
          null,
          margin
        );
      }
      const bodyMargin =
        header === null
          ? margin
          : {
              top: margin.top + 30,
              bottom: margin.bottom,
              left: margin.left,
              width: margin.width,
              height: margin.height
            };
      doc.fromHTML(
        pages[i].html,
        bodyMargin.left,
        bodyMargin.top,
        {
          width: bodyMargin.width
        },
        () => {
          if (i + 1 === pages.length) {
            doc.save(fileName);
          }
        },
        bodyMargin
      );
      if (i + 1 < pages.length) {
        doc.addPage('a4', pages[i + 1].orientation);
      }
    }
  }
}
