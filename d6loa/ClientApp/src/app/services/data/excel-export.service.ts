import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelExportService {
  completed: (ws: XLSX.WorkSheet, excelFileName: string) => void;
  constructor() {}

  // tslint:disable-next-line:max-line-length
  public export(
    json: any[],
    setHeadersCallback: (
      worksheet: XLSX.WorkSheet,
      complete: (worksheet: XLSX.WorkSheet, excelFileName: string) => void
    ) => void
  ): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    this.completed = (ws: XLSX.WorkSheet, excelFileName: string): void => {
      const workbook: XLSX.WorkBook = {
        Sheets: { data: ws },
        SheetNames: ['data']
      };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      this.saveAs(excelBuffer, excelFileName);
    };
    setHeadersCallback(worksheet, this.completed);
  }

  private saveAs(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const dt = new Date();
    const timeString: string =
      dt.getHours().toString() +
      dt.getMinutes().toString() +
      dt.getSeconds().toString();
    saveAs(data, fileName + '_' + timeString + EXCEL_EXTENSION);
  }
}
