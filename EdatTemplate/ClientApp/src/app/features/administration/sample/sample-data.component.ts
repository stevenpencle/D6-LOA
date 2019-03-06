import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { SampleStoreService } from './sample-store.service';
import {
  DataNavigation,
  DataNavigationService,
  FilterEvent
} from '../../../services/data/data-navigation.service';
import { SecurityService } from '../../../services/security/security.service';
import { ISample } from '../../../model/model';
import { SampleModalComponent } from './sample-modal.component';
import { StatusCode } from '../../../model/model.enums';
import * as linq from 'linq';
import { ExcelExportService } from '../../../services/data/excel-export.service';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-sample-data',
  templateUrl: './sample-data.component.html'
})
export class SampleDataComponent implements OnInit, OnDestroy {
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
  @Input('observableFilter') observableFilter: string;

  constructor(
    private securityService: SecurityService,
    private sampleStoreService: SampleStoreService,
    private dataNavigationService: DataNavigationService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.securityService.safeSubscribe(
      this,
      token => {
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
      },
      () => {
        this.securityService.getToken();
      }
    );
    if (this.observableFilter == null || this.observableFilter.trim() === '') {
      this.sampleStoreService.safeSubscribe(
        this,
        samples => {
          this.dataChanged(samples);
        },
        () => {
          this.sampleStoreService.load();
        }
      );
    } else {
      this.sampleStoreService.safeSubscribeMap(
        this,
        samples => {
          return linq
            .from(samples)
            .where(x => x.name.startsWith(this.observableFilter))
            .toArray();
        },
        samples => {
          this.dataChanged(samples);
        },
        () => {
          this.sampleStoreService.load();
        }
      );
    }
  }

  dataChanged(samples: ISample[]): void {
    if (this.data == null) {
      this.data = this.dataNavigationService.init(samples, 'name', 3);
    } else {
      const resetPaging = this.data.sourceData.length > samples.length;
      this.data.sourceData = samples;
      this.dataNavigationService.filter(this.data, this.filters, resetPaging);
    }
    if (this.observableFilter == null || this.observableFilter.trim() === '') {
      this.sampleStoreService.replayState(state => {
        this.formatReplayState(state);
      });
    } else {
      this.sampleStoreService.replayStateMap(
        samples => {
          return linq
            .from(samples)
            .where(x => x.name.startsWith(this.observableFilter))
            .toArray();
        },
        state => {
          this.formatReplayState(state);
        }
      );
    }
  }

  formatReplayState(state: ISample[]): void {
    if (state == null) {
      return;
    }
    for (let i = 0; i < state.length; i++) {
      console.log(
        `id:${state[i].id}, isActive:${state[i].isActive}, name:${
          state[i].name
        }, status:${state[i].status}, birthDate:${state[i].birthDate}, cost:${
          state[i].cost
        }, assignedStaffName:${state[i].assignedStaffName}`
      );
    }
  }

  ngOnDestroy(): void {}

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
        : cloneDeep(sample);
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
}
