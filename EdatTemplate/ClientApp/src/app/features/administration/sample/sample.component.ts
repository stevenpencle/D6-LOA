import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SampleStoreService } from './sample-store.service';
import {
  DataNavigation,
  DataNavigationService,
  FilterEvent
} from '../../../services/data/data-navigation.service';
import { SecurityService } from '../../../services/security/security.service';
import { ISample, IDocumentMetadata } from '../../../model/model';
import { SampleModalComponent } from './sample-modal.component';
import { StatusCode } from '../../../model/model.enums';
import * as linq from 'linq';
import { ExcelExportService } from '../../../services/data/excel-export.service';
import { BlobService } from '../../../services/data/blob.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html'
})
export class SampleComponent implements OnInit, OnDestroy {
  @ViewChild('closeBtnDelete')
  closeBtnDelete: ElementRef;
  @ViewChild(SampleModalComponent)
  sampleModal: SampleModalComponent;
  userId = '';
  checkUserId = '';
  tempSample: ISample = {};
  statusCode = StatusCode;
  data: DataNavigation<ISample>;
  filters: Array<FilterEvent> = [];
  documents: Array<IDocumentMetadata> = [];
  documentContainerName = 'SAMPLE_DOCUMENTS';

  constructor(
    private securityService: SecurityService,
    private sampleStoreService: SampleStoreService,
    private dataNavigationService: DataNavigationService,
    private excelExportService: ExcelExportService,
    private blobService: BlobService
  ) {}

  ngOnInit(): void {
    console.log('security service - component init subscription');
    this.securityService.subscribe(this, token => {
      if (token == null) {
        this.userId = '';
      } else {
        const userIdParts = token.userId.split('\\');
        if (userIdParts.length === 2) {
          this.userId = userIdParts[1];
        } else {
          this.userId = '';
        }
      }
    });
    console.log('sample store - component init subscription');
    this.sampleStoreService.subscribe(this, samples => {
      if (this.data == null) {
        this.data = this.dataNavigationService.init(samples, 'name', 3);
      } else {
        const resetPaging = this.data.sourceData.length > samples.length;
        this.data.sourceData = samples;
        this.dataNavigationService.filter(this.data, this.filters, resetPaging);
      }
    });
    this.getDocuments();
  }

  ngOnDestroy(): void {
    console.log('sample store - component destroy unsubscribe');
    this.sampleStoreService.unsubscribe(this);
    console.log('security service - component destroy unsubscribe');
    this.securityService.unsubscribe(this);
  }

  clearCheckUserId(): void {
    this.checkUserId = '';
  }

  sort(field: string): void {
    this.dataNavigationService.sort(this.data, field);
  }

  filter(event: FilterEvent): void {
    this.filters = linq
      .from(this.filters)
      .where(x => x.field !== event.field)
      .toArray();
    this.filters.push(event);
    this.dataNavigationService.filter(this.data, this.filters, true);
  }

  page(direction: 'next' | 'previous'): void {
    this.dataNavigationService.page(this.data, direction);
  }

  setTempSample(sample?: ISample): void {
    this.tempSample =
      sample == null
        ? {
            isActive: true,
            name: '',
            birthDate: null,
            status: this.statusCode.New,
            cost: 0,
            assignedStaffId: 0,
            assignedStaffName: ''
          }
        : Object.assign({}, sample);
    this.sampleModal.setTempSample(this.tempSample);
  }

  removeSample(): void {
    this.sampleStoreService.remove(this.tempSample, () => {
      this.tempSample = {};
      this.clearCheckUserId();
      this.closeBtnDelete.nativeElement.click();
    });
  }

  calculateAge(sample: ISample): number {
    return moment().diff(sample.birthDate, 'years');
  }

  export(): void {
    const exportData: any = linq
      .from(this.data.sortedFilteredData)
      .select<any>(x => {
        return {
          name: x.name,
          status:
            x.status === this.statusCode.New
              ? 'New'
              : x.status === this.statusCode.Approved
                ? 'Approved'
                : x.status === this.statusCode.Pending
                  ? 'Pending'
                  : '',
          birthDate: x.birthDate,
          cost: x.cost,
          assignedTo: x.assignedStaffName
        };
      })
      .toArray();
    this.excelExportService.export(exportData, (worksheet, completed) => {
      worksheet.A1.v = 'Name';
      worksheet.B1.v = 'Status';
      worksheet.C1.v = 'Birth Date';
      worksheet.D1.v = 'Cost';
      worksheet.E1.v = 'Assigned To';
      completed(worksheet, 'Sample_Export');
    });
  }

  documentUploaded(metadatas: IDocumentMetadata[]): void {
    if (metadatas && metadatas.length) {
      for (let i = 0; i < metadatas.length; i++) {
        console.log('document uploaded key = ' + metadatas[i].id);
      }
    }
    this.getDocuments();
  }

  getDocument(id: string, fileName: string): void {
    this.blobService.get(id, fileName);
  }

  removeDocument(id: string): void {
    this.blobService.remove(id, () => {
      this.getDocuments();
      this.clearCheckUserId();
    });
  }

  private getDocuments(): void {
    this.blobService.list(this.documentContainerName, result => {
      this.documents = result;
    });
  }
}
