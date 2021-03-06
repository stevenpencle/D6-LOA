import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  NgbModule,
  NgbDateAdapter,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IMaskModule } from 'angular-imask';
import { NgxSpinnerModule } from 'ngx-spinner';

// routing
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app/components/app/app.component';
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { NavMenuComponent } from './app/components/nav-menu/nav-menu.component';
import { HomeComponent } from './app/components/home/home.component';
import { FilterFieldComponent } from './app/components/common/filter-field/filter-field.component';
import { SortButtonComponent } from './app/components/common/sort-button/sort-button.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';
import { ServerErrorComponent } from './app/components/server-error/server-error.component';
import { StaffPickerComponent } from './app/components/common/staff-picker/staff-picker.component';
import { FileUploadComponent } from './app/components/common/file-upload/file-upload.component';
import { ChartToTableComponent } from './app/components/common/chart-to-table/chart-to-table.component';
import { DateFieldComponent } from './app/components/common/date-field/date-field.component';
import { FieldValidationMessageComponent } from './app/components/common/field-validation-message/field-validation-message.component';
import { ToastsContainerComponent } from './app/components/common/toasts-container/toasts-container.component';
import { SignatureFieldComponent } from './app/components/common/signature-field/signature-field.component';
import { MapFieldComponent } from './app/components/common/map-field/map-field.component';
import { EdmsFileUploadComponent } from './app/components/common/edms-file-upload/edms-file-upload.component';

// services
import { EnvironmentService } from './app/services/environment/environment.service';
import { DataMarshalerService } from './app/services/data/data-marshaler.service';
import { HttpService } from './app/services/http/http.service';
import { HttpConfigService } from './app/services/http/http-config.service';
import { SecurityService } from './app/services/security/security.service';
import { RouteGuard } from './app/services/security/route.guard';
import { DataNavigationService } from './app/services/data/data-navigation.service';
import { StaffService } from './app/services/data/staff.service';
import { EmailService } from './app/services/data/email.service';
import { NgbMomentDatePickerAdapter } from './app/services/data/ngbMomentDatePickerAdapter';
import { ExcelExportService } from './app/services/data/excel-export.service';
import { PdfDocumentService } from './app/services/data/pdf-document.service';
import { BlobService } from './app/services/data/blob.service';
import { EdmsService } from './app/services/data/edms.service';
import { LoadingService } from './app/services/environment/loading.service';
import { ToastService } from './app/services/environment/toast.service';

// features
// ** administration
// ** SAMPLE START
import { SampleComponent } from './app/features/administration/sample/sample.component';
import { SampleModalComponent } from './app/features/administration/sample/sample-modal.component';
import { SampleStoreService } from './app/features/administration/sample/sample-store.service';
import { SampleEmailComponent } from './app/features/administration/sample/sample-email.component';
import { SampleDocumentsComponent } from './app/features/administration/sample/sample-documents.component';
import { SampleDataComponent } from './app/features/administration/sample/sample-data.component';
import { SampleChartsComponent } from './app/features/administration/sample/sample-charts.component';
import { SamplePdfDocumentComponent } from './app/features/administration/sample/sample-pdf-document.component';
import { SampleEdmsComponent } from './app/features/administration/sample/sample-edms.component';
import { SampleSignatureComponent } from './app/features/administration/sample/sample-signature.component';
import { SampleMapComponent } from './app/features/administration/sample/sample-map.component';
import { VendorComponent } from './app/features/administration/vendor/vendor.component';
import { ContractComponent } from './app/features/administration/contract/contract.component';
import { SupplementalComponent } from './app/features/administration/supplemental/supplemental.component';
import { LoaComponent } from './app/features/administration/loa/loa.component';
import { InvoiceComponent } from './app/features/administration/invoice/invoice.component';
// ** SAMPLE END

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavMenuComponent,
    FilterFieldComponent,
    SortButtonComponent,
    StaffPickerComponent,
    FileUploadComponent,
    DateFieldComponent,
    FieldValidationMessageComponent,
    HomeComponent,
    NotAuthorizedComponent,
    ServerErrorComponent,
    ChartToTableComponent,
    ToastsContainerComponent,
    SignatureFieldComponent,
    MapFieldComponent,
    EdmsFileUploadComponent,
    // features
    // ** administration
    // ** SAMPLE START
    SampleComponent,
    SampleModalComponent,
    SampleEmailComponent,
    SampleDocumentsComponent,
    SampleEdmsComponent,
    SampleDataComponent,
    SampleChartsComponent,
    SamplePdfDocumentComponent,
    SampleSignatureComponent,
    SampleMapComponent,
    // ** SAMPLE END
    ContractComponent,
    VendorComponent,
    LoaComponent,
    InvoiceComponent,
    SupplementalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IMaskModule,
    NgbModule,
    NgxSpinnerModule,
  ],
  providers: [
    NgbActiveModal,
    EnvironmentService,
    DataMarshalerService,
    DataNavigationService,
    ExcelExportService,
    PdfDocumentService,
    StaffService,
    EmailService,
    BlobService,
    EdmsService,
    HttpService,
    HttpConfigService,
    SecurityService,
    RouteGuard,
    LoadingService,
    ToastService,
    // stores
    // ** administration
    // ** SAMPLE START
    SampleStoreService,
    // ** SAMPLE END
    { provide: NgbDateAdapter, useClass: NgbMomentDatePickerAdapter },
  ],
  entryComponents: [SampleModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
